#!/usr/bin/env python3
"""Canvas Designer — standalone desktop app shell.

Wraps the designer server (tools/designer.py) in a native macOS window
(pywebview / WKWebView). The server binds to 127.0.0.1 on a random free
port; the window loads it and exposes native folder dialogs to the page.

Build with app/build.sh (PyInstaller). Run from source:
    python3 app/designer_app.py
"""

from __future__ import annotations

import sys
import threading
from pathlib import Path

if not getattr(sys, "frozen", False):
    sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "tools"))

import webview  # noqa: E402  (pip install pywebview)

import designer  # noqa: E402


class Api:
    """Native capabilities exposed to the page as window.pywebview.api."""

    def choose_folder(self):
        result = webview.windows[0].create_file_dialog(webview.FOLDER_DIALOG)
        if not result:
            return None
        return result[0] if isinstance(result, (list, tuple)) else result


def initial_course() -> "Path | None":
    """Reopen the most recently used course if it still exists."""
    for p in designer.load_state().get("recent", []):
        path = Path(p)
        if path.is_dir() and (path / "course.md").is_file():
            return path
    return None


def main() -> None:
    server = designer.create_server(initial_course(), port=0)
    port = server.server_address[1]
    threading.Thread(target=server.serve_forever, daemon=True).start()
    webview.create_window(
        "Canvas Designer",
        f"http://127.0.0.1:{port}/",
        js_api=Api(),
        width=1320, height=880,
        min_size=(940, 620),
    )
    webview.start()


if __name__ == "__main__":
    main()
