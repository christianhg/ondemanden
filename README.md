# Ondemanden

A four-session MakeCode Arcade course game for kids aged 8-10. Santa has
turned evil. Collect enough antidote (modgift) to turn him good again.

## Play it

1. Open https://arcade.makecode.com and start a new project.
2. Switch to the JavaScript tab.
3. Replace everything with the contents of `dist/ondemanden.ts`.

## Change the art or maps

Edit `tools/art.py`, then run `python3 tools/art.py`. It regenerates
`src/assets.ts`, the previews in `preview/`, and `dist/ondemanden.ts`.
Game logic lives in `src/game.ts`.
