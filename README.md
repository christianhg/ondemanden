# Ondemanden

A four-session MakeCode Arcade course game for kids aged 8-10. Santa has
turned evil. Collect enough antidote (modgift) to turn him good again.

This repo is a regular MakeCode Arcade project. Open it in the editor via
Import, then GitHub (or Import URL if the repo is public).

## Working on it

- `main.ts` is the game. Keep it to code that Blocks can show; no gray
  JavaScript blocks.
- `tools/art.py` holds the pixel art and maps. Run `python3 tools/art.py`
  to regenerate `images.g.*`, `tilemap.g.*`, and the PNGs in `preview/`.
- `lektioner/lektion-N.ts` is what kids get at the start of lesson N.
  `tools/lektioner.sh --push` turns each into a `lektion-N` branch (the
  full project, named "Ondemanden lektion N"). `main` is the finished game.
- `tools/check.sh` compiles with the MakeCode Arcade CLI, regenerates
  `main.blocks`, and fails on errors or gray blocks. Run it before every
  commit. The first run installs the CLI into `/tmp/pxtwork`.
