"""Pixel art for Ondemanden. Run: python3 tools/art.py

Writes the MakeCode asset files (images.g.*, tilemap.g.*) and previews.
'.' is transparent; 0-f are MakeCode Arcade palette indices.
"""

import base64
import json
import os
import struct
import zlib

PALETTE = {
    "0": None, ".": None,
    "1": (0xFF, 0xFF, 0xFF), "2": (0xFF, 0x21, 0x21), "3": (0xFF, 0x93, 0xC4),
    "4": (0xFF, 0x81, 0x35), "5": (0xFF, 0xF6, 0x09), "6": (0x24, 0x9C, 0xA3),
    "7": (0x78, 0xDC, 0x52), "8": (0x00, 0x3F, 0xAD), "9": (0x87, 0xF2, 0xFF),
    "a": (0x8E, 0x2E, 0xC4), "b": (0xA4, 0x83, 0x9F), "c": (0x5C, 0x40, 0x6C),
    "d": (0xE5, 0xCD, 0xC4), "e": (0x91, 0x46, 0x3D), "f": (0x00, 0x00, 0x00),
}

SPRITES = {
    "helt": """
........1.......
.......77.......
......777.......
.....7777.......
.....77777......
....7777777.....
....11111111....
....dddddddd....
...ddfddddfdd...
....dddddddd....
....ddd22ddd....
.....777777.....
....77777777....
....eeee5eee....
.....77..77.....
....eee..eee....
""",
    "nisse": """
........2.......
.......22.......
......222.......
......2222......
.....22222......
....2222222.....
....22222222....
....ffddddff....
....d2dddd2d....
....dddddddd....
....11111111....
.....11ff11.....
......1111......
....cc1111cc....
....cccccccc....
.....cc..cc.....
""",
    "modgift": """
................
......eeee......
......eeee..5...
.....cccccc.....
......c11c......
..5...c11c......
.....c1111c.....
....c111111c....
...caaaaaaaac...
...ca3aaaaaac...
...ca3aa5aaac...
...caaaaaaaac...
....caaaaaac....
.....cccccc.....
................
................
""",
    "pebernoed": """
................
................
................
................
......eeee......
.....e44eee.....
....e4eeeeee....
....eeeeeeee....
....eeeeeeee....
....eeeeeeee....
.....eeeeee.....
......eeee......
................
................
................
................
""",
    "snebold": """
..cc..
.c11c.
c1111c
c1119c
.c99c.
..cc..
""",
    "ondemanden": """
......22221.....
.....222222.....
....22222222....
...1111111111...
...dddddddddd...
...dffddddffd...
...dd2dddd2dd...
...1dd1111dd1...
...111ffff111...
...11f1111f11...
..221111111122..
..222211112222..
..ffffff5fffff..
..222222222222..
...2222..2222...
...ffff..ffff...
""",
    "julemanden": """
......22221.....
.....222222.....
....22222222....
...1111111111...
...dddddddddd...
...ddfddddfdd...
...13d1111d31...
...1121111211...
...1112222111...
...1111111111...
..221111111122..
..222211112222..
..ffffff5fffff..
..222222222222..
...2222..2222...
...ffff..ffff...
""",
    "snefnug": """
.9.
919
.9.
""",
    "snemand": """
......ffff......
......ffff......
.....ffffff.....
.....c1111c.....
....c121121c....
....c111441c....
....c1ffff1c....
.....c1111c.....
....22222222....
...c11111111c...
..c1111111111c..
..c111111f111c..
..c1111111111c..
..c111111f111c..
...c11111111c...
....cccccccc....
""",
}

