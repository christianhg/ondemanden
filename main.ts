namespace SpriteKind {
    export const Modgift = SpriteKind.create()
    export const Snemand = SpriteKind.create()
    export const Julemand = SpriteKind.create()
    export const Snefnug = SpriteKind.create()
}
function placer (ting: Sprite) {
    if (bane == 1) {
        tiles.placeOnRandomTile(ting, assets.tile`sne`)
    } else {
        tiles.placeOnRandomTile(ting, assets.tile`gulv`)
    }
}
scene.onOverlapTile(SpriteKind.Player, assets.tile`doer`, function (sprite, location) {
    if (info.score() >= 10) {
        bane = 2
        sprites.destroyAllSpritesOfKind(SpriteKind.Enemy)
        sprites.destroyAllSpritesOfKind(SpriteKind.Snemand)
        sprites.destroyAllSpritesOfKind(SpriteKind.Modgift)
        sprites.destroyAllSpritesOfKind(SpriteKind.Food)
        tiles.setCurrentTilemap(tilemap`bane2`)
        tiles.placeOnTile(helt, tiles.getTileLocation(2, 2))
        ondemanden = sprites.create(assets.image`ondemanden`, SpriteKind.Julemand)
        tiles.placeOnTile(ondemanden, tiles.getTileLocation(14, 10))
        ondemanden.follow(helt, 20)
        helt.sayText("Find Ondemanden!", 2000, false)
    } else {
        helt.sayText("Døren er låst! Saml 10 modgift.", 500, false)
    }
})
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
sprites.onOverlap(SpriteKind.Player, SpriteKind.Julemand, function (sprite, otherSprite) {
    if (info.score() >= 20) {
        otherSprite.setImage(assets.image`julemanden`)
        game.splash("Ondemanden er blevet", "til Julemanden igen!")
        game.gameOver(true)
    } else {
        info.changeLifeBy(-1)
        scene.cameraShake(4, 300)
        tiles.placeOnTile(helt, tiles.getTileLocation(2, 2))
        helt.sayText("Jeg mangler modgift!", 2000, false)
    }
})
let snefnug: Sprite = null
let pebernoed: Sprite = null
let snemand: Sprite = null
let nisse: Sprite = null
let modgift: Sprite = null
let snebold: Sprite = null
let ondemanden: Sprite = null
let retningY = 0
let retningX = 0
let bane = 0
let helt: Sprite = null
game.splash("Ondemanden", "Red julen!")
helt = sprites.create(assets.image`helt`, SpriteKind.Player)
controller.moveSprite(helt, 80, 80)
tiles.setCurrentTilemap(tilemap`bane1`)
tiles.placeOnTile(helt, tiles.getTileLocation(2, 2))
scene.cameraFollowSprite(helt)
info.setScore(0)
info.setLife(3)
bane = 1
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
        placer(modgift)
    }
})
game.onUpdateInterval(2000, function () {
    if (sprites.allOfKind(SpriteKind.Enemy).length < 6) {
        nisse = sprites.create(assets.image`nisse`, SpriteKind.Enemy)
        nisse.setFlag(SpriteFlag.GhostThroughWalls, true)
        tiles.placeOnRandomTile(nisse, assets.tile`portal`)
        nisse.follow(helt, 30 + bane * 10)
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
        placer(pebernoed)
    }
})
game.onUpdateInterval(300, function () {
    snefnug = sprites.create(assets.image`snefnug`, SpriteKind.Snefnug)
    snefnug.setFlag(SpriteFlag.RelativeToCamera, true)
    snefnug.setFlag(SpriteFlag.Ghost, true)
    snefnug.setPosition(randint(0, 160), 0)
    snefnug.vy = randint(20, 50)
    snefnug.lifespan = 6000
    snefnug.z = 100
})
