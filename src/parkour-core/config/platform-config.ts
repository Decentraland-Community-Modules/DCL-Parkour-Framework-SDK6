/*      PLATFORM CONFIG
    data in this file is parsed to place platforms around the game scene.
    platforms come in various styles (see platform-defs.ts) and action types
    (static, pathed, blinking, and rotation). they can also be parented to one
    another to create more complex systems.
*/
//non-moving platforms
export const platform_object_data_static = 
[
    //basics
    {
        //core
        set:        "Platform - Basic,Outro",
        tag:        "0",
        parent:     "",
        style:      "debugging",
        //transform details
        position:   "6_1_6",
        scale:      "1_1_1",
        rotation:   "0_0_0",
    },
    {
        //core
        set:        "Platform - Basic,Outro",
        tag:        "1",
        parent:     "",
        style:      "wood",
        //transform details
        position:   "6_1_9",
        scale:      "1_1_1",
        rotation:   "0_0_0",
    },
    {
        //core
        set:        "Platform - Basic,Outro",
        tag:        "2",
        parent:     "",
        style:      "stone",
        //transform details
        position:   "6_1_12",
        scale:      "1_1_1",
        rotation:   "0_0_0",
    },
    {
        //core
        set:        "Platform - Basic,Outro",
        tag:        "3",
        parent:     "",
        style:      "metal",
        //transform details
        position:   "6_1_15",
        scale:      "1_1_1",
        rotation:   "0_0_0",
    },
    //advanced
    {
        //core
        set:        "Platform - Advanced,Outro",
        tag:        "4",
        parent:     "platform_rotating_2",
        style:      "wood",
        //transform details
        position:   "3_0_0",
        scale:      "1_1_1",
        rotation:   "0_0_0",
    },
    {
        //core
        set:        "Platform - Advanced,Outro",
        tag:        "5",
        parent:     "platform_rotating_2",
        style:      "wood",
        //transform details
        position:   "-3_0_0",
        scale:      "1_1_1",
        rotation:   "0_0_0",
    }
]
//path-moving platforms
export const platform_object_data_pathing = 
[
    //basic
    {
        //core
        set:        "Platform - Basic,Outro",
        tag:        "0",
        parent:     "",
        style:      "metal",
        //transform details
        position:   "10_1_6",
        scale:      "1_1_1",
        rotation:   "0_0_0",
        //object movement speed
        length:      "2",
        //pathing waypoints
        waypoints:
        [
            {position: "0_0_0"},
            {position: "0_0_9"}
        ]
    },
    //advanced
    {
        //core
        set:        "Platform - Advanced,Outro",
        tag:        "1",
        parent:     "",
        style:      "stone",
        //transform details
        position:   "15_1_42",
        scale:      "1_1_1",
        rotation:   "0_0_0",
        //object movement speed
        length:      "2",
        //pathing waypoints
        waypoints:
        [
            {position: "0_0_0"},
            {position: "0_0_-9"}
        ]
    },
    {
        //core
        set:        "Platform - Advanced,Outro",
        tag:        "2",
        parent:     "platform_pathing_1",
        style:      "wood",
        //transform details
        position:   "0_0.5_0",
        scale:      "1_1_1",
        rotation:   "0_0_0",
        //object movement speed
        length:      "2",
        //pathing waypoints
        waypoints:
        [
            {position: "0_0_0"},
            {position: "0_5_0"}
        ]
    }
]
//rotating platforms
export const platform_object_data_rotating = 
[
    //basic
    {
        //core
        set:        "Platform - Basic,Outro",
        tag:        "0",
        parent:     "",
        style:      "wood",
        //transform details
        position:   "14_1_6",
        scale:      "1_1_1",
        rotation:   "0_0_0",
        //speed of rotation per axis
        rotationSpeed:  "0_1_0"
    },
    {
        //core
        set:        "Platform - Basic,Outro",
        tag:        "1",
        parent:     "",
        style:      "stone",
        //transform details
        position:   "14_1_9",
        scale:      "1_1_1",
        rotation:   "0_0_0",
        //speed of rotation per axis
        rotationSpeed:  "0_2_0"
    },
    //advanced
    {
        //core
        set:        "Platform - Advanced,Outro",
        tag:        "2",
        parent:     "",
        style:      "stone",
        //transform details
        position:   "9_1_40",
        scale:      "1_1_1",
        rotation:   "0_0_0",
        //speed of rotation per axis
        rotationSpeed:  "0_1_0"
    },
    {   //rotation speeds stack
        //core
        set:        "Platform - Advanced,Outro",
        tag:        "3",
        parent:     "platform_rotating_2",
        style:      "stone",
        //transform details
        position:   "0_1_0",
        scale:      "1_1_1",
        rotation:   "0_0_0",
        //speed of rotation per axis
        rotationSpeed:  "0_1_0"
    }
]
//alternating platforms
export const platform_object_data_toggling = 
[
    //basic
    {
        //core
        set:        "Platform - Basic,Outro",
        tag:        "0",
        parent:     "",
        style:      "wood",
        //transform details
        position:   "14_1_12",
        scale:      "1_1_1",
        rotation:   "0_0_0",
        //split into 2 variables to allow for complex stage creation
        delay_start:   "0.25", //time before activation
        delay_end:     "0.25", //time after activation
        length: "1",   //activation length
    },
    {
        //core
        set:        "Platform - Basic,Outro",
        tag:        "0",
        parent:     "",
        style:      "stone",
        //transform details
        position:   "14_1_15",
        scale:      "1_1_1",
        rotation:   "0_0_0",
        //split into 2 variables to allow for complex stage creation
        delay_start:   "0.5", //time before activation
        delay_end:     "0.5", //time after activation
        length: "2",   //activation length
    }
]