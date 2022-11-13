/*      PARKOUR DEMO SCENE
  this scene provides a quick, interactible walkthrough of all current features provided by 
  the kit. The main addition here if the InfoDisplay class, which handles set swapping and displaying
  details. The class itself isn't very modular, as it is a bit of a fresh idea and can safely be cleared
  out for your own set-management systems.

  Author: Alex Pazder, thecryptotrader69@gmail.com
*/
//imports
import { ParkourManager } from "src/parkour-core/parkour-manager";

class InfoDisplay
{
  manager:ParkourManager;
  setCur = 0;
  // defs
  setName:string[] = ['Intro', 'Sets', 'Platform - Basic', 'Platform - Advanced', 'Collectible', 'Trap', 'Outro'];
  setVects:Vector3[][] = 
  [
    [new Vector3(24, 2, 16), new Vector3(0, 0, 0)],
    [new Vector3(24, 2, 16), new Vector3(0, 0, 0)],
    [new Vector3(12, 2, 16), new Vector3(0, 0, 0)],
    [new Vector3(12, 2, 32), new Vector3(0, 180, 0)],
    [new Vector3(36, 2, 16), new Vector3(0, 0, 0)],
    [new Vector3(36, 2, 32), new Vector3(0, 180, 0)],
    [new Vector3(24, 2, 16), new Vector3(0, 0, 0)]
  ];
  setHeaders:string[] =
  [
    'Welcome',
    'Sets',
    'Platform Basics',
    'Platform Advanced',
    'Collectibles',
    'Traps',
    'Thank You!'
  ]
  setDescs:string[] =
  [
    'This scene will walk you through all the utilities provided by the Parkour Creation Kit and provides a general outline their use. The project is entirely open source and all code/assets are completely free to use in any project. A more detailed overview of use can be found in the public repository, access via the \'REPO\' button below!',
    'All parkour objects can be assigned to a \'set\' which can be changed while your browser is running. This can be increadibly useful for packing multiple stages or difficulties into a single scene. An object can also be part of multiple sets, allowing it to be reused through multiple stages! This can be increadibly useful for packing multiple stages or difficulties into a single scene.',
    'There are 4 main types of platforms: static, pathing, rotating, and blinking. These come with a variety of controls and settings, such as position, rotation, action speed, and delays. Like other parkour objects in the kit, different styles can be applied to platforms and additonal styles can easily be added to the kit!',
    'Platforms (and most other parkour objects) can be parented with one another to create more complex scenes. The child object inherits from the parent object, so any effects applied to the parent trickle down to the child. Example: a pathing platform up/down parented to a pathing platform moving foward/backward will inherit that movement.',
    'Collectibles are objects that can be placed around your scene for players to gather. They can be used to drive the player along a specific path and come with 2 pick-up types: collision and interaction. The parkour manager also automatically generates a HUD (top left) to display the current count of collectibles remaining in-scene.',
    'Traps and checkpoints (look at your feet) can be used to provide additional challenges throughout your scene. Traps come in 3 types: static, toggling, and projectile. Players can set checkpoints by simply walking over them; when a player gets hit by a trap they will respawn at the most recent checkpoint. When a new set is selected the player will respawn at the defualt checkpoint (highest in list order).',
    'Thank you for your attention! If you are interested in building with this community kit, or just want more information, you can check out the public repository (REPO button). If you find any bugs or have any ideas for additional features, please do not hesitate to reach out!\n\n\tAlex,\n\tTheCryptoTrader69@gmail.com'
  ]

  // objects
  infoParent:Entity = new Entity();
  infoPanel:Entity = new Entity();
  infoTextHeaderE:Entity = new Entity();
  infoTextHeaderT:TextShape;
  infoTextDescE:Entity = new Entity();
  infoTextDescT:TextShape;
  infoButtonNext:Entity = new Entity();
  infoButtonPrev:Entity = new Entity();
  infoButtonRepo:Entity = new Entity();

  //swap vects 
  //  (0:disabled, 1:enabled)
  swapVectorScale:Vector3[] = [new Vector3(0,0,0), new Vector3(0.75,0.75,1)];
  //  (0:left, 1:right)
  swapVectorPosition:Vector3[] = [new Vector3(-1.65,-1,0), new Vector3(1.65,-1,0)];

