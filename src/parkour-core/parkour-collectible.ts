/*      PARKOUR COLLECTIBLE
    collectibles are loaded from the config file and placed around 
    the scene for players to gather.

    Author: Alex Pazder, thecryptotrader69@gmail.com
*/
import * as utils from "@dcl/ecs-scene-utils";
import { ParkourObject } from "./parkour-object";
import { collectible_object_data } from "./config/collectible-config";
export class ParkourCollectible extends ParkourObject 
{
    isCollected:boolean;
    defIndex:number;
    //trigger object
    trigger:utils.TriggerBoxShape;

    //constructor
    constructor(defIndex:number, shape:GLTFShape)
    {
        super(collectible_object_data[defIndex].position, collectible_object_data[defIndex].scale, collectible_object_data[defIndex].rotation);
        this.isCollected = false;
        this.defIndex = defIndex;

        //add model
        this.addComponent(shape);

        //add collision shape
        this.trigger = new utils.TriggerBoxShape(new Vector3(1,1,1));
    }
}