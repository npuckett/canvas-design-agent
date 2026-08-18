#!/usr/bin/env python3
"""Local visual page designer for a Canvas course repo.

Part of the canvas-design-agent project. Stdlib only — no pip installs needed.
Requires Python 3.9+.

Usage:
    python3 tools/designer.py [course-folder] [--port 8730] [--no-browser]

Serves a browser-based block editor over the course folder (default: current
directory). Pages and assignments are read and written in the same format the
agent workflow and build_imscc.py use — front matter + Canvas-safe HTML body —
so the designer and the agent can be used interchangeably on the same repo.

The server binds to 127.0.0.1 only and restricts file access to markdown
content files inside the course folder.
"""

from __future__ import annotations

import argparse
import json
import subprocess
import sys
import webbrowser
from http.server import HTTPServer, BaseHTTPRequestHandler
from pathlib import Path
from urllib.parse import urlparse, parse_qs

APP_DIR = Path(__file__).resolve().parent / "designer"

# Content files the editor may read/write, relative to the course root.
EDITABLE_DIRS = ("pages", "assignments")
EDITABLE_ROOT_FILES = ("syllabus.md", "style.md", "course.md", "modules.md", "groups.md")

# Front-matter keys written in this order when present; unknown keys follow.
FM_KEY_ORDER = (
    "title", "front_page", "published", "group", "points", "grading_type",
    "submission_types", "allowed_extensions", "due", "unlock", "lock",
    "group_category", "peer_reviews", "peer_review_count",
    "omit_from_final_grade", "position",
)

STATIC_TYPES = {
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".svg": "image/svg+xml",
    ".png": "image/png",
}


def parse_front_matter(text: str) -> tuple[dict, str]:
    """Parse a `key: value` front matter block delimited by --- lines.

    Mirrors tools/build_imscc.py so both tools accept the same files.
    Returns (front_matter_dict, body).
    """
    lines = text.split("\n")
    if not lines or lines[0].strip() != "---":
        return {}, text
    fm: dict = {}
    i = 1
    while i < len(lines):
        line = lines[i]
        if line.strip() == "---":
            return fm, "\n".join(lines[i + 1:]).lstrip("\n")
        if line.strip():
            if ":" not in line:
                raise ValueError(f"Bad front matter line (expected 'key: value'): {line!r}")
            key, _, value = line.partition(":")
            fm[key.strip()] = value.strip()
        i += 1
    raise ValueError("Front matter block not closed with '---'")


def serialize_front_matter(fm: dict, body: str) -> str:
    keys = [k for k in FM_KEY_ORDER if k in fm and str(fm[k]).strip() != ""]
    keys += [k for k in fm if k not in FM_KEY_ORDER and str(fm[k]).strip() != ""]
    lines = ["---"] + [f"{k}: {fm[k]}" for k in keys] + ["---", ""]
    return "\n".join(lines) + body.rstrip("\n") + "\n"


class Designer:
    """File and build operations, path-sandboxed to the course root."""

    def __init__(self, root: Path):
        self.root = root.resolve()

    def _safe_path(self, rel: str) -> Path:
        """Resolve a repo-relative path, refusing anything outside the allowed set."""
        p = (self.root / rel).resolve()
        if not str(p).startswith(str(self.root) + "/") and p != self.root:
            raise PermissionError(f"path escapes course folder: {rel}")
        rel_parts = p.relative_to(self.root).parts
        if len(rel_parts) == 1 and rel_parts[0] in EDITABLE_ROOT_FILES:
            return p
        if (
            len(rel_parts) == 2
            and rel_parts[0] in EDITABLE_DIRS
            and rel_parts[1].endswith(".md")
        ):
            return p
        raise PermissionError(f"not an editable course file: {rel}")

    def course_info(self) -> dict:
        info: dict = {
            "root": str(self.root),
            "name": self.root.name,
            "course": {},
            "style": None,
            "pages": [],
            "assignments": [],
            "canBuild": self._build_script() is not None,
        }
        course_md = self.root / "course.md"
        if course_md.is_file():
            try:
                fm, _ = parse_front_matter(course_md.read_text(encoding="utf-8"))
                info["course"] = fm
            except ValueError:
                pass
        style_md = self.root / "style.md"
        if style_md.is_file():
            info["style"] = style_md.read_text(encoding="utf-8")
        for kind in EDITABLE_DIRS:
            folder = self.root / kind
            if not folder.is_dir():
                continue
            for path in sorted(folder.glob("*.md")):
                entry = {"path": f"{kind}/{path.name}", "slug": path.stem}
                try:
                    fm, _ = parse_front_matter(path.read_text(encoding="utf-8"))
                    entry["title"] = fm.get("title", path.stem)
                    if kind == "assignments":
                        for k in ("points", "due", "group"):
                            if k in fm:
                                entry[k] = fm[k]
                    if fm.get("front_page", "").lower() == "true":
                        entry["front_page"] = True
                except ValueError as exc:
                    entry["title"] = path.stem
                    entry["error"] = str(exc)
                info[kind].append(entry)
        for name in ("syllabus.md",):
            if (self.root / name).is_file():
                info["pages"].append({"path": name, "slug": "syllabus", "title": "Syllabus"})
        return info

    def read_file(self, rel: str) -> dict:
        p = self._safe_path(rel)
        if not p.is_file():
            raise FileNotFoundError(rel)
        fm, body = parse_front_matter(p.read_text(encoding="utf-8"))
        return {"path": rel, "frontmatter": fm, "body": body}

    def save_file(self, rel: str, frontmatter: dict, body: str) -> dict:
        p = self._safe_path(rel)
        if not p.parent.is_dir():
            p.parent.mkdir(parents=True)
        p.write_text(serialize_front_matter(frontmatter, body), encoding="utf-8")
        return {"path": rel, "ok": True}

    def create_file(self, kind: str, slug: str, title: str) -> dict:
        if kind not in EDITABLE_DIRS:
            raise PermissionError(f"unknown content type: {kind}")
        slug = "".join(c if c.isalnum() or c in "-_" else "-" for c in slug.strip().lower())
        if not slug:
            raise ValueError("empty slug")
        rel = f"{kind}/{slug}.md"
        p = self._safe_path(rel)
        if p.exists():
            raise FileExistsError(rel)
        fm = {"title": title or slug}
        if kind == "assignments":
            fm.update({"points": "10", "submission_types": "online_upload"})
        self.save_file(rel, fm, "")
        return {"path": rel}

    def read_styles(self) -> dict:
        p = self.root / "styles.json"
        if not p.is_file():
            return {"styles": [], "default": None}
        try:
            data = json.loads(p.read_text(encoding="utf-8"))
            return {"styles": data.get("styles", []), "default": data.get("default")}
        except (json.JSONDecodeError, OSError) as exc:
            return {"styles": [], "default": None, "error": str(exc)}

    def save_styles(self, styles: list, default) -> dict:
        p = self.root / "styles.json"
        p.write_text(json.dumps({"default": default, "styles": styles}, indent=2) + "\n",
                     encoding="utf-8")
        return {"ok": True}

    def _build_script(self) -> Path | None:
        for candidate in (self.root / "tools" / "build_imscc.py",
                          Path(__file__).resolve().parent / "build_imscc.py"):
            if candidate.is_file():
                return candidate
        return None

    def build(self) -> dict:
        script = self._build_script()
        if script is None:
            return {"ok": False, "output": "build_imscc.py not found (expected in tools/)"}
        out = self.root / "dist" / f"{self.root.name}.imscc"
        out.parent.mkdir(exist_ok=True)
        proc = subprocess.run(
            [sys.executable, str(script), str(self.root), "-o", str(out)],
            capture_output=True, text=True, timeout=120,
        )
        return {
            "ok": proc.returncode == 0,
            "output": (proc.stdout + proc.stderr).strip(),
            "imscc": str(out) if proc.returncode == 0 else None,
        }


