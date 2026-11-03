namespace SpriteKind {
    export const Modgift = SpriteKind.create()
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Modgift, function (sprite, otherSprite) {
    sprites.destroy(otherSprite)
    info.changeScoreBy(1)
    music.play(music.melodyPlayable(music.baDing), music.PlaybackMode.InBackground)
})
let modgift: Sprite = null
let helt: Sprite = null
helt = sprites.create(assets.image`helt`, SpriteKind.Player)
controller.moveSprite(helt, 80, 80)
tiles.setCurrentTilemap(tilemap`bane1`)
tiles.placeOnTile(helt, tiles.getTileLocation(2, 2))
scene.cameraFollowSprite(helt)
info.setScore(0)
game.onUpdateInterval(2000, function () {
    modgift = sprites.create(assets.image`modgift`, SpriteKind.Modgift)
    tiles.placeOnRandomTile(modgift, assets.tile`sne`)
})
