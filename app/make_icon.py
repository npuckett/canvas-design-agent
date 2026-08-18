#!/usr/bin/env python3
"""Generate Canvas Designer.icns with no external dependencies.

Draws a 1024px flat icon (rounded indigo square, three white content
"blocks" echoing the editor's block model) as a raw PNG, then uses macOS
`sips` + `iconutil` to produce the .icns.
"""

from __future__ import annotations

import struct
import subprocess
import sys
import zlib
from pathlib import Path

SIZE = 1024
BG = (11, 87, 208)        # editor primary blue
BG_BOTTOM = (8, 60, 145)  # subtle vertical gradient
WHITE = (255, 255, 255)


def rounded_rect_alpha(x: float, y: float, x0: float, y0: float, x1: float, y1: float, r: float) -> float:
    """1 inside the rounded rect, 0 outside, smooth 1px edge."""
    cx = min(max(x, x0 + r), x1 - r)
    cy = min(max(y, y0 + r), y1 - r)
    d = ((x - cx) ** 2 + (y - cy) ** 2) ** 0.5
    return max(0.0, min(1.0, r - d + 0.5)) if d > r - 1 else 1.0


def make_png(path: Path) -> None:
    margin = 100
    corner = 180
    blocks = [  # (x0, y0, x1, y1, alpha) — header bar + two columns
        (240, 280, 784, 420, 1.0),
        (240, 470, 496, 744, 0.85),
        (528, 470, 784, 744, 0.85),
    ]
    rows = []
    for y in range(SIZE):
        row = bytearray([0])  # filter byte
        t = y / SIZE
        bg = tuple(round(BG[i] + (BG_BOTTOM[i] - BG[i]) * t) for i in range(3))
        for x in range(SIZE):
            a = rounded_rect_alpha(x, y, margin, margin, SIZE - margin, SIZE - margin, corner)
            if a == 0:
                row += bytes((0, 0, 0, 0))
                continue
            px = bg
            for (bx0, by0, bx1, by1, ba) in blocks:
                b = rounded_rect_alpha(x, y, bx0, by0, bx1, by1, 40) * ba
                if b > 0:
                    px = tuple(round(px[i] + (WHITE[i] - px[i]) * b) for i in range(3))
            row += bytes(px) + bytes([round(255 * a)])
        rows.append(bytes(row))

    def chunk(tag: bytes, data: bytes) -> bytes:
        return (struct.pack(">I", len(data)) + tag + data +
                struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF))

    ihdr = struct.pack(">IIBBBBB", SIZE, SIZE, 8, 6, 0, 0, 0)
    png = (b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", ihdr) +
           chunk(b"IDAT", zlib.compress(b"".join(rows), 9)) + chunk(b"IEND", b""))
    path.write_bytes(png)


def main() -> None:
    out_dir = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).parent / "build"
    out_dir.mkdir(parents=True, exist_ok=True)
    master = out_dir / "icon-1024.png"
    make_png(master)
    iconset = out_dir / "AppIcon.iconset"
    iconset.mkdir(exist_ok=True)
    for pt in (16, 32, 128, 256, 512):
        for scale in (1, 2):
            px = pt * scale
            name = f"icon_{pt}x{pt}{'@2x' if scale == 2 else ''}.png"
            subprocess.run(["sips", "-z", str(px), str(px), str(master),
                            "--out", str(iconset / name)],
                           check=True, capture_output=True)
    subprocess.run(["iconutil", "-c", "icns", str(iconset),
                    "-o", str(out_dir / "AppIcon.icns")], check=True)
    print(out_dir / "AppIcon.icns")


if __name__ == "__main__":
    main()
