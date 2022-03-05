/*      PARKOUR PLATFORMS
    contains the different types of platforms that can be
    instansiated by the module.



    Author: Alex Pazder, thecryptotrader69@gmail.com
*/
import { Dictionary, List } from "./dict"
import { cmParkourStyleDict } from "./cmParkourStyleDict";
import 
{ 
    data_platform_objects_static,
    data_platform_objects_pathing,
    data_platform_objects_rotating,
    data_platform_objects_blinking 
} from "./cmPlatformObjectData"

//  core platform definition used for general collection storage
export class cmParkourPlatform extends Entity 
{
    //entity targeted for parenting another system to this platform
    public parentingEntity:Entity;
    //entity this platform will be parented to when activated
    public parentedEntity:Entity;
    //entity's system component
    public system:ISystem|undefined;

    constructor()
    {
        super();
        this.parentingEntity = this;
        this.parentedEntity = this;
    }

    public DefineParent(par:Entity)
    {
        this.setParent(par);
        this.parentedEntity = par;
    }

    //adds this platform to the scene
    public ActivateObject() 
    { 
        engine.addEntity(this); 
    }
    //attempts to parent this object to its designated parent
    public VerifyParent() 
    {
        this.setParent(this.parentedEntity);
    }
    public ActivateSystem() 
    {
        if(this.system != undefined) engine.addSystem(this.system); 
    }

    //removes this platform from the scene
    public Deactivate() 
    {
        if(this.system != undefined) engine.removeSystem(this.system);
        this.setParent(null);
        engine.removeEntity(this); 
    }
}

//  static platform
@Component("cmParkourPlatformStatic")
export class cmParkourPlatformStatic extends cmParkourPlatform 
{
    constructor(defIndex:number)
    {
        super();
        //  add style
        this.addComponent(new GLTFShape("models/"+
            cmParkourStyleDict.INSTANCE.StyleDict.getItem("static_"+data_platform_objects_static[defIndex].style)+".glb"));
        //this.addComponent(new BoxShape());
        //  set position and scale
        var pos = data_platform_objects_static[defIndex].position.split('_');
        var sca = data_platform_objects_static[defIndex].scale.split('_');
        var rot = data_platform_objects_static[defIndex].rotation.split('_');
        this.addComponent(new Transform
        ({
            position: new Vector3(+pos[0],+pos[1],+pos[2]),
            scale: new Vector3(+sca[0],+sca[1],+sca[2]),
            rotation: new Quaternion().setEuler(+rot[0],+rot[1],+rot[2])
        }));
        engine.addEntity(this);
    }
}

//   pathed moving platform
@Component("cmParkourPlatformPathing")
export class cmParkourPlatformPathing extends cmParkourPlatform 
{
    private systemPathing:cmParkourPlatformPathingSystem;

    constructor(defIndex:number)
    {
        super();
        //setup parent object
        //  set position and scale
        var pos = data_platform_objects_pathing[defIndex].position.split('_');
        var sca = data_platform_objects_pathing[defIndex].scale.split('_');
        var rot = data_platform_objects_pathing[defIndex].rotation.split('_');
        this.addComponent(new Transform
        ({
            position: new Vector3(+pos[0],+pos[1],+pos[2]),
            scale: new Vector3(+sca[0],+sca[1],+sca[2]),
            rotation: new Quaternion().setEuler(+rot[0],+rot[1],+rot[2])
        }));
        
        //create pathing entity
        this.parentingEntity = new Entity();
        this.parentingEntity.setParent(this);    
        //  add style
        this.parentingEntity.addComponent(new GLTFShape("models/"+
            cmParkourStyleDict.INSTANCE.StyleDict.getItem("pathing_"+data_platform_objects_pathing[defIndex].style)+".glb"));
        //  set position and scale
        this.parentingEntity.addComponent(new Transform());
        engine.addEntity(this);

        //create pathing system
        this.systemPathing = new cmParkourPlatformPathingSystem(defIndex, this.parentingEntity);
        this.system = this.systemPathing;
        engine.addSystem(this.systemPathing);
    }

    public ActivateSystem() 
    {
        this.systemPathing.Reset();
        if(this.system != undefined) engine.addSystem(this.system); 
    }
}
//   movement system for pathed platforms
@Component("cmParkourPlatformPathingSystem")
export class cmParkourPlatformPathingSystem implements ISystem  
{
    private length:number;
    private distance:number; 

