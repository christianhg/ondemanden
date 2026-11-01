#!/usr/bin/env bash
# Compile the project with the MakeCode Arcade CLI, then regenerate
# main.blocks from main.ts and fail if any statement decompiles to a gray
# JavaScript block. Usage: tools/check.sh
set -euo pipefail

root="$(cd "$(dirname "$0")/.." >/dev/null && pwd)"
work="${PXT_WORK:-/tmp/pxtwork}"
core="$work/node_modules/pxt-core"
target="$work/node_modules/pxt-arcade"

if [ ! -d "$target" ]; then
    mkdir -p "$work"
    (cd "$work" && npm init -y >/dev/null &&
        PUPPETEER_SKIP_DOWNLOAD=1 npm install pxt-core pxt-arcade \
            --no-audit --no-fund --ignore-scripts >/dev/null)
fi

# The npm package of pxt-core ships without libs/pxt-common, which the
# decompiler needs.
common="$core/libs/pxt-common"
if [ ! -f "$common/pxt-helpers.ts" ]; then
    version="$(node -p "require('$core/package.json').version")"
    mkdir -p "$common"
    for f in pxt-core.d.ts pxt-helpers.ts; do
        curl -sfL -o "$common/$f" \
            "https://raw.githubusercontent.com/microsoft/pxt/v$version/libs/pxt-common/$f"
    done
fi

# The CLI's decompile command only sees main.ts. The patched copy also feeds
# it the asset files so asset references decompile to pickers.
patched="$core/built/pxt-patched.js"
if [ ! -f "$patched" ]; then
    python3 - "$core/built/pxt.js" "$patched" <<'PY'
import sys
src, dst = sys.argv[1], sys.argv[2]
s = open(src).read()
old = 'let inPackages = { [pxt.MAIN_TS]: input, [pxt.MAIN_PY]: "" };'
assert old in s, "pxt-core changed; update tools/check.sh"
extra = (' for (const extra of ["images.g.ts","images.g.jres","tilemap.g.ts","tilemap.g.jres"])'
         ' { const ep = path.join(path.dirname(f), extra);'
         ' if (fs.existsSync(ep)) inPackages[extra] = fs.readFileSync(ep, "utf8"); }')
open(dst, "w").write(s.replace(old, old + extra))
PY
fi

proj="$work/proj"
rm -rf "$proj"
mkdir -p "$proj"
cp "$root"/{pxt.json,main.ts,README.md,assets.json,images.g.jres,images.g.ts,tilemap.g.jres,tilemap.g.ts} "$proj/"
: > "$proj/main.blocks"
# The decompiler resolves pxt-core files relative to the project.
mkdir -p "$proj/node_modules"
ln -s "$core" "$proj/node_modules/pxt-core"

cli() {
    (cd "$proj" && node -e \
        'require(process.argv[1]).mainCli(process.argv[2], process.argv.slice(3))' \
        "$patched" "$target" "$@")
}

cli install >/dev/null
out="$(cli build --local 2>&1)"
if echo "$out" | grep -q "error"; then
    echo "$out" | grep "error"
    exit 1
fi
echo "build ok"

cli decompile --dep device main.ts >/dev/null
gray="$(grep -o 'line0="[^"]*"' "$proj/main.blocks" || true)"
if [ -n "$gray" ]; then
    echo "gray blocks:"
    python3 -c 'import html,sys; print(html.unescape(sys.stdin.read()))' <<<"$gray"
    exit 1
fi
cp "$proj/main.blocks" "$root/main.blocks"
echo "blocks ok ($(grep -o '<block ' "$root/main.blocks" | wc -l | tr -d ' ') blocks)"
