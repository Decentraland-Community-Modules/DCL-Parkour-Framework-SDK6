/*      PARKOUR PLATFORMS
    contains all platform object types that can be created via
    the parkour manager.

    Author: Alex Pazder, thecryptotrader69@gmail.com
*/
import { ParkourObject } from "./parkour-object";
import 
{ 
    platform_object_data_static,
    platform_object_data_pathing,
    platform_object_data_rotating,
    platform_object_data_toggling 
} from "./config/platform-config";
import 
{
    ParkourPathingSystem,
    ParkourRotatingSystem,
    ParkourBlinkingSystem 
} from "./parkour-systems";

//  static platform
@Component("ParkourPlatformStatic")
export class ParkourPlatformStatic extends ParkourObject 
{
    //constructor
    constructor(defIndex:number, shape:GLTFShape)
    {
        super(platform_object_data_static[defIndex].position, platform_object_data_static[defIndex].scale, platform_object_data_static[defIndex].rotation);

        //add model
        this.addComponent(shape);
    }
}

//   pathed moving platform
@Component("ParkourPlatformPathing")
export class ParkourPlatformPathing extends ParkourObject 
{
    private systemPathing:ParkourPathingSystem;

    //constructor
    constructor(defIndex:number, shape:GLTFShape)
    {
        super(platform_object_data_pathing[defIndex].position, platform_object_data_pathing[defIndex].scale, platform_object_data_pathing[defIndex].rotation);
        
        //create pathing entity
        this.parentingEntity = new Entity();
        this.parentingEntity.setParent(this);    
        // add model
        this.parentingEntity.addComponent(shape);
        //  set position and scale
        this.parentingEntity.addComponent(new Transform());

        //create pathing system
        this.systemPathing = new ParkourPathingSystem(defIndex, this.parentingEntity);
        this.system = this.systemPathing;
    }

    //activates the attached system
    public ActivateSystem() 
    {
        //default, then add system
        this.systemPathing.Reset();
        if(this.system != undefined) engine.addSystem(this.systemPathing); 
    }

    //removes this  object and system from the scene
    public Deactivate() 
    {
        //check object existance in-engine
        if(this.isAddedToEngine())
        {
            //remove system
            engine.removeSystem(this.systemPathing);

            //remove object, with any child objects
            engine.removeEntity(this);
        }
    }
}

//   rotating platform
@Component("ParkourPlatformRotating")
export class ParkourPlatformRotating extends ParkourObject 
{
    private systemRotating:ParkourRotatingSystem;

    //constructor
    constructor(defIndex:number, shape:GLTFShape)
    {
        super(platform_object_data_rotating[defIndex].position, platform_object_data_rotating[defIndex].scale, platform_object_data_rotating[defIndex].rotation);
        
        //create rotating entity
        this.parentingEntity = new Entity();
        this.parentingEntity.setParent(this);    
        // add style
        this.parentingEntity.addComponent(shape);
        //  set position and scale
        this.parentingEntity.addComponent(new Transform());

        //create rotating system
        this.systemRotating = new ParkourRotatingSystem(defIndex, this.parentingEntity);
        this.system = this.systemRotating;
    }

    //activates the attached system
    public ActivateSystem() 
    {
        this.systemRotating.Reset();
        if(this.systemRotating != undefined) engine.addSystem(this.systemRotating); 
    }

    //removes this  object and system from the scene
    public Deactivate() 
    {
        //check object existance in-engine
        if(this.isAddedToEngine())
        {
            //remove system
            engine.removeSystem(this.systemRotating);

            //remove object, with any child objects
            engine.removeEntity(this);
        }
    }
}

//   blinking platform
@Component("ParkourPlatformBlinking")
export class ParkourPlatformBlinking extends ParkourObject 
{
    private systemBlinking:ParkourBlinkingSystem;

    constructor(defIndex:number, shape:GLTFShape)
    {
        super(platform_object_data_toggling[defIndex].position, platform_object_data_toggling[defIndex].scale, platform_object_data_toggling[defIndex].rotation);
        
        //create blinking entity
        this.parentingEntity = new Entity();
        this.parentingEntity.setParent(this);    
        //  add style
        this.parentingEntity.addComponent(shape);
        //  set position and scale
        this.parentingEntity.addComponent(new Transform
            ({
                position: new Vector3(0,0,0),
                scale: new Vector3(1,1,1),
                rotation: new Quaternion().setEuler(0,0,0)
            }));

        //create system
        this.systemBlinking = new ParkourBlinkingSystem(defIndex, this.parentingEntity);
        this.system = this.systemBlinking;
    }

    //activates the attached system
    public ActivateSystem() 
    {
        //default, then add system
        this.systemBlinking.Reset();
        if(this.system != undefined) engine.addSystem(this.systemBlinking); 
    }

    //removes this  object and system from the scene
    public Deactivate() 
    {
        //check object existance in-engine
        if(this.isAddedToEngine())
        {
            //remove system
            engine.removeSystem(this.systemBlinking);

            //remove object, with any child objects
            engine.removeEntity(this);
        }
    }
}