    public pathingIndexes:number[];
    public pathingPoints:List<Vector3>;

    public pathingEntityTransform:Transform;

    constructor(defIndex:number, obj:Entity)
    {
        this.length = +data_platform_objects_pathing[defIndex].length;
        this.distance = 0;

        //set object
        this.pathingEntityTransform = obj.getComponent(Transform);

        //create list of all pathing nodes
        this.pathingPoints = new List<Vector3>();
        for(var i:number=0; i<data_platform_objects_pathing[defIndex].waypoints.length; i++)
        {
            var pos = data_platform_objects_pathing[defIndex].waypoints[i].position.split('_');
            this.pathingPoints.add(new Vector3(+pos[0],+pos[1],+pos[2]));
        }

        //set pathing target
        this.pathingIndexes = [0, 0];
        if(this.pathingPoints.size() > 1)
        {
            this.pathingIndexes[1] = 1;
        }
    }
    
    update(dt: number) 
    {
        //process object movement between points
        if (this.distance < 1) 
        {
            this.pathingEntityTransform.position = 
                Vector3.Lerp(
                    this.pathingPoints.get(this.pathingIndexes[0]), 
                    this.pathingPoints.get(this.pathingIndexes[1]), 
                    this.distance);
            this.distance +=  dt / this.length;
        } 
        //push to next waypoint
        else 
        {
          this.nextTarget();
          this.distance = 0;
        }
    }

    private nextTarget()
    {
        //increase primary pathing waypoint
        this.pathingIndexes[0]++;
        //check for roll-over
        if(this.pathingIndexes[0] >= this.pathingPoints.size())
        {
            this.pathingIndexes[0] = 0;
        }
        //increase secondary pathing waypoint
        this.pathingIndexes[1] = this.pathingIndexes[0]+1;
        //check for roll-over
        if(this.pathingIndexes[1] >= this.pathingPoints.size())
        {
            this.pathingIndexes[1] = 0;
        }
    }

    //sets the default state of platform's system
    public Reset()
    {
        //set core values
        this.distance = 0;

        //reset path
        this.pathingIndexes[0] = 0;
        this.pathingIndexes[1] = 1;
        if(this.pathingIndexes[1] >= this.pathingPoints.size())
        {
            this.pathingIndexes[1] = 0;
        }
    }
}

//   rotating platform
@Component("cmParkourPlatformRotating")
export class cmParkourPlatformRotating extends cmParkourPlatform 
{
    private systemRotating:cmParkourPlatformRotatingSystem;

    constructor(defIndex:number)
    {
        super();
        //setup parent object
        //  set position and scale
        var pos = data_platform_objects_rotating[defIndex].position.split('_');
        var sca = data_platform_objects_rotating[defIndex].scale.split('_');
        var rot = data_platform_objects_rotating[defIndex].rotation.split('_');
        this.addComponent(new Transform
        ({
            position: new Vector3(+pos[0],+pos[1],+pos[2]),
            scale: new Vector3(+sca[0],+sca[1],+sca[2]),
            rotation: new Quaternion().setEuler(+rot[0],+rot[1],+rot[2])
        }));
        
        //create rotating entity
        this.parentingEntity = new Entity();
        this.parentingEntity.setParent(this);    
        //  add style
        this.parentingEntity.addComponent(new GLTFShape("models/"+
            cmParkourStyleDict.INSTANCE.StyleDict.getItem("rotating_"+data_platform_objects_rotating[defIndex].style)+".glb"));
        //  set position and scale
        this.parentingEntity.addComponent(new Transform());
        engine.addEntity(this);

        //create rotating system
        this.systemRotating = new cmParkourPlatformRotatingSystem(defIndex, this.parentingEntity);
        this.system = this.systemRotating;
        engine.addSystem(this.system);
    }

    public ActivateSystem() 
    {
        this.systemRotating.Reset();
        if(this.system != undefined) engine.addSystem(this.system); 
    }
}
//   rotation system for rotating platforms
@Component("cmParkourPlatformRotatingSystem")
export class cmParkourPlatformRotatingSystem implements ISystem  
{
    public rotationStart:Vector3;
    public rotationSpeed:Vector3;

    public pathingEntityTransform:Transform;

