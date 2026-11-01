// Auto-generated code. Do not edit.
namespace myTiles {
    //% fixedInstance jres blockIdentity=images._tile
    export const transparency16 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile1 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile2 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile3 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile4 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile5 = image.ofBuffer(hex``);

    helpers._registerFactory("tilemap", function(name: string) {
        switch(helpers.stringTrim(name)) {
            case "bane1":return tiles.createTilemap(hex`18001200020202020202020202020202020202020202020202020202020101010101010101010101010101010101010101010102020101010101010101010101010101010101010101010102020101010102010101010101010201010101010101010102020101010101010101010101020101010101010201010102020101020101010101010101010101010101010101010102020101010101010101020101010101010102010101010102020101010101010101010101010101010101010101010102020101010201010101010101010101010201010103010102020101010101010101010201010101010101010101010102020101010101010101010101010101010101010201010102020101010101020101010101010101010101010101010102020101010101010101010101010201010101010101010102020101020101010101010101010101010101010101020102020101010101010101010201010101020101010101010102020101010101010101010101010101010101010101010102020101010101010101010101010101010101010101010102020202020202020202020202020202020202020202020202`, img`
2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
2 . . . . . . . . . . . . . . . . . . . . . . 2
2 . . . . . . . . . . . . . . . . . . . . . . 2
2 . . . . 2 . . . . . . . 2 . . . . . . . . . 2
2 . . . . . . . . . . . 2 . . . . . . 2 . . . 2
2 . . 2 . . . . . . . . . . . . . . . . . . . 2
2 . . . . . . . . 2 . . . . . . . 2 . . . . . 2
2 . . . . . . . . . . . . . . . . . . . . . . 2
2 . . . 2 . . . . . . . . . . . 2 . . . . . . 2
2 . . . . . . . . . 2 . . . . . . . . . . . . 2
2 . . . . . . . . . . . . . . . . . . 2 . . . 2
2 . . . . . 2 . . . . . . . . . . . . . . . . 2
2 . . . . . . . . . . . . 2 . . . . . . . . . 2
2 . . 2 . . . . . . . . . . . . . . . . . 2 . 2
2 . . . . . . . . . 2 . . . . 2 . . . . . . . 2
2 . . . . . . . . . . . . . . . . . . . . . . 2
2 . . . . . . . . . . . . . . . . . . . . . . 2
2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
`, [myTiles.transparency16, myTiles.tile1, myTiles.tile2, myTiles.tile3, myTiles.tile4, myTiles.tile5], TileScale.Sixteen);
            case "bane2":return tiles.createTilemap(hex`12000e00050505050505050505050505050505050505050404040404040404040404040404040405050404040404040404040404040404040405050404040504040404040404050404040405050404040404040404040404040404040405050404040404040404040404040404040405050404040404040405050404040404040405050404040404040404040404040404040405050404040504040404040404050404040405050404040404040404040404040404040405050404040404040404040404040404040405050404040404040404040404040404040405050404040404040404040404040404040405050505050505050505050505050505050505`, img`
2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
2 . . . . . . . . . . . . . . . . 2
2 . . . . . . . . . . . . . . . . 2
2 . . . 2 . . . . . . . 2 . . . . 2
2 . . . . . . . . . . . . . . . . 2
2 . . . . . . . . . . . . . . . . 2
2 . . . . . . . 2 2 . . . . . . . 2
2 . . . . . . . . . . . . . . . . 2
2 . . . 2 . . . . . . . 2 . . . . 2
2 . . . . . . . . . . . . . . . . 2
2 . . . . . . . . . . . . . . . . 2
2 . . . . . . . . . . . . . . . . 2
2 . . . . . . . . . . . . . . . . 2
2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
`, [myTiles.transparency16, myTiles.tile1, myTiles.tile2, myTiles.tile3, myTiles.tile4, myTiles.tile5], TileScale.Sixteen);
        }
        return null;
    })

    helpers._registerFactory("tile", function(name: string) {
        switch(helpers.stringTrim(name)) {
            case "transparency16":return transparency16;
            case "sne":
            case "tile1":return tile1;
            case "gran":
            case "tile2":return tile2;
            case "doer":
            case "tile3":return tile3;
            case "gulv":
            case "tile4":return tile4;
            case "mur":
            case "tile5":return tile5;
        }
        return null;
    })

}
// Auto-generated code. Do not edit.
