/*      CHECKPOINT DEFS
    holds styling data links to all graphics for checkpoints. each checkpoint
    contains their own collider-area which represents the region of the checkpoint
    that will interact with the player.
*/
export const checkpoint_data = 
[
    //default
    {
        //call-tag
        type: "platform_metal",
        //model location paths
        path: "platformMetal",
        //collision area transform details
        position:   "0_0.5_0",
        scale:      "1_1_1",
        rotation:   "0_0_0",
        //respawn offset
        offset:     "0_1_0"
    }
]