TILES = {
    "doer": """
................
.....eeeeee.....
....eeeeeeee....
...ee444444ee...
...e44477444e...
...e44722744e...
...e44744744e...
...e44477444e...
...e44444444e...
...e44444445e...
...e44444444e...
...e44444444e...
...e44444444e...
...e44444444e...
...e44444444e...
...eeeeeeeeee...
""",
    "sne": """
1111111111111111
1111111111911111
1191111111111111
1111111111111111
1111111111111111
1111111911111111
1111111111111191
1111111111111111
1911111111111111
1111111111111111
1111111111911111
1111111111111111
1111191111111111
1111111111111111
1111111111111911
1111111111111111
""",
    "gran": """
.......66.......
......6776......
.....677776.....
......6776......
.....677776.....
....67777776....
...6777777776...
.....677776.....
....67777776....
...6777777776...
..677777777776..
..666666666666..
.......ee.......
.......ee.......
......eeee......
................
""",
}


def gen_planks():
    rows = []
    for y in range(16):
        if y % 8 == 7:
            rows.append("b" * 16)
            continue
        seam = 3 if y < 8 else 11
        rows.append("".join("b" if x == seam else "d" for x in range(16)))
    return "\n".join(rows)


def gen_bricks():
    rows = []
    for y in range(16):
        if y % 4 == 3:
            rows.append("d" * 16)
            continue
        offset = 0 if (y // 4) % 2 == 0 else 4
        rows.append("".join("d" if (x + offset) % 8 == 7 else "2" for x in range(16)))
    return "\n".join(rows)


TILES["gulv"] = gen_planks()
TILES["mur"] = gen_bricks()


MAPS = {
    # T gran (mur), D doer, . sne, # mur, _ gulv
    "bane1": """
TTTTTTTTTTTTTTTTTTTTTTTT
T......................T
T......................T
T....T.......T.........T
T...........T......T...T
T..T...................T
T........T.......T.....T
T......................T
T...T...........T...D..T
T.........T............T
T..................T...T
T.....T................T
T............T.........T
T..T.................T.T
T.........T....T.......T
T......................T
T......................T
TTTTTTTTTTTTTTTTTTTTTTTT
""",
    "bane2": """
##################
#________________#
#________________#
#___#_______#____#
#________________#
#________________#
#_______##_______#
#________________#
#___#_______#____#
#________________#
#________________#
#________________#
#________________#
##################
""",
}

MAP_TILES = {".": "sne", "T": "gran", "D": "doer", "_": "gulv", "#": "mur"}
TILE_ORDER = ["sne", "gran", "doer", "gulv", "mur"]
WALLS = {"T", "#"}


def grid(s):
    rows = [r for r in s.strip("\n").split("\n")]
    w = len(rows[0])
    for i, r in enumerate(rows):
        assert len(r) == w, f"row {i} has {len(r)} cols, expected {w}: {r!r}"
    return rows


OUTLINED = {"helt", "nisse", "ondemanden", "julemanden"}


def outline(rows, color="f"):
    h, w = len(rows), len(rows[0])
    out = [list(r) for r in rows]
    for y in range(h):
        for x in range(w):
            if rows[y][x] != ".":
                continue
            for dy, dx in ((0, 1), (0, -1), (1, 0), (-1, 0)):
                ny, nx = y + dy, x + dx
                if 0 <= ny < h and 0 <= nx < w and rows[ny][nx] != ".":
                    out[y][x] = color
                    break
    return ["".join(r) for r in out]


def snow_fill(rows):
    return [r.replace(".", "1") for r in rows]


def write_png(path, pixels):
    h = len(pixels)
    w = len(pixels[0])
    raw = b"".join(b"\x00" + bytes(c for px in row for c in px) for row in pixels)

    def chunk(tag, data):
        body = tag + data
        return struct.pack(">I", len(data)) + body + struct.pack(">I", zlib.crc32(body) & 0xFFFFFFFF)

    png = b"\x89PNG\r\n\x1a\n"
    png += chunk(b"IHDR", struct.pack(">IIBBBBB", w, h, 8, 2, 0, 0, 0))
    png += chunk(b"IDAT", zlib.compress(raw, 9))
    png += chunk(b"IEND", b"")
    with open(path, "wb") as f:
        f.write(png)


def render_sheet(items, path, scale=8, pad=2, bg_tile=None):
    cell = 16
    cols = len(items)
    W = (cell + pad) * cols + pad
    H = cell + pad * 2
    snow = grid(bg_tile) if bg_tile else None
    canvas = [[(60, 60, 70)] * W for _ in range(H)]
    for i, rows in enumerate(items):
        ox = pad + i * (cell + pad)
        oy = pad
        h, w = len(rows), len(rows[0])
        dy, dx = (cell - h) // 2, (cell - w) // 2
        for y in range(cell):
            for x in range(cell):
                base = PALETTE[snow[y][x]] if snow else ((200, 200, 200) if (x + y) % 2 else (230, 230, 230))
                canvas[oy + y][ox + x] = base
        for y, r in enumerate(rows):
            for x, ch in enumerate(r):
                c = PALETTE[ch]
                if c:
                    canvas[oy + dy + y][ox + dx + x] = c
    big = []
    for row in canvas:
        line = [px for px in row for _ in range(scale)]
        big.extend([line] * scale)
    write_png(path, big)



def img_literal(rows, indent=""):
    body = "\n".join(indent + " ".join(r) for r in rows)
    return "img`\n" + body + "\n" + indent + "`"


def encode_image(rows):
    """MakeCode f4 image buffer: 8-byte header, then columns of 4-bit pixels,
    low nibble first, each column padded to a multiple of 4 bytes."""
    h, w = len(rows), len(rows[0])
    bh = ((h * 4 + 31) >> 5) << 2
    buf = bytearray([0x87, 0x04, w & 0xFF, w >> 8, h & 0xFF, h >> 8, 0, 0])
    for x in range(w):
        col = bytearray(bh)
        for y in range(h):
            ch = rows[y][x]
            v = 0 if ch == "." else int(ch, 16)
            col[y >> 1] |= v << 4 if y & 1 else v
        buf += col
    return base64.b64encode(bytes(buf)).decode()


def encode_tilemap(rows):
    h, w = len(rows), len(rows[0])
    data = "10" + f"{w & 0xFF:02x}{w >> 8:02x}{h & 0xFF:02x}{h >> 8:02x}"
    data += "".join(f"{TILE_ORDER.index(MAP_TILES[c]) + 1:02x}" for r in rows for c in r)
    data += "".join("2" if c in WALLS else "0" for r in rows for c in r)
    return base64.b64encode(data.encode()).decode()


def tilemap_ts(rows):
    h, w = len(rows), len(rows[0])
    data = f"{w & 0xFF:02x}{w >> 8:02x}{h & 0xFF:02x}{h >> 8:02x}"
    data += "".join(f"{TILE_ORDER.index(MAP_TILES[c]) + 1:02x}" for r in rows for c in r)
    walls = ["".join("2" if c in WALLS else "." for c in r) for r in rows]
    tileset = ", ".join(["myTiles.transparency16"] + [f"myTiles.tile{i + 1}" for i in range(len(TILE_ORDER))])
    return f"tiles.createTilemap(hex`{data}`, {img_literal(walls)}, [{tileset}], TileScale.Sixteen)"


TRANSPARENT16 = ["." * 16] * 16


def write_project(root, sprites, tiles):
    header = "// Auto-generated code. Do not edit.\n"

    # images.g.*
    jres = {}
    cases = []
    for i, (name, rows) in enumerate(sprites.items(), start=1):
        jres[f"image{i}"] = {"data": encode_image(rows), "mimeType": "image/x-mkcd-f4", "displayName": name}
        cases.append(f'            case "image{i}":\n            case "{name}":return {img_literal(rows)};')
    jres["*"] = {"mimeType": "image/x-mkcd-f4", "dataEncoding": "base64", "namespace": "myImages"}
    with open(os.path.join(root, "images.g.jres"), "w") as f:
        json.dump(jres, f, indent=4)
    with open(os.path.join(root, "images.g.ts"), "w") as f:
        f.write(header + "namespace myImages {\n\n"
                '    helpers._registerFactory("image", function(name: string) {\n'
                "        switch(helpers.stringTrim(name)) {\n" + "\n".join(cases) + "\n"
                "        }\n        return null;\n    })\n\n}\n" + header)

    # tilemap.g.*
    jres = {"transparency16": {"data": encode_image(TRANSPARENT16), "mimeType": "image/x-mkcd-f4", "tilemapTile": True}}
    consts = ["    //% fixedInstance jres blockIdentity=images._tile\n    export const transparency16 = image.ofBuffer(hex``);"]
    tile_cases = ['            case "transparency16":return transparency16;']
    for i, name in enumerate(TILE_ORDER, start=1):
        jres[f"tile{i}"] = {"data": encode_image(tiles[name]), "mimeType": "image/x-mkcd-f4", "tilemapTile": True, "displayName": name}
        consts.append(f"    //% fixedInstance jres blockIdentity=images._tile\n    export const tile{i} = image.ofBuffer(hex``);")
        tile_cases.append(f'            case "{name}":\n            case "tile{i}":return tile{i};')
    map_cases = []
    tileset = ["myTiles.transparency16"] + [f"myTiles.tile{i + 1}" for i in range(len(TILE_ORDER))]
    for name, m in MAPS.items():
        rows = grid(m)
        jres[name] = {"id": name, "mimeType": "application/mkcd-tilemap", "data": encode_tilemap(rows), "tileset": tileset, "displayName": name}
        map_cases.append(f'            case "{name}":return {tilemap_ts(rows)};')
    jres["*"] = {"mimeType": "image/x-mkcd-f4", "dataEncoding": "base64", "namespace": "myTiles"}
    with open(os.path.join(root, "tilemap.g.jres"), "w") as f:
        json.dump(jres, f, indent=4)
    with open(os.path.join(root, "tilemap.g.ts"), "w") as f:
        f.write(header + "namespace myTiles {\n" + "\n".join(consts) + "\n\n"
                '    helpers._registerFactory("tilemap", function(name: string) {\n'
                "        switch(helpers.stringTrim(name)) {\n" + "\n".join(map_cases) + "\n"
                "        }\n        return null;\n    })\n\n"
                '    helpers._registerFactory("tile", function(name: string) {\n'
                "        switch(helpers.stringTrim(name)) {\n" + "\n".join(tile_cases) + "\n"
                "        }\n        return null;\n    })\n\n}\n" + header)


def render_maps(root):
    tiles = {k: grid(v) for k, v in TILES.items()}
    for k in ("gran", "doer"):
        tiles[k] = snow_fill(tiles[k])
    for name, m in MAPS.items():
        px = []
        for r in grid(m):
            for y in range(16):
                line = []
                for c in r:
                    line += [PALETTE[ch] or (255, 255, 255) for ch in tiles[MAP_TILES[c]][y]]
                px.append(line)
        write_png(os.path.join(root, "preview", f"{name}.png"),
                  [[p for p in row for _ in range(2)] for row in px for _ in range(2)])


def main():
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    os.makedirs(os.path.join(root, "preview"), exist_ok=True)

    sprites = {k: outline(grid(v)) if k in OUTLINED else grid(v) for k, v in SPRITES.items()}
    tiles = {k: grid(v) for k, v in TILES.items()}
    for k in ("gran", "doer"):
        tiles[k] = snow_fill(tiles[k])

    render_sheet(list(sprites.values()), os.path.join(root, "preview", "sprites-checker.png"))
    render_sheet(list(sprites.values()), os.path.join(root, "preview", "sprites-on-snow.png"), bg_tile=TILES["sne"])
    render_sheet(list(tiles.values()), os.path.join(root, "preview", "tiles.png"))
    render_maps(root)
    write_project(root, sprites, tiles)
    print("images:", ", ".join(sprites))
    print("tiles:", ", ".join(TILE_ORDER))
    print("maps:", ", ".join(MAPS))


if __name__ == "__main__":
    main()
