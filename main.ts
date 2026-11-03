namespace SpriteKind {
    export const Modgift = SpriteKind.create()
    export const Snemand = SpriteKind.create()
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Modgift, function (sprite, otherSprite) {
    sprites.destroy(otherSprite)
    info.changeScoreBy(1)
    music.play(music.melodyPlayable(music.baDing), music.PlaybackMode.InBackground)
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function (sprite, otherSprite) {
    sprites.destroy(otherSprite)
    info.changeLifeBy(-1)
    scene.cameraShake(4, 300)
    music.play(music.melodyPlayable(music.smallCrash), music.PlaybackMode.InBackground)
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Snemand, function (sprite, otherSprite) {
    sprites.destroy(otherSprite)
    info.changeLifeBy(-1)
    scene.cameraShake(4, 300)
    music.play(music.melodyPlayable(music.smallCrash), music.PlaybackMode.InBackground)
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Food, function (sprite, otherSprite) {
    sprites.destroy(otherSprite)
    info.changeLifeBy(1)
    sprite.startEffect(effects.hearts, 500)
    music.play(music.melodyPlayable(music.powerUp), music.PlaybackMode.InBackground)
})
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    snebold = sprites.createProjectileFromSprite(assets.image`snebold`, helt, retningX * 2, retningY * 2)
    snebold.setFlag(SpriteFlag.DestroyOnWall, true)
    music.play(music.melodyPlayable(music.pewPew), music.PlaybackMode.InBackground)
})
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Enemy, function (sprite, otherSprite) {
    sprites.destroy(sprite)
    if (Math.percentChance(30)) {
        modgift = sprites.create(assets.image`modgift`, SpriteKind.Modgift)
        modgift.setPosition(otherSprite.x, otherSprite.y)
    }
    sprites.destroy(otherSprite, effects.disintegrate, 300)
})
let pebernoed: Sprite = null
let snemand: Sprite = null
let nisse: Sprite = null
let modgift: Sprite = null
let snebold: Sprite = null
let retningY = 0
let retningX = 0
let helt: Sprite = null
helt = sprites.create(assets.image`helt`, SpriteKind.Player)
controller.moveSprite(helt, 80, 80)
tiles.setCurrentTilemap(tilemap`bane1`)
tiles.placeOnTile(helt, tiles.getTileLocation(2, 2))
scene.cameraFollowSprite(helt)
info.setScore(0)
info.setLife(3)
retningX = 0
retningY = -80
game.onUpdate(function () {
    if (helt.vx != 0 || helt.vy != 0) {
        retningX = helt.vx
        retningY = helt.vy
    }
})
game.onUpdateInterval(2000, function () {
    if (sprites.allOfKind(SpriteKind.Modgift).length < 5) {
        modgift = sprites.create(assets.image`modgift`, SpriteKind.Modgift)
        tiles.placeOnRandomTile(modgift, assets.tile`sne`)
    }
})
game.onUpdateInterval(2000, function () {
    if (sprites.allOfKind(SpriteKind.Enemy).length < 6) {
        nisse = sprites.create(assets.image`nisse`, SpriteKind.Enemy)
        nisse.setFlag(SpriteFlag.GhostThroughWalls, true)
        tiles.placeOnRandomTile(nisse, assets.tile`portal`)
        nisse.follow(helt, 40)
    }
})
game.onUpdateInterval(5000, function () {
    if (sprites.allOfKind(SpriteKind.Snemand).length < 2) {
        snemand = sprites.create(assets.image`snemand`, SpriteKind.Snemand)
        snemand.setFlag(SpriteFlag.GhostThroughWalls, true)
        tiles.placeOnRandomTile(snemand, assets.tile`portal`)
        snemand.follow(helt, 20)
    }
})
game.onUpdateInterval(10000, function () {
    if (sprites.allOfKind(SpriteKind.Food).length < 1) {
        pebernoed = sprites.create(assets.image`pebernoed`, SpriteKind.Food)
        tiles.placeOnRandomTile(pebernoed, assets.tile`sne`)
    }
})