  //constructor
  constructor(park:ParkourManager)
  {
    this.manager = park;
    //objects
    //  parent
    this.infoParent.addComponent(new Transform
    ({
        position: new Vector3(0,0,0),
        scale: new Vector3(1,1,1),
        rotation: new Quaternion().setEuler(0,0,0)
    }));
    //  panel
    this.infoPanel.setParent(this.infoParent);
    this.infoPanel.addComponent(new GLTFShape('models/utilities/menuObjSquare.glb'));
    this.infoPanel.addComponent(new Transform
    ({
        position: new Vector3(0,1.7,0),
        scale: new Vector3(2.8,1.5,1),
        rotation: new Quaternion().setEuler(0,0,0)
    }));
    //  text - header
    this.infoTextHeaderE.setParent(this.infoParent);
    this.infoTextHeaderE.addComponent(new Transform
    ({
      position: new Vector3(0,2.75,0),
      scale: new Vector3(0.8,0.8,0.8),
      rotation: new Quaternion().setEuler(0,0,0)
    }));
    this.infoTextHeaderT = this.infoTextHeaderE.addComponent(new TextShape('HEADER'));
    this.infoTextHeaderT.fontSize = 8;
    this.infoTextHeaderT.color = Color3.Black();
    this.infoTextHeaderT.vTextAlign = 'center';
    this.infoTextHeaderT.hTextAlign = 'center';
    this.infoTextHeaderT.width = 100;
    this.infoTextHeaderT.height = 0;
    //  text - desc
    this.infoTextDescE.setParent(this.infoParent);
    this.infoTextDescE.addComponent(new Transform
    ({
      position: new Vector3(0,2.35,0),
      scale: new Vector3(1,1,1),
      rotation: new Quaternion().setEuler(0,0,0)
    }));
    this.infoTextDescT = this.infoTextDescE.addComponent(new TextShape('BODY'));
    this.infoTextDescT.fontSize = 2;
    this.infoTextDescT.color = Color3.Black();
    this.infoTextDescT.vTextAlign = 'top';
    this.infoTextDescT.hTextAlign = 'left';
    this.infoTextDescT.textWrapping = true;
    this.infoTextDescT.width = 5.25;
    this.infoTextDescT.height = 0;
    //  next button
    this.infoButtonNext.setParent(this.infoParent);
    this.infoButtonNext.addComponent(new GLTFShape('models/utilities/menuObjShort.glb'));
    this.infoButtonNext.addComponent(new TextShape('NEXT'));
    this.infoButtonNext.getComponent(TextShape).color = Color3.Black();
    this.infoButtonNext.addComponent(new Transform
    ({
      position: this.swapVectorPosition[1],
      scale: this.swapVectorScale[1],
      rotation: new Quaternion().setEuler(0,0,0)
    }));
    this.infoButtonNext.addComponent
    (
        new OnPointerDown
        (
            (e) =>
            {
              //push next set
              this.setCur++;
              this.DisplaySet(this.setCur);
            },
            {
              button: ActionButton.ANY,
              showFeedback: true,
              hoverText: "[E] NEXT",
              distance: 32
            }
        )
    );
    //  prev button
    this.infoButtonPrev.setParent(this.infoParent);
    this.infoButtonPrev.addComponent(new GLTFShape('models/utilities/menuObjShort.glb'));
    this.infoButtonPrev.addComponent(new TextShape('PREV'));
    this.infoButtonPrev.getComponent(TextShape).color = Color3.Black();
    this.infoButtonPrev.addComponent(new Transform
    ({
      position: this.swapVectorPosition[0],
      scale: this.swapVectorScale[1],
      rotation: new Quaternion().setEuler(0,0,0)
    }));
    this.infoButtonPrev.addComponent
    (
        new OnPointerDown
        (
            (e) =>
            {
              //push next set
              this.setCur--;
              this.DisplaySet(this.setCur);
            },
            {
              button: ActionButton.ANY,
              showFeedback: true,
              hoverText: "[E] PREV",
              distance: 32
            }
        )
    );
    //  repo button
    this.infoButtonRepo.setParent(this.infoParent);
    this.infoButtonRepo.addComponent(new GLTFShape('models/utilities/menuObjShort.glb'));
    this.infoButtonRepo.addComponent(new TextShape('REPO'));
    this.infoButtonRepo.getComponent(TextShape).color = Color3.Black();
    this.infoButtonRepo.addComponent(new Transform
    ({
      position: this.swapVectorPosition[0],
      scale: this.swapVectorScale[1],
      rotation: new Quaternion().setEuler(0,0,0)
    }));
    this.infoButtonRepo.addComponent
    (
        new OnPointerDown
        (
            (e) =>
            {
              //open link
              openExternalURL("https://github.com/TheCryptoTrader69/Decentraland_ParkourKit");
            },
            {
              button: ActionButton.ANY,
              showFeedback: true,
              hoverText: "[E] Public Repository",
              distance: 32
            }
        )
    );

    //add to engine
    engine.addEntity(this.infoParent);
    this.DisplaySet(0);
  }

  // functionality
  public DisplaySet(set:number)
  {
    //ensure set is within bounds
    if(set < 0 || set > this.setName.length-1) return;
    this.setCur = set;

    //update stage
    this.manager.ActivateSet(this.setName[this.setCur]);

    //set position
    this.infoParent.getComponent(Transform).position = this.setVects[this.setCur][0];
    this.infoParent.getComponent(Transform).rotation.eulerAngles = this.setVects[this.setCur][1];

    //update text
    this.infoTextHeaderT.value = this.setHeaders[this.setCur];
    this.infoTextDescT.value = this.setDescs[this.setCur];

    //button changes
    //  start
    if(this.setCur == 0)
    {
      //replace 'prev' button 
      this.infoButtonNext.getComponent(Transform).scale = this.swapVectorScale[1];
      this.infoButtonPrev.getComponent(Transform).scale = this.swapVectorScale[0];
      this.infoButtonRepo.getComponent(Transform).scale = this.swapVectorScale[1];
      this.infoButtonRepo.getComponent(Transform).position = this.swapVectorPosition[0];
    }
    //  end
    else if(this.setCur == this.setName.length-1)
    {
      //replace 'next' button
      this.infoButtonNext.getComponent(Transform).scale = this.swapVectorScale[0];
      this.infoButtonPrev.getComponent(Transform).scale = this.swapVectorScale[1];
      this.infoButtonRepo.getComponent(Transform).scale = this.swapVectorScale[1];
      this.infoButtonRepo.getComponent(Transform).position = this.swapVectorPosition[1];
    }
    //  mid
    else
    {
      this.infoButtonNext.getComponent(Transform).scale = this.swapVectorScale[1];
      this.infoButtonPrev.getComponent(Transform).scale = this.swapVectorScale[1];
      this.infoButtonRepo.getComponent(Transform).scale = this.swapVectorScale[0];
    }
  }

}

//module setup
//  create parkour manager
const managerObj:ParkourManager = new ParkourManager();
const infoDisplay:InfoDisplay = new InfoDisplay(managerObj);