class Handler(BaseHTTPRequestHandler):
    designer: Designer  # set by serve()

    # -- helpers ---------------------------------------------------------
    def _json(self, data: dict, status: int = 200) -> None:
        payload = json.dumps(data).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)

    def _error(self, exc: Exception) -> None:
        status = 404 if isinstance(exc, FileNotFoundError) else \
                 403 if isinstance(exc, PermissionError) else \
                 409 if isinstance(exc, FileExistsError) else 400
        self._json({"error": str(exc)}, status)

    def _body_json(self) -> dict:
        length = int(self.headers.get("Content-Length", 0))
        return json.loads(self.rfile.read(length).decode("utf-8")) if length else {}

    def log_message(self, fmt, *args):  # quieter default logging
        pass

    # -- routes ----------------------------------------------------------
    def do_GET(self):
        url = urlparse(self.path)
        try:
            if url.path == "/api/course":
                self._json(self.designer.course_info())
            elif url.path == "/api/styles":
                self._json(self.designer.read_styles())
            elif url.path == "/api/file":
                rel = parse_qs(url.query).get("path", [""])[0]
                self._json(self.designer.read_file(rel))
            else:
                self._static(url.path)
        except Exception as exc:  # noqa: BLE001 — surface as HTTP error
            self._error(exc)

    def do_POST(self):
        url = urlparse(self.path)
        try:
            data = self._body_json()
            if url.path == "/api/save":
                self._json(self.designer.save_file(
                    data["path"], data.get("frontmatter", {}), data.get("body", "")))
            elif url.path == "/api/create":
                self._json(self.designer.create_file(
                    data["type"], data["slug"], data.get("title", "")))
            elif url.path == "/api/styles":
                self._json(self.designer.save_styles(
                    data.get("styles", []), data.get("default")))
            elif url.path == "/api/build":
                self._json(self.designer.build())
            else:
                self._json({"error": "unknown endpoint"}, 404)
        except Exception as exc:  # noqa: BLE001
            self._error(exc)

    def _static(self, path: str) -> None:
        rel = "index.html" if path in ("/", "") else path.lstrip("/")
        p = (APP_DIR / rel).resolve()
        if not str(p).startswith(str(APP_DIR)) or not p.is_file():
            self._json({"error": f"not found: {path}"}, 404)
            return
        data = p.read_bytes()
        self.send_response(200)
        self.send_header("Content-Type", STATIC_TYPES.get(p.suffix, "application/octet-stream"))
        self.send_header("Content-Length", str(len(data)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(data)


def serve(root: Path, port: int, open_browser: bool) -> None:
    Handler.designer = Designer(root)
    server = HTTPServer(("127.0.0.1", port), Handler)
    url = f"http://127.0.0.1:{port}/"
    print(f"Canvas Designer — editing {root}")
    print(f"Open {url}  (Ctrl+C to stop)")
    if open_browser:
        webbrowser.open(url)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopped.")


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("course", nargs="?", default=".", help="course folder (default: current dir)")
    ap.add_argument("--port", type=int, default=8730)
    ap.add_argument("--no-browser", action="store_true")
    args = ap.parse_args()
    root = Path(args.course).resolve()
    if not root.is_dir():
        sys.exit(f"error: not a folder: {root}")
    serve(root, args.port, not args.no_browser)


if __name__ == "__main__":
    main()
