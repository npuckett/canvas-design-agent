#!/usr/bin/env python3
"""Push pages and assignments from a course source folder straight into Canvas
via the Canvas REST API — no copy/paste, no import step.

Part of the canvas-design-agent project. Stdlib only. Requires Python 3.9+.

    ** Beta: test against a sandbox course before using on a live course. **

Setup (one time):
    1. In Canvas: Account -> Settings -> Approved Integrations -> "+ New Access Token".
       (Some institutions disable self-service tokens — if so, use the .imscc
       import workflow in build_imscc.py instead.)
    2. Export it in your shell:  export CANVAS_API_TOKEN="1234~..."

Usage:
    python3 canvas_api_sync.py <course-folder> \
        --base-url https://canvas.youruniversity.edu --course-id 12214 [options]

    --only pages/class-1.md     sync just one file (repeatable)
    --dry-run                   show what would be sent without sending
    --publish / --no-publish    override per-file published state

What it does:
    pages/*.md        PUT /api/v1/courses/:id/pages/:slug   (creates if missing)
    assignments/*.md  matched by exact title; PUT if found, POST if not
    syllabus.md       PUT /api/v1/courses/:id  (syllabus_body)

The markdown front matter and body format is identical to build_imscc.py —
one source tree serves both workflows. Canvas link tokens ($WIKI_REFERENCE$,
$CANVAS_COURSE_REFERENCE$) are rewritten to real /courses/:id/... paths
before sending, so the same source files work in both pipelines.
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from build_imscc import (  # noqa: E402
    load_course, parse_front_matter, parse_bool, parse_datetime, slugify,
    VALID_GRADING_TYPES, VALID_SUBMISSION_TYPES,
)


def api_request(base_url: str, token: str, method: str, path: str,
                payload: dict | None = None, dry_run: bool = False):
    url = f"{base_url.rstrip('/')}/api/v1{path}"
    if dry_run:
        print(f"  [dry-run] {method} {url}")
        if payload:
            print("            " + json.dumps(payload, indent=2).replace("\n", "\n            "))
        return {}
    data = json.dumps(payload).encode() if payload is not None else None
    request = urllib.request.Request(url, data=data, method=method, headers={
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
    })
    try:
        with urllib.request.urlopen(request) as response:
            return json.loads(response.read().decode())
    except urllib.error.HTTPError as err:
        detail = err.read().decode()[:500]
        sys.exit(f"error: Canvas API {method} {path} failed ({err.code}): {detail}")


def utc_iso(parsed: tuple) -> str:
    return parsed[0] + "Z"


def rewrite_tokens(body: str, course_id: str) -> str:
    """Rewrite .imscc-style link tokens into real course paths for API use."""
    body = body.replace("$WIKI_REFERENCE$", f"/courses/{course_id}")
    body = body.replace("$CANVAS_COURSE_REFERENCE$", f"/courses/{course_id}")
    return body


def sync_page(base_url, token, course_id, path: Path, tz, publish_override, dry_run):
    fm, body = parse_front_matter(path.read_text(encoding="utf-8"))
    slug = slugify(path.stem)
    title = fm.get("title") or path.stem.replace("-", " ").title()
    published = parse_bool(fm.get("published"), True) if publish_override is None else publish_override
    payload = {"wiki_page": {
        "title": title,
        "body": rewrite_tokens(body, course_id),
        "published": published,
    }}
    if parse_bool(fm.get("front_page"), False):
        payload["wiki_page"]["front_page"] = True
    print(f"page: {slug} ({title})")
    api_request(base_url, token, "PUT", f"/courses/{course_id}/pages/{slug}", payload, dry_run)


def sync_assignment(base_url, token, course_id, path: Path, tz,
                    existing: dict[str, int], group_ids: dict[str, int],
                    publish_override, dry_run):
    fm, body = parse_front_matter(path.read_text(encoding="utf-8"))
    title = fm.get("title") or path.stem.replace("-", " ").title()
    grading_type = fm.get("grading_type", "points")
    if grading_type not in VALID_GRADING_TYPES:
        sys.exit(f"error: {path.name}: bad grading_type {grading_type!r}")
    sub_types = [s.strip() for s in fm.get("submission_types", "online_upload").split(",") if s.strip()]
    bad = set(sub_types) - VALID_SUBMISSION_TYPES
    if bad:
        sys.exit(f"error: {path.name}: unknown submission_types {sorted(bad)}")
    published = parse_bool(fm.get("published"), True) if publish_override is None else publish_override

    assignment = {
        "name": title,
        "description": rewrite_tokens(body, course_id),
        "points_possible": float(fm.get("points", 100)),
        "grading_type": grading_type,
        "submission_types": sub_types,
        "published": published,
    }
    if fm.get("allowed_extensions"):
        assignment["allowed_extensions"] = [e.strip() for e in fm["allowed_extensions"].split(",")]
    for fm_key, api_key in (("due", "due_at"), ("unlock", "unlock_at"), ("lock", "lock_at")):
        if fm.get(fm_key):
            assignment[api_key] = utc_iso(parse_datetime(fm[fm_key], tz))
    if fm.get("group") and fm["group"] in group_ids:
        assignment["assignment_group_id"] = group_ids[fm["group"]]
    if fm.get("omit_from_final_grade"):
        assignment["omit_from_final_grade"] = parse_bool(fm.get("omit_from_final_grade"), False)

    payload = {"assignment": assignment}
    existing_id = existing.get(title)
    if existing_id:
        print(f"assignment: {title} (update #{existing_id})")
        api_request(base_url, token, "PUT",
                    f"/courses/{course_id}/assignments/{existing_id}", payload, dry_run)
    else:
        print(f"assignment: {title} (create)")
        api_request(base_url, token, "POST",
                    f"/courses/{course_id}/assignments", payload, dry_run)


def fetch_paginated(base_url, token, path: str) -> list[dict]:
    """Fetch all pages of a list endpoint (follows per_page=100 up to 10 pages)."""
    results: list[dict] = []
    for page in range(1, 11):
        chunk = api_request(base_url, token, "GET", f"{path}?per_page=100&page={page}")
        if not chunk:
            break
        results.extend(chunk)
        if len(chunk) < 100:
            break
    return results


def main() -> None:
    parser = argparse.ArgumentParser(description="Sync a course source folder to Canvas via the REST API.")
    parser.add_argument("source", type=Path)
    parser.add_argument("--base-url", required=True, help="e.g. https://canvas.youruniversity.edu")
    parser.add_argument("--course-id", required=True, help="numeric course id from the course URL")
    parser.add_argument("--only", action="append", type=Path, default=[],
                        help="sync only this file (path relative to source folder; repeatable)")
    parser.add_argument("--dry-run", action="store_true", help="print requests without sending")
    parser.add_argument("--publish", dest="publish", action="store_true", default=None)
    parser.add_argument("--no-publish", dest="publish", action="store_false")
    args = parser.parse_args()

    token = os.environ.get("CANVAS_API_TOKEN", "")
    if not token and not args.dry_run:
        sys.exit("error: set the CANVAS_API_TOKEN environment variable "
                 "(Canvas -> Account -> Settings -> New Access Token), or use --dry-run")

    source = args.source.resolve()
    course = load_course(source)
    tz = course["tz"]

    page_files = sorted((source / "pages").glob("*.md")) if (source / "pages").is_dir() else []
    assignment_files = sorted((source / "assignments").glob("*.md")) if (source / "assignments").is_dir() else []
    syllabus = source / "syllabus.md"
    if args.only:
        selected = {str((source / p).resolve()) for p in args.only}
        page_files = [p for p in page_files if str(p) in selected]
        assignment_files = [p for p in assignment_files if str(p) in selected]
        if str(syllabus.resolve()) not in selected:
            syllabus = None

    existing: dict[str, int] = {}
    group_ids: dict[str, int] = {}
    if assignment_files and not args.dry_run:
        for a in fetch_paginated(args.base_url, token, f"/courses/{args.course_id}/assignments"):
            existing[a["name"]] = a["id"]
        for g in fetch_paginated(args.base_url, token, f"/courses/{args.course_id}/assignment_groups"):
            group_ids[g["name"]] = g["id"]

    for path in page_files:
        sync_page(args.base_url, token, args.course_id, path, tz, args.publish, args.dry_run)
    for path in assignment_files:
        sync_assignment(args.base_url, token, args.course_id, path, tz,
                        existing, group_ids, args.publish, args.dry_run)
    if syllabus and syllabus.exists():
        _, body = parse_front_matter(syllabus.read_text(encoding="utf-8"))
        print("syllabus")
        api_request(args.base_url, token, "PUT", f"/courses/{args.course_id}",
                    {"course": {"syllabus_body": rewrite_tokens(body, args.course_id)}},
                    args.dry_run)

    total = len(page_files) + len(assignment_files) + (1 if syllabus and syllabus.exists() else 0)
    print(f"\n{'Would sync' if args.dry_run else 'Synced'} {total} item(s).")
    if not args.dry_run:
        print("Note: assignment groups/weights and modules are not created by this "
              "script — use build_imscc.py + Canvas import for full course structure.")


if __name__ == "__main__":
    main()
