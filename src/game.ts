/*      PARKOUR START
    this handles the initialization of the parkour module. 

    Author: Alex Pazder, thecryptotrader69@gmail.com
*/

//import module manager
import { cmParkourManager } from "./cmParkourManager";
import { cmParkourStyleDict } from "./cmParkourStyleDict";

        
//initialize style dict
var styleDict:cmParkourStyleDict = new cmParkourStyleDict();

//create and intialize instance of manager
var managerObj:cmParkourManager = new cmParkourManager();

//activate set 'Alpha' by default
managerObj.ActivateSet("Bravo");

//add buttons for in-scene set swapping
//  clears scene
var buttonClear = new Entity();
buttonClear.addComponent(new BoxShape());
buttonClear.addComponent(new Transform({position: new Vector3(13, 1, 2)}));
buttonClear.addComponent(
    //add click action listener
    new OnPointerDown
    ( 
        (e) =>  { managerObj.DisablePlatforms(); },
        {
            button: ActionButton.PRIMARY,
            showFeedback: true,
            hoverText: "Clear",
            distance: 8,
        }
    )
);
engine.addEntity(buttonClear);
//  set alpha
var buttonAlpha = new Entity();
buttonAlpha.addComponent(new BoxShape());
buttonAlpha.addComponent(new Transform({position: new Vector3(16, 1, 2)}));
buttonAlpha.addComponent(
    //add click action listener
    new OnPointerDown
    ( 
        (e) =>  { managerObj.ActivateSet("Alpha"); },
        {
            button: ActionButton.PRIMARY,
            showFeedback: true,
            hoverText: "Set Alpha",
            distance: 8,
        }
    )
);
engine.addEntity(buttonAlpha);
//  set bravo
var buttonBravo = new Entity();
buttonBravo.addComponent(new BoxShape());
buttonBravo.addComponent(new Transform({position: new Vector3(19, 1, 2)}));
buttonBravo.addComponent(
    //add click action listener
    new OnPointerDown
    ( 
        (e) =>  { managerObj.ActivateSet("Bravo"); },
        {
            button: ActionButton.PRIMARY,
            showFeedback: true,
            hoverText: "Set Bravo",
            distance: 8,
        }
    )
);
engine.addEntity(buttonBravo);