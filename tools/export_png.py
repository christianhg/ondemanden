"""Export sprites as standalone transparent PNGs, scaled up with hard pixel
edges. Usage: python3 tools/export_png.py [name ...] [--scale N]
Writes to preview/export/<name>.png. Defaults to the two Santa sprites."""

import os
import struct
import sys
import zlib

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import art


def write_rgba_png(path, pixels):
    h, w = len(pixels), len(pixels[0])
    raw = b"".join(b"\x00" + bytes(c for px in row for c in px) for row in pixels)

    def chunk(tag, data):
        body = tag + data
        return struct.pack(">I", len(data)) + body + struct.pack(">I", zlib.crc32(body) & 0xFFFFFFFF)

    png = b"\x89PNG\r\n\x1a\n"
    png += chunk(b"IHDR", struct.pack(">IIBBBBB", w, h, 8, 6, 0, 0, 0))
    png += chunk(b"IDAT", zlib.compress(raw, 9))
    png += chunk(b"IEND", b"")
    with open(path, "wb") as f:
        f.write(png)


def main():
    args = sys.argv[1:]
    scale = 32
    if "--scale" in args:
        i = args.index("--scale")
        scale = int(args[i + 1])
        del args[i:i + 2]
    names = args or ["ondemanden", "julemanden"]
    sprites = art.build_sprites()
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    out_dir = os.path.join(root, "preview", "export")
    os.makedirs(out_dir, exist_ok=True)
    for name in names:
        rows = sprites[name]
        pixels = []
        for r in rows:
            line = []
            for ch in r:
                c = art.PALETTE[ch]
                line += [c + (255,) if c else (0, 0, 0, 0)] * scale
            pixels += [line] * scale
        path = os.path.join(out_dir, f"{name}.png")
        write_rgba_png(path, pixels)
        print(path)


if __name__ == "__main__":
    main()
