#!/usr/bin/env bash
# Build one branch per lesson start (lektion-1 .. lektion-4) from
# lektioner/lektion-N.ts, without touching the working tree. Each branch is
# the full project with that lesson's main.ts, its regenerated main.blocks,
# and a project name that says which lesson it is. main stays the finished
# game. Usage: tools/lektioner.sh [--push]
set -euo pipefail

root="$(cd "$(dirname "$0")/.." >/dev/null && pwd)"
cd "$root"
remote="https://github.com/christianhg/ondemanden.git"

if [ -n "$(git status --porcelain)" ]; then
    echo "commit your changes first; lesson branches are built from HEAD" >&2
    exit 1
fi

index="$(mktemp)"
trap 'rm -f "$index"' EXIT

for src in lektioner/lektion-*.ts; do
    name="$(basename "$src" .ts)"
    n="${name#lektion-}"
    echo "== $name"
    tools/check.sh "$src" "lektioner/$name.blocks" >/dev/null
    if ! git diff --quiet -- "lektioner/$name.blocks"; then
        echo "lektioner/$name.blocks changed; commit it and rerun" >&2
        exit 1
    fi

    pxt="$(python3 -c '
import json, sys
p = json.load(open("pxt.json"))
p["name"] = "Ondemanden lektion " + sys.argv[1]
print(json.dumps(p, indent=4, ensure_ascii=False))
' "$n" | git hash-object -w --stdin)"
    main_ts="$(git hash-object -w "$src")"
    main_blocks="$(git hash-object -w "lektioner/$name.blocks")"

    GIT_INDEX_FILE="$index" git read-tree HEAD
    GIT_INDEX_FILE="$index" git update-index \
        --cacheinfo "100644,$main_ts,main.ts" \
        --cacheinfo "100644,$main_blocks,main.blocks" \
        --cacheinfo "100644,$pxt,pxt.json"
    tree="$(GIT_INDEX_FILE="$index" git write-tree)"

    if parent="$(git rev-parse -q --verify "refs/heads/$name")"; then
        if [ "$(git rev-parse "$parent^{tree}")" = "$tree" ]; then
            echo "unchanged"
            continue
        fi
    else
        parent="$(git rev-parse HEAD)"
    fi
    commit="$(git commit-tree "$tree" -p "$parent" -m "Lektion $n starting point from $(git rev-parse --short HEAD)")"
    git update-ref "refs/heads/$name" "$commit"
    echo "updated $(git rev-parse --short "$commit")"
done

if [ "${1:-}" = "--push" ]; then
    git push -q "$remote" main $(for f in lektioner/lektion-*.ts; do echo "refs/heads/$(basename "$f" .ts)"; done)
    echo "pushed"
fi
