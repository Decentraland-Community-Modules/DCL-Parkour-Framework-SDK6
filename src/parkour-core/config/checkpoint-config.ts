/*      CHECKPOINT PlACEMENT DATA
    data in this file is parsed to place checkpoints around the game scene.
    the first checkpoint of a set acts as the initial respawn point for that
    game stage.
*/
export const checkpoint_object_data = 
[
    //outro
    {
        //core
        set:        "Intro,Sets,Outro",
        tag:        "0",
        style:      "platform_metal",
        //transform details
        position:   "24_0_2",
        scale:      "1_1_1",
        rotation:   "0_90_0",
        //on-spawn look-at position
        look:       "24_1_24"
    },
    //intro/sets/basic platforms
    {
        //core
        set:        "Platform - Basic,Outro",
        tag:        "1",
        style:      "platform_metal",
        //transform details
        position:   "12_0_2",
        scale:      "1_1_1",
        rotation:   "0_90_0",
        //on-spawn look-at position
        look:       "12_1_24"
    },
    //advanced platforms
    {
        //core
        set:        "Platform - Advanced,Outro",
        tag:        "2",
        style:      "platform_metal",
        //transform details
        position:   "12_0_46",
        scale:      "1_1_1",
        rotation:   "0_90_0",
        //on-spawn look-at position
        look:       "12_1_24"
    },
    //collectilbes
    {
        //core
        set:        "Collectible,Outro",
        tag:        "3",
        style:      "platform_metal",
        //transform details
        position:   "36_0_2",
        scale:      "1_1_1",
        rotation:   "0_90_0",
        //on-spawn look-at position
        look:       "36_1_24"
    },
    //traps
    {
        //core
        set:        "Trap,Outro",
        tag:        "3",
        style:      "platform_metal",
        //transform details
        position:   "36_0_46",
        scale:      "1_1_1",
        rotation:   "0_90_0",
        //on-spawn look-at position
        look:       "36_1_24"
    },
    {
        //core
        set:        "Trap,Outro",
        tag:        "4",
        style:      "platform_metal",
        //transform details
        position:   "36_0_34",
        scale:      "1_1_1",
        rotation:   "0_90_0",
        //on-spawn look-at position
        look:       "36_1_48"
    }
]