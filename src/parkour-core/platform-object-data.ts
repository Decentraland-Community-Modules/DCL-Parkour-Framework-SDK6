/*      PLATFORM OBJECT DATA
    holds definitions of all platforms to be created in the scene
*/
//non-moving platforms
export const platform_object_data_static = 
[
    //course 0 - static bridge
    {
        //core
        set:        "Alpha",
        tag:        "0",
        parent:     "",
        style:      "wood",
        //transform details
        position:   "22_1.5_12",
        scale:      "1_1_1",
        rotation:   "0_0_0",
    },
    {
        //core
        set:        "Alpha",
        tag:        "1",
        parent:     "",
        style:      "wood",
        //transform details
        position:   "26_2_16",
        scale:      "1_1_1",
        rotation:   "0_0_0",
    },
    {
        //core
        set:        "Alpha",
        tag:        "2",
        parent:     "",
        style:      "wood",
        //transform details
        position:   "24_2.5_22",
        scale:      "1_1_1",
        rotation:   "0_0_0",
    },
    //course 0/1/2 - metal checkpoint
    {
        //core
        set:        "Alpha,Bravo,Charlie",
        tag:        "3",
        parent:     "",
        style:      "metal",
        //transform details
        position:   "24_3_28",
        scale:      "1_1_1",
        rotation:   "0_0_0",
    },
    //course 2 - elevator exit
    {
        //core
        set:        "Charlie",
        tag:        "4",
        parent:     "",
        style:      "metal",
        //transform details
        position:   "24_10_28",
        scale:      "1_1_1",
        rotation:   "0_0_0",
    },
    //course 2 - rotational children
    {
        //core
        set:        "Charlie",
        tag:        "5",
        parent:     "rotating_0",
        style:      "stone",
        //transform details
        position:   "5_0_0",
        scale:      "1_1_1",
        rotation:   "0_0_0",
    },
    {
        //core
        set:        "Charlie",
        tag:        "6",
        parent:     "rotating_0",
        style:      "stone",
        //transform details
        position:   "-5_0_0",
        scale:      "1_1_1",
        rotation:   "0_0_0",
    },
    //course 2 - stage exit
    {
        //core
        set:        "Charlie",
        tag:        "7",
        parent:     "",
        style:      "metal",
        //transform details
        position:   "38_10_15",
        scale:      "1_1_1",
        rotation:   "0_0_0",
    }
]
//path-moving platforms
export const platform_object_data_pathing = 
[
    //course 1 - pathed bridge
    {
        //core
        set:        "Bravo,Charlie",
        tag:        "0",
        parent:     "",
        style:      "wood",
        //transform details
        position:   "22_1.5_12",
        scale:      "1_1_1",
        rotation:   "0_0_0",
        //object movement speed
        length:      "2",
        //pathing waypoints
        waypoints:
        [
            {position: "0_0_0"},
            {position: "-4_0_0"}
        ]
    },
    {
        //core
        set:        "Bravo,Charlie",
        tag:        "1",
        parent:     "",
        style:      "wood",
        //transform details
        position:   "26_2_16",
        scale:      "1_1_1",
        rotation:   "0_0_0",
        //object movement speed
        length:      "2",
        //pathing waypoints
        waypoints:
        [
            {position: "0_0_0"},
            {position: "4_0_0"}
        ]
    },
    {
        //core
        set:        "Bravo,Charlie",
        tag:        "2",
        parent:     "",
        style:      "wood",
        //transform details
        position:   "24_2.5_22",
        scale:      "1_1_1",
        rotation:   "0_0_0",
        //object time for movement cycle
        length:      "2",
        //pathing waypoints
        waypoints:
        [
            {position: "0_0_0"},
            {position: "0_-4_0"}
        ]
    },
    //course 2 - elevator access
    {
        //core
        set:        "Charlie",
        tag:        "3",
        parent:     "",
        style:      "wood",
        //transform details
        position:   "24_3.5_32",
        scale:      "1_1_1",
        rotation:   "0_0_0",
        //object time for movement cycle
        length:      "2",
        //pathing waypoints
        waypoints:
        [
            {position: "0_0_0"},
            {position: "0_6_0"}
        ]
    }
]
//rotating platforms
export const platform_object_data_rotating = 
[
    //course 2 - rotational parent
    {
        //core
        set:        "Charlie",
        tag:        "0",
        parent:     "",
        style:      "stone",
        //transform details
        position:   "38_10_28",
        scale:      "1_1_1",
        rotation:   "0_0_0",
        //speed of rotation per axis
        rotationSpeed:  "0_1_0"
    }
]
//timed appearance platforms
export const platform_object_data_blinking = 
[
    //course 2 - checkpoint to rotational
    {
        //core
        set:        "Charlie",
        tag:        "0",
        parent:     "",
        style:      "stone",
        //transform details
        position:   "29_10_28",
        scale:      "1_1_1",
        rotation:   "0_0_0",
        //object time for blink cycle
        cycleStart:  "on",
        timeOn:      "2",
        timeOff:     "1"
    },
    //course 2 - rotational to end
    {
        //core
        set:        "Charlie",
        tag:        "1",
        parent:     "",
        style:      "stone",
        //transform details
        position:   "38_10_19",
        scale:      "1_1_1",
        rotation:   "0_0_0",
        //object time for blink cycle
        cycleStart:  "off",
        timeOn:      "2",
        timeOff:     "1"
    }
]