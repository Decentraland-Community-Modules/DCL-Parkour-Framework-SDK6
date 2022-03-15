/*      PLATFORM OBJECT DATA
    holds definitions of all platforms to be created in the scene
*/
//non-moving platforms
export const data_platform_objects_static = 
[
    //staircase platforms
    {
        //core
        set:        "Alpha,Bravo",
        tag:        "0",
        parent:     "",
        style:      "debugging",
        //transform details
        position:   "2_1_2",
        scale:      "1_1_1",
        rotation:   "0_0_0",
    },
    {
        //core
        set:        "Alpha,Bravo",
        tag:        "1",
        parent:     "",
        style:      "debugging",
        //transform details
        position:   "2_2_5",
        scale:      "1_1_1",
        rotation:   "0_0_0",
    },
    {
        //core
        set:        "Alpha,Bravo",
        tag:        "2",
        parent:     "",
        style:      "debugging",
        //transform details
        position:   "2_3_8",
        scale:      "1_1_1",
        rotation:   "0_0_0",
    },
    //pathed platform exit 1
    {
        //core
        set:        "Alpha,Bravo",
        tag:        "3",
        parent:     "",
        style:      "debugging",
        //transform details
        position:   "2_7_22",
        scale:      "1_1_1",
        rotation:   "0_0_0",
    },
    //pathed platform exit 2
    {
        //core
        set:        "Bravo",
        tag:        "4",
        parent:     "",
        style:      "debugging",
        //transform details
        position:   "13_7_22",
        scale:      "1_1_1",
        rotation:   "0_0_0",
    },
    //parented to a rotating platform to create a wheel-way
    {
        //core
        set:        "Bravo",
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
        set:        "Bravo",
        tag:        "6",
        parent:     "rotating_0",
        style:      "stone",
        //transform details
        position:   "-5_0_0",
        scale:      "1_1_1",
        rotation:   "0_0_0",
    },
    //exit from wheel-way
    {
        //core
        set:        "Bravo",
        tag:        "7",
        parent:     "",
        style:      "stone",
        //transform details
        position:   "21_7_14",
        scale:      "1_1_1",
        rotation:   "0_0_0",
    },
    //exit from blink cycles
    {
        //core
        set:        "Bravo",
        tag:        "8",
        parent:     "",
        style:      "stone",
        //transform details
        position:   "25_7_2",
        scale:      "1_1_1",
        rotation:   "0_0_0",
    }
]
//path-moving platforms
export const data_platform_objects_pathing = 
[
    //upward pathing
    {
        //core
        set:        "Alpha,Bravo",
        tag:        "0",
        parent:     "",
        style:      "wood",
        //transform details
        position:   "2_3_11",
        scale:      "1_1_1",
        rotation:   "0_0_0",
        //object movement speed
        length:      "2",
        //pathing waypoints
        waypoints:
        [
            {position: "0_0_0"},
            {position: "0_4_0"}
        ]
    },
    //side pathing
    {
        //core
        set:        "Alpha,Bravo",
        tag:        "1",
        parent:     "",
        style:      "wood",
        //transform details
        position:   "2_7_14",
        scale:      "1_1_1",
        rotation:   "0_0_0",
        //object movement speed
        length:      "2",
        //pathing waypoints
        waypoints:
        [
            {position: "0_0_5"},
            {position: "0_0_0"}
        ]
    },
    {
        //core
        set:        "Bravo",
        tag:        "2",
        parent:     "",
        style:      "wood",
        //transform details
        position:   "5_7_22",
        scale:      "1_1_1",
        rotation:   "0_0_0",
        //object time for movement cycle
        length:      "2",
        //pathing waypoints
        waypoints:
        [
            {position: "0_0_0"},
            {position: "5_0_0"}
        ]
    }
]
//rotating platforms
export const data_platform_objects_rotating = 
[
    {
        //core
        set:        "Bravo",
        tag:        "0",
        parent:     "",
        style:      "metal",
        //transform details
        position:   "21_7_22",
        scale:      "1_1_1",
        rotation:   "0_0_0",
        //speed of rotation per axis
        rotationSpeed:  "0_1_0"
    }
]
//timed appearance platforms
export const data_platform_objects_blinking = 
[
    {
        //core
        set:        "Bravo",
        tag:        "0",
        parent:     "",
        style:      "metal",
        //transform details
        position:   "21_7_10",
        scale:      "1_1_1",
        rotation:   "0_0_0",
        //object time for blink cycle
        cycleStart:  "on",
        timeOn:      "2",
        timeOff:     "1"
    },
    {
        //core
        set:        "Bravo",
        tag:        "1",
        parent:     "",
        style:      "metal",
        //transform details
        position:   "21_7_6",
        scale:      "1_1_1",
        rotation:   "0_0_0",
        //object time for blink cycle
        cycleStart:  "off",
        timeOn:      "2",
        timeOff:     "1"
    },
    {
        //core
        set:        "Bravo",
        tag:        "2",
        parent:     "",
        style:      "metal",
        //transform details
        position:   "21_7_2",
        scale:      "1_1_1",
        rotation:   "0_0_0",
        //object time for blink cycle
        cycleStart:  "on",
        timeOn:      "2",
        timeOff:     "1"
    }
]