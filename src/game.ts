/*      PARKOUR DEMO SCENE
    

    Author: Alex Pazder, thecryptotrader69@gmail.com
*/
//imports
import * as utils from '@dcl/ecs-scene-utils'
import { movePlayerTo } from '@decentraland/RestrictedActions'
import { ParkourManager } from "src/parkour-core/parkour-manager";

//module setup
//  create parkour manager
var managerObj:ParkourManager = new ParkourManager();
//  activate set initial set
managerObj.ActivateSet("Charlie");

//stage setup
//  create arena
const arenaEntity = new Entity();
arenaEntity.addComponent(new GLTFShape("models/stageLava.glb"));
engine.addEntity(arenaEntity);
//  create start platform
const arenaStartEntity = new Entity();
arenaStartEntity.addComponent(new GLTFShape("models/platformStart.glb"));
arenaStartEntity.addComponent(new Transform({position: new Vector3(24, 1, 5)}));
engine.addEntity(arenaStartEntity);
//  create respawn on lava touch
//      edit player collider
utils.TriggerSystem.instance.setCameraTriggerShape(
    new utils.TriggerBoxShape(
      new Vector3(2.01, 1.01, 2.01),   //scale
      new Vector3(0, -0.75, 0)      //position
    )
  )
//      entity
const deathEntity = new Entity();
deathEntity.addComponent(new BoxShape());
//deathEntity.addComponent(new Transform({ position: new Vector3(24, 0.25, 24), scale: new Vector3(8, 0.5, 8) }));
deathEntity.addComponent(new Transform({ position: new Vector3(24, 0.25, 24), scale: new Vector3(43, 0.5, 43) }));
deathEntity.getComponent(BoxShape).withCollisions = false;
deathEntity.getComponent(BoxShape).visible = false;
//      trigger
let deathTrigger = new utils.TriggerBoxShape(deathEntity.getComponent(Transform).scale);
deathEntity.addComponent(
  new utils.TriggerComponent(
    deathTrigger,
	{
		onCameraEnter :() => 
        {
			log('triggered!');
            movePlayerTo({ x: 24, y: 2, z: 5 }, { x: 24, y: 2, z: 24 });
		}
	}
  )
);
engine.addEntity(deathEntity);