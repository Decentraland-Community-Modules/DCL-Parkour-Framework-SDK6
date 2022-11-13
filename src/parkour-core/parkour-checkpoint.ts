/*      PARKOUR CHECKPOINT
    checkpoints are loaded from the config file and placed around 
    the scene for to act as respawn points for when the player is killed.
    when a player collides with a checkpoint it will become their respawn
    location.

    Author: Alex Pazder, thecryptotrader69@gmail.com
*/
import * as utils from "@dcl/ecs-scene-utils";
import { ParkourObject } from "./parkour-object";
import { checkpoint_object_data } from "./config/checkpoint-config";
import { checkpoint_data } from "./data/checkpoint-data";
export class ParkourCheckpoint extends ParkourObject 
{
    defIndex:number;
    styleIndex:number;

    //trigger object
    triggerObj:Entity;
    trigger:utils.TriggerBoxShape;

    //constructor
    constructor(defIndex:number, styleIndex:number, shape:GLTFShape)
    {
        super(checkpoint_object_data[defIndex].position, checkpoint_object_data[defIndex].scale, checkpoint_object_data[defIndex].rotation);
        this.defIndex = defIndex;
        this.styleIndex = styleIndex;
        
        //add model
        this.addComponent(shape);

        //trigger setup
        //  object
        this.triggerObj = new Entity();
        this.triggerObj.setParent(this);
        //  set position and scale
        var pos = checkpoint_data[styleIndex].position.split('_');
        var sca = checkpoint_data[styleIndex].scale.split('_');
        var rot = checkpoint_data[styleIndex].rotation.split('_');
        this.triggerObj.addComponent(new Transform
        ({
            position: new Vector3(+pos[0],+pos[1],+pos[2]),
            scale: new Vector3(+sca[0],+sca[1],+sca[2]),
            rotation: new Quaternion().setEuler(+rot[0],+rot[1],+rot[2])
        }));
        //  trigger box
        this.trigger = new utils.TriggerBoxShape(new Vector3(1,1,1));
    }
}