/*      TRAP PlACEMENT DATA
    data in this file is parsed to place traps around the game scene.
    traps come in various styles (see trap-defs.ts) and can also be parented to
    platforms to create more complex systems (static, pathed, blinking, and rotation).

    traps also have their own complex types:
        -static: unanimated, deathzone always active
        -toggling: animation alternates through on/off cycle, deathzone blinks
        animations need to be inherit in the object and labeled as follows:
            activation = 'anim_enable', deactivation = 'anim_disable'
        -projectile: projects a deathzone toward a certain point
*/
//non-moving traps
export const trap_object_data_static = 
[
    //spike trap
    {
        //core
        set:        "Trap,Outro",
        tag:        "0",
        parent:     "",
        style:      "spike_static",
        //transform details
        position:   "40_0_38",
        scale:      "1_1_1",
        rotation:   "0_90_0",
    }
]
//toggling traps
export const trap_object_data_toggling = 
[
    //spike trap
    {
        //core
        set:        "Trap,Outro",
        tag:        "0",
        parent:     "",
        style:      "spike_animated",
        //transform details
        position:   "36_0_38",
        scale:      "1_1_1",
        rotation:   "0_90_0",
        //split into 2 variables to allow for complex stage creation
        delay_start:   "1", //time before activation
        delay_end:     "1", //time after activation
        length: "0.5",   //activation length
    }
]
//projectile traps
export const trap_object_data_projectile = 
[
    //spike-launcher trap
    {
        //core
        set:        "Trap,Outro",
        tag:        "0",
        parent:     "",
        style: "spike_launcher",
        //transform details
        position:   "32_0_38",
        scale:      "1_1_1",
        rotation:   "0_90_0",
        //object timing details
        fire_target: "0_5_0",  //target projectile destination, relative to base location
        //split into 2 variables to allow for complex stage creation
        delay_start:   "1", //time before activation
        delay_end:     "1", //time after activation
        length: "0.5",   //activation length
    }
]