    constructor(defIndex:number, obj:Entity)
    {
        //set object
        this.pathingEntityTransform = obj.getComponent(Transform);
        this.rotationStart = this.pathingEntityTransform.eulerAngles;

        //set rotation start target
        var ros = data_platform_objects_rotating[defIndex].rotationSpeed.split('_');
        this.rotationSpeed = new Vector3(+ros[0], +ros[1], +ros[2]);
    }
    
    update(dt: number) 
    {
        this.pathingEntityTransform.rotate(Axis.X, this.rotationSpeed.x);
        this.pathingEntityTransform.rotate(Axis.Y, this.rotationSpeed.y);
        this.pathingEntityTransform.rotate(Axis.Z, this.rotationSpeed.x);
    }

    //sets the default state of platform's system
    public Reset()
    {
        this.pathingEntityTransform.rotation = Quaternion.Euler(this.rotationStart.x,this.rotationStart.y,this.rotationStart.z);
    }
}

//   blinking platform
@Component("cmParkourPlatformBlinking")
export class cmParkourPlatformBlinking extends cmParkourPlatform 
{
    private systemBlinking:cmParkourPlatformBlinkingSystem;

    constructor(defIndex:number)
    {
        super();
        //setup parent object
        //  set position and scale
        var pos = data_platform_objects_blinking[defIndex].position.split('_');
        var sca = data_platform_objects_blinking[defIndex].scale.split('_');
        var rot = data_platform_objects_blinking[defIndex].rotation.split('_');
        this.addComponent(new Transform
        ({
            position: new Vector3(+pos[0],+pos[1],+pos[2]),
            scale: new Vector3(+sca[0],+sca[1],+sca[2]),
            rotation: new Quaternion().setEuler(+rot[0],+rot[1],+rot[2])
        }));
        
        //create blinking entity
        this.parentingEntity = new Entity();
        this.parentingEntity.setParent(this);    
        //  add style
        this.parentingEntity.addComponent(new GLTFShape("models/"+
            cmParkourStyleDict.INSTANCE.StyleDict.getItem("blinking_"+data_platform_objects_blinking[defIndex].style)+".glb"));
        //  set position and scale
        this.parentingEntity.addComponent(new Transform());
        engine.addEntity(this);

        //create blinking system
        var state:number;
        if(data_platform_objects_blinking[defIndex].cycleStart == "on")
        {
            state = 0;
        }
        else
        {
            state = 1;
        }

        this.systemBlinking = new cmParkourPlatformBlinkingSystem(defIndex, this.parentingEntity, state);
        this.system = this.systemBlinking;
        engine.addSystem(this.system);
    }

    public ActivateSystem() 
    {
        this.systemBlinking.Reset();
        if(this.system != undefined) engine.addSystem(this.system); 
    }
}
//   blink system for blinking platforms
@Component("cmParkourPlatformRotatingSystem")
export class cmParkourPlatformBlinkingSystem implements ISystem  
{
    private toggleDefault:number;
    private toggle:number;
    private length:number[];

    private timer:number;

    private parent:IEntity|null;
    private entity:Entity;

    constructor(defIndex:number, obj:Entity, state:number)
    {
        this.toggleDefault = state;
        this.toggle = state;

        this.length = 
        [
            +data_platform_objects_blinking[defIndex].timeOn,
            +data_platform_objects_blinking[defIndex].timeOff
        ];
        this.timer = 0;

        //set reset parent and get object's transform
        this.parent = obj.getParent();
        this.entity = obj;
    }
    
    update(dt: number) 
    {
        //check timer for toggle
        if (this.timer < this.length[this.toggle]) 
        {
          this.timer += dt;
        }
        //roll over into next iteration
        else
        {
            this.timer = 0;
            //change toggle
            if(this.toggle == 0)
            {
                this.toggle = 1;
                this.entity.setParent(this.parent);
                engine.addEntity(this.entity);
            }
            else
            {
                this.toggle = 0;
                this.entity.setParent(null);
                engine.removeEntity(this.entity);
            }
        }
    }

    //sets the default state of platform's system
    public Reset()
    {
        this.timer = 0;
        this.toggle = this.toggleDefault;
        if(this.toggle == 0)
        {
            this.entity.setParent(this.parent);
            engine.addEntity(this.entity);
        }
        else
        {
            this.entity.setParent(null);
            engine.removeEntity(this.entity);
        }
    }
}