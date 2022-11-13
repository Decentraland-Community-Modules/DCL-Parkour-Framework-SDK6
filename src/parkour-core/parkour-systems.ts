/*      PARKOUR SYSTEMS
    contains all systems controlled by the parkour manage that provide
    update cycling for real-time actions.

    Author: Alex Pazder, thecryptotrader69@gmail.com
*/
import { List } from "src/utilities/collections";
import 
{
    platform_object_data_pathing,
    platform_object_data_rotating,
    platform_object_data_toggling 
} from "./config/platform-config";

//   movement system for pathed platforms
@Component("cmParkourPlatformPathingSystem")
export class ParkourPathingSystem implements ISystem  
{
    //timing
    private length:number;
    private distance:number; 

    //pathing
    public pathingIndexes:number[];
    public pathingPoints:List<Vector3>;

    public pathingEntityTransform:Transform;

    //constructor
    constructor(defIndex:number, obj:Entity)
    {
        this.length = +platform_object_data_pathing[defIndex].length;
        this.distance = 0;

        //set object
        this.pathingEntityTransform = obj.getComponent(Transform);

        //create list of all pathing nodes
        this.pathingPoints = new List<Vector3>();
        for(var i:number=0; i<platform_object_data_pathing[defIndex].waypoints.length; i++)
        {
            var pos = platform_object_data_pathing[defIndex].waypoints[i].position.split('_');
            this.pathingPoints.addItem(new Vector3(+pos[0],+pos[1],+pos[2]));
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
                    this.pathingPoints.getItem(this.pathingIndexes[0]), 
                    this.pathingPoints.getItem(this.pathingIndexes[1]), 
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

//   rotation system for rotating platforms
@Component("ParkourPlatformRotatingSystem")
export class ParkourRotatingSystem implements ISystem  
{
    public rotationStart:Vector3;
    public rotationSpeed:Vector3;

    public objectTransform:Transform;

    //constructor
    constructor(defIndex:number, obj:Entity)
    {
        //set object
        this.objectTransform = obj.getComponent(Transform);
        this.rotationStart = this.objectTransform.eulerAngles;

        //set rotation start target
        var ros = platform_object_data_rotating[defIndex].rotationSpeed.split('_');
        this.rotationSpeed = new Vector3(+ros[0], +ros[1], +ros[2]);
    }
    
    update(dt: number) 
    {
        this.objectTransform.rotate(Axis.X, this.rotationSpeed.x);
        this.objectTransform.rotate(Axis.Y, this.rotationSpeed.y);
        this.objectTransform.rotate(Axis.Z, this.rotationSpeed.x);
    }

    //sets the default state of platform's system
    public Reset()
    {
        this.objectTransform.rotation = Quaternion.Euler(this.rotationStart.x,this.rotationStart.y,this.rotationStart.z);
    }
}

//   blink system for blinking platforms
@Component("ParkourPlatformRotatingSystem")
export class ParkourBlinkingSystem implements ISystem  
{
    //current system state
    private state:number;

    //timer count
    private timer:number;
    private length:number[];

    //platform object transform
    private objectTransform:Transform;
    //vector changes
    private vectorEnabled:Vector3;
    private vectorDisabled:Vector3;

    //constructor
    constructor(defIndex:number, obj:Entity)
    {
        //defaults
        this.state = 0;
        this.timer = 0;

        //load state lengths
        this.length = 
        [
            +platform_object_data_toggling[defIndex].delay_start,
            +platform_object_data_toggling[defIndex].length,
            +platform_object_data_toggling[defIndex].delay_end
        ];

        //set reset parent and get object's transform
        this.objectTransform = obj.getComponent(Transform);
        this.vectorEnabled = new Vector3(1, 1, 1);
        this.vectorDisabled = new Vector3(0, 0, 0);
    }
    
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
                    this.objectTransform.scale = this.vectorEnabled;
                break;
                //process time off - end
                case 2:
                    this.objectTransform.scale = this.vectorDisabled;
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
        this.objectTransform.scale = this.vectorDisabled;
    }
}