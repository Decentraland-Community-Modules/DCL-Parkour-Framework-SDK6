/*      PARKOUR TRAP
    traps are loaded from the config file and placed around 
    the scene for to hinder the player. when a player collides 
    with a trap they respawn at the last valid checkpoint.

    Author: Alex Pazder, thecryptotrader69@gmail.com
*/
import * as utils from "@dcl/ecs-scene-utils";
import { ParkourObject } from "./parkour-object";
import { trap_object_data_projectile, trap_object_data_static, trap_object_data_toggling } from "./config/trap-config";
import { trap_data, trap_data_multi } from "./data/trap-data";
//static trap, death area always active
export class ParkourTrapStatic extends ParkourObject 
{
    //trigger object
    triggerObj:Entity;
    trigger:utils.TriggerBoxShape;

    //constructor
    constructor(defIndex:number, styleIndex:number, shape:GLTFShape)
    {
        super(trap_object_data_static[defIndex].position, trap_object_data_static[defIndex].scale, trap_object_data_static[defIndex].rotation);
        
        //add model
        this.addComponent(shape);

        //trigger setup
        //  object
        this.triggerObj = new Entity();
        this.triggerObj.setParent(this);
        //  set position and scale
        var pos = trap_data[styleIndex].position.split('_');
        var sca = trap_data[styleIndex].scale.split('_');
        var rot = trap_data[styleIndex].rotation.split('_');
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
//toggle trap, toggles between active and inactive death zone
export class ParkourTrapToggle extends ParkourObject 
{
    //animations
    //  animator
    animator:Animator;
    //  tags
    animationTags:string[] = ['anim_enable', 'anim_disable'];
    //  states
    animationEnable:AnimationState;
    animationDisable:AnimationState;

    //trigger object
    triggerObj:Entity;
    trigger:utils.TriggerBoxShape;

    //real-time system
    systemToggle:ParkourTrapSystemToggle;

    //constructor
    constructor(defIndex:number, styleIndex:number, shape:GLTFShape)
    {
        super(trap_object_data_toggling[defIndex].position, trap_object_data_toggling[defIndex].scale, trap_object_data_toggling[defIndex].rotation);
        
        //add model
        this.addComponent(shape);

        //trigger setup
        //  object
        this.triggerObj = new Entity();
        this.triggerObj.setParent(this);
        //  set position and scale
        var pos = trap_data[styleIndex].position.split('_');
        var sca = trap_data[styleIndex].scale.split('_');
        var rot = trap_data[styleIndex].rotation.split('_');
        this.triggerObj.addComponent(new Transform
        ({
            position: new Vector3(+pos[0],+pos[1],+pos[2]),
            scale: new Vector3(+sca[0],+sca[1],+sca[2]),
            rotation: new Quaternion().setEuler(+rot[0],+rot[1],+rot[2])
        }));
        //  trigger box
        this.trigger = new utils.TriggerBoxShape(new Vector3(1,1,1));

        //animations setup
        //  animator
        this.animator = this.addComponent(new Animator());
        //  states
        this.animationEnable = new AnimationState(this.animationTags[0], { looping: false, speed: 5 });
        this.animator.addClip(this.animationEnable);
        this.animationDisable = new AnimationState(this.animationTags[1], { looping: false, speed: 5 });
        this.animator.addClip(this.animationDisable);
        //  system
        this.systemToggle = new ParkourTrapSystemToggle(defIndex, this.triggerObj, this.animationEnable, this.animationDisable);
        this.system = this.systemToggle;
    }

    //activates the attached system
    public ActivateSystem() 
    {
        //default, then add system
        this.systemToggle.Reset();
        engine.addSystem(this.systemToggle); 
    }

    //removes this  object and system from the scene
    public Deactivate() 
    {
        //check object existance in-engine
        if(this.isAddedToEngine())
        {
            //remove system
            engine.removeSystem(this.systemToggle);

            //remove object, with any child objects
            engine.removeEntity(this);
        }
    }
}
//system used for real-time management of animated traps
//  cycles trap through on and off states
export class ParkourTrapSystemToggle implements ISystem  
{
    //current system state
    private state:number;

    //timer count
    private timer:number;
    private length:number[];

    //projectile pieces
    //  trigger
    private triggerEntity:Entity;
    private triggerHit:utils.TriggerComponent|undefined;
    
    //animation states
    animationEnable:AnimationState;
    animationDisable:AnimationState;

    //constructor
    constructor(defIndex:number, trig:Entity, animE:AnimationState, animD:AnimationState)
    {
        //defaults
        this.state = 0;
        this.timer = 0;

        //transforms
        this.triggerEntity = trig;

        //load state lengths
        this.length = 
        [
            +trap_object_data_projectile[defIndex].delay_start,
            +trap_object_data_projectile[defIndex].length,
            +trap_object_data_projectile[defIndex].delay_end
        ];

        //grab animation bits
        this.animationEnable = animE;
        this.animationDisable = animD;
    }
    
    //real-time process
    update(dt: number) 
    {
        //check timer for timer complete
        if (this.timer < this.length[this.state]) 
        {
          this.timer += dt;
        }
        //roll over into next iteration
        else
        {
            //roll over timer
            this.timer = 0;
            this.state++;
            if(this.state >= 3) this.state = 0; 

            //process state
            switch(this.state)
            {
                //process time off - start
                case 0:
                    //nothing should need to be done here, everything has been set by state=2 or reset
                break;
                //process time on
                case 1:
                    //animation
                    this.animationDisable.stop();
                    this.animationEnable.play();
                    //add deathzone
                    if(this.triggerHit != undefined) this.triggerHit.enabled = true;
                break;
                //process time off - end
                case 2:
                    //animation 
                    this.animationEnable.stop();
                    this.animationDisable.play();
                    //remove deathzone
                    if(this.triggerHit != undefined) this.triggerHit.enabled = false;
                break;
            }
        }
    }

    //sets the default state of platform's system
    public Reset()
    {
        this.timer = 0;
        this.state = 0;
        //animation
        this.animationDisable.stop();
        this.animationEnable.play();
        //remove deathzone
        if(this.triggerHit == undefined) this.triggerHit = this.triggerEntity.getComponent(utils.TriggerComponent);
        this.triggerHit.enabled = false;
    }
}
//project trap, fires projectiles on interval at a target location
export class ParkourTrapProjectile extends ParkourObject 
{
    //projectile object
    projectileObj:Entity;
    //trigger object
    triggerObj:Entity;
    trigger:utils.TriggerBoxShape;
    
    //real-time system
    systemProjectile:ParkourTrapSystemProjectile;

    //constructor
    constructor(defIndex:number, styleIndex:number, shapeBase:GLTFShape, shapeProjectile:GLTFShape)
    {
        super(trap_object_data_projectile[defIndex].position, trap_object_data_projectile[defIndex].scale, trap_object_data_projectile[defIndex].rotation);
        
        //add model
        this.addComponent(shapeBase);

        //projectile setup
        this.projectileObj = new Entity();
        this.projectileObj.addComponent(shapeProjectile);
        this.projectileObj.addComponent(new Transform
        ({
            position: new Vector3(0,0,0),
            scale: new Vector3(1,1,1),
            rotation: new Quaternion().setEuler(0,0,0)
        }));
        this.projectileObj.setParent(this);

        //trigger setup
        //  object
        this.triggerObj = new Entity();
        this.triggerObj.setParent(this.projectileObj);
        //  set position and scale
        var pos = trap_data_multi[styleIndex].position.split('_');
        var sca = trap_data_multi[styleIndex].scale.split('_');
        var rot = trap_data_multi[styleIndex].rotation.split('_');
        this.triggerObj.addComponent(new Transform
        ({
            position: new Vector3(+pos[0],+pos[1],+pos[2]),
            scale: new Vector3(+sca[0],+sca[1],+sca[2]),
            rotation: new Quaternion().setEuler(+rot[0],+rot[1],+rot[2])
        }));
        //  trigger box
        this.trigger = new utils.TriggerBoxShape(new Vector3(1,1,1));

        //  system
        this.systemProjectile = new ParkourTrapSystemProjectile(defIndex, this.projectileObj, this.triggerObj);
        this.system = this.systemProjectile;
    }

    //activates the attached system
    public ActivateSystem() 
    {
        //default, then add system
        this.systemProjectile.Reset();
        engine.addSystem(this.systemProjectile); 
    }

    //removes this  object and system from the scene
    public Deactivate() 
    {
        //check object existance in-engine
        if(this.isAddedToEngine())
        {
            //remove system
            engine.removeSystem(this.systemProjectile);

            //remove object, with any child objects
            engine.removeEntity(this);
        }
    }
}
//system used for real-time management of animated traps
//  cycles trap through on and off states
//  this system manages 2 object: projectile (visible object, always active) and
//      a death zone (invisible, toggles)
export class ParkourTrapSystemProjectile implements ISystem  
{
    //current system state
    private state:number;

    //timer count
    private timer:number;
    private length:number[];
    //projectile transition
    private distance:number;
    private start:Vector3;
    private target:Vector3;

    //projectile pieces
    //  projectile
    private projectileTransform:Transform;
    //  trigger
    private triggerEntity:Entity;
    private triggerHit:utils.TriggerComponent|undefined;

    //constructor
    constructor(defIndex:number, ent:Entity, trig:Entity)
    {
        //defaults
        this.state = 0;
        this.timer = 0;
        this.distance = 0;
        this.start = new Vector3(0, 0, 0);
        var pos = trap_object_data_projectile[defIndex].fire_target.split('_');
        this.target = new Vector3(+pos[0], +pos[1], +pos[2]);

        //transforms
        this.projectileTransform = ent.getComponent(Transform);
        this.triggerEntity = trig;

        //load state lengths
        this.length = 
        [
            +trap_object_data_projectile[defIndex].delay_start,
            +trap_object_data_projectile[defIndex].length,
            +trap_object_data_projectile[defIndex].delay_end
        ];
    }
    
    //real-time process
    update(dt: number) 
    {
        //check timer for timer complete
        if (this.timer < this.length[this.state]) 
        {
          this.timer += dt;

          //if firing state
          if(this.state == 1)
          {
            //process projectile movement
            this.projectileTransform.position = 
                Vector3.Lerp(
                    this.start, 
                    this.target, 
                    this.distance);
            this.distance +=  dt / this.length[this.state];
          }
        }
        //roll over into next iteration
        else
        {
            //roll over timer
            this.timer = 0;
            this.state++;
            if(this.state >= 3) this.state = 0; 

            //process state
            switch(this.state)
            {
                //process start fire delay time
                case 0:
                    //reset projectile position
                    this.projectileTransform.position = new Vector3(this.start.x, this.start.y, this.start.z);
                    //remove deathzone
                    if(this.triggerHit != undefined) this.triggerHit.enabled = false;
                break;
                //process firing time
                case 1:
                    //reset travel distance
                    this.distance = 0;
                    //add deathzone
                    if(this.triggerHit != undefined) this.triggerHit.enabled = true;
                break;
                //process end fire delay time
                case 2:
                    //set projectile position to end
                    this.projectileTransform.position = new Vector3(this.target.x, this.target.y, this.target.z);
                    //remove deathzone
                    if(this.triggerHit != undefined) this.triggerHit.enabled = false;
                break;
            }
        }
    }

    //sets the default state of platform's system
    public Reset()
    {
        this.timer = 0;
        this.state = 0;
        //reset projectile position
        this.projectileTransform.position = new Vector3(0, 0, 0);
        //remove deathzone
        if(this.triggerHit == undefined) this.triggerHit = this.triggerEntity.getComponent(utils.TriggerComponent);
        this.triggerHit.enabled = false;
    }
}