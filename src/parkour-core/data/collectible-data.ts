/*      COLLECTIBLE DATA
    holds styling data links to all graphics for collectibles. collectibles
    require both objects (in-scene) and icons (for HUD). these share naming,
    with objects placed in 'models/collectibles' and hud placed in 'images/collectibles'.
*/
export const collectible_data = 
[
    //tier 0 - coin copper
    {
        //call-tag
        type: "coin_copper",
        //model location path
        path: "coin_copper",
        displayName: "Copper Coin"
    },
    //tier 1 - coin silver
    {
        type: "coin_silver",
        path: "coin_silver",
        displayName: "Silver Coin"
    }/*,
    //tier 2 - relic
    {
        type: "relic",
        path: "platformWood"
    }*/
]