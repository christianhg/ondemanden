namespace SpriteKind {
    export const Modgift = SpriteKind.create()
    export const Julemand = SpriteKind.create()
    export const Snefnug = SpriteKind.create()
    export const Doer = SpriteKind.create()
}

let bane = 1
let retningX = 0
let retningY = -80
let ondemanden: Sprite = null
let modgiftMaal = 20
let doerMaal = 10

let helt = sprites.create(heltImg, SpriteKind.Player)
controller.moveSprite(helt, 80, 80)
scene.cameraFollowSprite(helt)

function gulvTile() {
    if (bane == 1) {
        return sneImg
    }
    return gulvImg
}

function startBane() {
    sprites.destroyAllSpritesOfKind(SpriteKind.Enemy)
    sprites.destroyAllSpritesOfKind(SpriteKind.Food)
    sprites.destroyAllSpritesOfKind(SpriteKind.Modgift)
    sprites.destroyAllSpritesOfKind(SpriteKind.Julemand)
    sprites.destroyAllSpritesOfKind(SpriteKind.Doer)
    if (bane == 1) {
        tiles.setCurrentTilemap(bane1)
        tiles.placeOnTile(helt, tiles.getTileLocation(2, 2))
        let doer = sprites.create(doerImg, SpriteKind.Doer)
        tiles.placeOnTile(doer, tiles.getTileLocation(20, 8))
        doer.z = -1
        helt.sayText("Saml " + modgiftMaal + " modgift!", 2000)
    } else {
        tiles.setCurrentTilemap(bane2)
        tiles.placeOnTile(helt, tiles.getTileLocation(2, 2))
        ondemanden = sprites.create(ondemandenImg, SpriteKind.Julemand)
        tiles.placeOnTile(ondemanden, tiles.getTileLocation(14, 10))
        ondemanden.follow(helt, 20)
        helt.sayText("Find Ondemanden!", 2000)
    }
}

function lavFjende() {
    let fjende: Sprite = null
    if (bane == 2 && Math.percentChance(30)) {
        fjende = sprites.create(ondSnemandImg, SpriteKind.Enemy)
        fjende.follow(helt, 20)
    } else {
        fjende = sprites.create(ondNisseImg, SpriteKind.Enemy)
        fjende.follow(helt, 30 + bane * 10)
    }
    tiles.placeOnRandomTile(fjende, gulvTile())
    if (Math.abs(fjende.x - helt.x) < 48 && Math.abs(fjende.y - helt.y) < 48) {
        fjende.destroy()
    }
}

function lavModgift(x: number, y: number) {
    let modgift = sprites.create(modgiftImg, SpriteKind.Modgift)
    modgift.setPosition(x, y)
}

// Session 1: saml modgift
game.onUpdateInterval(2000, function () {
    if (sprites.allOfKind(SpriteKind.Modgift).length < 5) {
        let modgift = sprites.create(modgiftImg, SpriteKind.Modgift)
        tiles.placeOnRandomTile(modgift, gulvTile())
    }
})

sprites.onOverlap(SpriteKind.Player, SpriteKind.Modgift, function (sprite, otherSprite) {
    otherSprite.destroy()
    info.changeScoreBy(1)
    music.play(music.melodyPlayable(music.baDing), music.PlaybackMode.InBackground)
})

// Session 2: onde nisser og pebernødder
game.onUpdateInterval(2000, function () {
    if (sprites.allOfKind(SpriteKind.Enemy).length < 4 + bane * 2) {
        lavFjende()
    }
})

game.onUpdateInterval(10000, function () {
    if (sprites.allOfKind(SpriteKind.Food).length < 1) {
        let pebernoed = sprites.create(pebernoedImg, SpriteKind.Food)
        tiles.placeOnRandomTile(pebernoed, gulvTile())
    }
})

sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function (sprite, otherSprite) {
    otherSprite.destroy()
    info.changeLifeBy(-1)
    scene.cameraShake(4, 300)
    music.play(music.melodyPlayable(music.smallCrash), music.PlaybackMode.InBackground)
})

sprites.onOverlap(SpriteKind.Player, SpriteKind.Food, function (sprite, otherSprite) {
    otherSprite.destroy()
    info.changeLifeBy(1)
    sprite.startEffect(effects.hearts, 500)
    music.play(music.melodyPlayable(music.powerUp), music.PlaybackMode.InBackground)
})

// Session 3: snebolde
game.onUpdate(function () {
    if (helt.vx != 0 || helt.vy != 0) {
        retningX = helt.vx
        retningY = helt.vy
    }
})

controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    let snebold = sprites.createProjectileFromSprite(sneboldImg, helt, retningX * 2, retningY * 2)
    snebold.setFlag(SpriteFlag.DestroyOnWall, true)
    music.play(music.melodyPlayable(music.pewPew), music.PlaybackMode.InBackground)
})

sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Enemy, function (sprite, otherSprite) {
    sprite.destroy()
    if (Math.percentChance(30)) {
        lavModgift(otherSprite.x, otherSprite.y)
    }
    otherSprite.destroy(effects.disintegrate, 300)
})

// Session 4: baner og Ondemanden
sprites.onOverlap(SpriteKind.Player, SpriteKind.Doer, function (sprite, otherSprite) {
    if (info.score() >= doerMaal) {
        bane = 2
        startBane()
    } else {
        helt.sayText("Døren er låst! Saml " + doerMaal + " modgift.", 500)
    }
})

sprites.onOverlap(SpriteKind.Player, SpriteKind.Julemand, function (sprite, otherSprite) {
    if (info.score() >= modgiftMaal) {
        otherSprite.setImage(julemandenImg)
        game.splash("Ondemanden er blevet", "til Julemanden igen!")
        game.over(true)
    } else {
        info.changeLifeBy(-1)
        scene.cameraShake(4, 300)
        tiles.placeOnTile(helt, tiles.getTileLocation(2, 2))
        helt.sayText("Jeg mangler modgift!", 2000)
    }
})

// Bonus: sne
game.onUpdateInterval(300, function () {
    let fnug = sprites.create(snefnugImg, SpriteKind.Snefnug)
    fnug.setFlag(SpriteFlag.RelativeToCamera, true)
    fnug.setFlag(SpriteFlag.Ghost, true)
    fnug.setPosition(randint(0, 160), 0)
    fnug.vy = randint(20, 50)
    fnug.lifespan = 6000
    fnug.z = 100
})

game.splash("Ondemanden", "Red julen!")
info.setScore(0)
info.setLife(3)
startBane()
