/*      TRAP DEFS
    holds styling data links to all graphics for traps. each trap also
    contains their own collision-area which represents the region of the trap
    that is dangerous to the player.
*/
//single piece traps
export const trap_data = 
[
    //spike trap, static object
    {
        //call-tag
        type: "spike_static",
        //model location paths
        path: "trapSpikeStatic",
        //death area transform details
        position:   "0_0.25_0",
        scale:      "1_0.5_1",
        rotation:   "0_0_0"
    },
    //spike trap, animated object
    {
        //call-tag
        type: "spike_animated",
        //model location paths
        path: "trapSpikeAnimated",
        //death area transform details
        position:   "0_0.25_0",
        scale:      "1_0.5_1",
        rotation:   "0_0_0"
    },
    //saw blade
    {
        type: "sawblade",
        path: "trapSawblade",
        //death area transform details
        position:   "0_0_0",
        scale:      "1_1_1",
        rotation:   "0_0_0"
    }
]
//multi-piece traps
export const trap_data_multi = 
[
    //spike-launcher
    {
        //call-tag
        type: "spike_launcher",
        //model location paths
        path_base: "trapSpikeLauncher_Base",
        path_projectile: "trapSpikeLauncher_Projectile",
        //death area transform details, relative to projectile object
        position:   "0_0.25_0",
        scale:      "0.25_0.5_0.25",
        rotation:   "0_0_0"
    }
]