/*      COLLECTIBLE CONFIG
    data in this file is parsed to place collectibles around the game scene.
    collectibles are gathered by a player when they collide, removing them from
    the game scene and incrementing their captured amount.
    
    interaction types come in 2 flavours:
    -touch interaction: object is gathered on-touch
    -control interaction: this requires a player to click/press to gather

    collectibles can also be parented under other objects (such as rotating
    or pathed platforms) to create additional effects.
*/
export const collectible_object_data = 
[
    //tier 0 - copper coins
    {
        //core
        set:        "Collectible,Outro",
        tag:        "0",
        parent:     "",
        style:      "coin_copper",
        //transform details
        position:   "32_1_10",
        scale:      "1_1_1",
        rotation:   "0_0_0",
        //interaction type (0=touch, 1=button)
        interact:   "0"
    },
    {
        //core
        set:        "Collectible,Outro",
        tag:        "1",
        parent:     "",
        style:      "coin_copper",
        //transform details
        position:   "32_1_14",
        scale:      "1_1_1",
        rotation:   "0_0_0",
        //interaction type (0=touch, 1=button)
        interact:   "1"
    },
    //tier 1 - silver coins
    {
        //core
        set:        "Collectible,Outro",
        tag:        "2",
        parent:     "",
        style:      "coin_silver",
        //transform details
        position:   "40_1_10",
        scale:      "1_1_1",
        rotation:   "0_0_0",
        //interaction type (0=touch, 1=button)
        interact:   "0"
    },
    {
        //core
        set:        "Collectible,Outro",
        tag:        "3",
        parent:     "",
        style:      "coin_silver",
        //transform details
        position:   "40_1_14",
        scale:      "1_1_1",
        rotation:   "0_0_0",
        //interaction type (0=touch, 1=button)
        interact:   "1"
    }
]