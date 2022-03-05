/*     PARKOUR MANAGER
    this module processes all platform data from cmPlatformObjectData.ts,
    creating and placing platforms within the scene. Platform creation for
    each type is seperated as much as possible to make it easier for a user
    to incorporate their own data type into this module.

    the constructor for the manager has 3 major processes:
        1) load all platforms from data, creating their object representations
        2) parenting all platforms based on their data definitions
        3) hide/disable all platforms, in prep for an activation of a set
        
    this process is rather lengthy and could be done in a shorter form, but
    this format enhances readability and allows easier modification/addition
    of platform processing.

    Author: Alex Pazder, thecryptotrader69@gmail.com
*/
import { Dictionary, List } from "./dict"
import 
{ 
    data_platform_objects_static,
    data_platform_objects_pathing,
    data_platform_objects_rotating,
    data_platform_objects_blinking 
} from "./cmPlatformObjectData"
import 
{ 
    cmParkourPlatformStatic,
    cmParkourPlatformPathing,
    cmParkourPlatformRotating,
    cmParkourPlatformBlinking,
    cmParkourPlatform
} from "./cmParkourPlatforms";

@Component("cmParkourManager")
export class cmParkourManager extends Entity 
{
    private isDebugging:number = 1;

    //access for platform entities
    //  all platforms access by tag
    private platformDict:Dictionary<cmParkourPlatform>;
    //  platform lists based on type
    private staticList:List<cmParkourPlatformStatic>;
    private pathingList:List<cmParkourPlatformPathing>;
    private rotatingList:List<cmParkourPlatformRotating>;
    private blinkingList:List<cmParkourPlatformBlinking>;

    constructor()
    {
        //initial entity initialization
        super();
        //NOTE: this manager must be added to the engine before any objects with a system
        //  attached can have their parents modified
        engine.addEntity(this);
        if(this.isDebugging == 1) log("Parkour: initializing...");
        
        //initialize collections
        //  dict
        this.platformDict = new Dictionary<cmParkourPlatform>();
        //  lists
        this.staticList = new List<cmParkourPlatformStatic>();
        this.pathingList = new List<cmParkourPlatformPathing>();
        this.rotatingList = new List<cmParkourPlatformRotating>();
        this.blinkingList = new List<cmParkourPlatformBlinking>();
        
        //create all platforms
        //  static platform placement
        for(var i:number=0; i<data_platform_objects_static.length; i++)
        {
            //create object
            var objStatic = new cmParkourPlatformStatic(i);
            objStatic.setParent(this);    
            //add to collection
            this.platformDict.add("static_"+data_platform_objects_static[i].tag, objStatic);
            this.staticList.add(objStatic);
        }
        //  pathing platform placement
        for(var i:number=0; i<data_platform_objects_pathing.length; i++)
        {
            //create object
            var objPathing = new cmParkourPlatformPathing(i);
            objPathing.setParent(this);
            //add to collection
            this.platformDict.add("pathing_"+data_platform_objects_pathing[i].tag, objPathing);
            this.pathingList.add(objPathing);
        }
        //  rotating platform placement
        for(var i:number=0; i<data_platform_objects_rotating.length; i++)
        {
            //create object
            var objRotating = new cmParkourPlatformRotating(i);
            objRotating.setParent(this);
            //add to collection
            this.platformDict.add("rotating_"+data_platform_objects_pathing[i].tag, objRotating);
            this.rotatingList.add(objRotating);
        }
        //  blinking platform placement
        for(var i:number=0; i<data_platform_objects_blinking.length; i++)
        {
            //create object
            var objBlinking = new cmParkourPlatformBlinking(i);
            objBlinking.setParent(this);
            //add to collection
            this.platformDict.add("blinking_"+data_platform_objects_pathing[i].tag, objBlinking);
            this.blinkingList.add(objBlinking);
        }

        //reparent all platforms
        //  this has to be done after ALL platform objects have been created
        var objChild;
        var objParent;
        //  static platforms
        for(var i:number=0; i<data_platform_objects_static.length; i++)
        {
            objChild = this.platformDict.getItem("static_"+data_platform_objects_static[i].tag);
            //if there is a parenting request to pair this platform with another
            if(data_platform_objects_static[i].parent.length > 0)
            {
                //grab object and realign parenting
                objParent = this.platformDict.getItem(data_platform_objects_static[i].parent);
                objChild.DefineParent(objParent.parentingEntity);
            }
            //set this manager object as the default parent
            else
            {
                objChild.DefineParent(this);
            }
        }
        //  pathing platforms
        for(var i:number=0; i<data_platform_objects_pathing.length; i++)
        {
            objChild = this.platformDict.getItem("pathing_"+data_platform_objects_pathing[i].tag);
            //if there is a parenting request to pair this platform with another
            if(data_platform_objects_pathing[i].parent.length > 0)
            {
                //grab object and realign parenting
                objParent = this.platformDict.getItem(data_platform_objects_pathing[i].parent);
                objChild.DefineParent(objParent.parentingEntity);
            }
            //set this manager object as the default parent
            else
            {
                objChild.DefineParent(this);
            }
        }
        //  rotating platforms
        for(var i:number=0; i<data_platform_objects_rotating.length; i++)
        {
            objChild = this.platformDict.getItem("rotating_"+data_platform_objects_rotating[i].tag);
            //if there is a parenting request to pair this platform with another
            if(data_platform_objects_rotating[i].parent.length > 0)
            {
                //grab object and realign parenting
                objParent = this.platformDict.getItem(data_platform_objects_rotating[i].parent);
                objChild.DefineParent(objParent.parentingEntity);
            }
            //set this manager object as the default parent
            else
            {
                objChild.DefineParent(this);
            }
        }
        //  blinking platforms
        for(var i:number=0; i<data_platform_objects_blinking.length; i++)
        {
            objChild = this.platformDict.getItem("blinking_"+data_platform_objects_blinking[i].tag);
            //if there is a parenting request to pair this platform with another
            if(data_platform_objects_blinking[i].parent.length > 0)
            {
                //grab object and realign parenting
                objParent = this.platformDict.getItem(data_platform_objects_blinking[i].parent);
                objChild.DefineParent(objParent.parentingEntity);
            }
            //set this manager object as the default parent
            else
            {
                objChild.DefineParent(this);
            }
        }

        //disable all platforms
        this.DisablePlatforms();

        if(this.isDebugging == 1) log("Parkour: initialization completed");
    }

    //disables all platforms
    public DisablePlatforms()
    {
        //  static platforms
        for(var i:number=0; i<this.staticList.size(); i++)
        {
            this.staticList.get(i).Deactivate();
        }
        //  pathing platforms
        for(var i:number=0; i<this.pathingList.size(); i++)
        {
            this.pathingList.get(i).Deactivate();
        }
        //  rotating platforms
        for(var i:number=0; i<this.rotatingList.size(); i++)
        {
            this.rotatingList.get(i).Deactivate();
        }
        //  blinking platforms
        for(var i:number=0; i<this.blinkingList.size(); i++)
        {
            this.blinkingList.get(i).Deactivate();
        }
    }

    //activates a given platform set
    public ActivateSet(set:string)
    {
        log("activating set: "+set);
        this.DisablePlatforms();

        var tags:string[];
        var selected:List<cmParkourPlatform> = new List<cmParkourPlatform>();
        //gather all platforms belonging to the set
        //  static platforms
        for(var i:number=0; i<data_platform_objects_static.length; i++)
        {
            //split set tags
            tags = data_platform_objects_static[i].set.split(',');

            for(var j:number=0; j<data_platform_objects_static.length; j++)
            {
                if(set == tags[j]) 
                {
                    selected.add(this.platformDict.getItem("static_"+data_platform_objects_static[i].tag));
                }
            }
        }
        //  pathing platforms
        for(var i:number=0; i<data_platform_objects_pathing.length; i++)
        {
            //split set tags
            tags = data_platform_objects_pathing[i].set.split(',');

            for(var j:number=0; j<data_platform_objects_pathing.length; j++)
            {
                if(set == tags[j]) 
                {
                    selected.add(this.platformDict.getItem("pathing_"+data_platform_objects_pathing[i].tag));
                }
            }
        }
        //  rotating platforms
        for(var i:number=0; i<data_platform_objects_rotating.length; i++)
        {
            //split set tags
            tags = data_platform_objects_rotating[i].set.split(',');

            for(var j:number=0; j<data_platform_objects_rotating.length; j++)
            {
                if(set == tags[j]) 
                {
                    selected.add(this.platformDict.getItem("rotating_"+data_platform_objects_rotating[i].tag));
                }
            }
        }
        //  blinking platforms
        for(var i:number=0; i<data_platform_objects_blinking.length; i++)
        {
            //split set tags
            tags = data_platform_objects_blinking[i].set.split(',');

            for(var j:number=0; j<data_platform_objects_blinking.length; j++)
            {
                if(set == tags[j]) 
                {
                    selected.add(this.platformDict.getItem("blinking_"+data_platform_objects_blinking[i].tag));
                }
            }
        }

        log("Found "+selected.size().toString()+" entries")
        //gather all platforms belonging to the set
        for(var i:number=0; i<selected.size(); i++)
        {
            selected.get(i).ActivateObject();
        }

        //verify all parents and enable all systems
        for(var i:number=0; i<selected.size(); i++)
        {
            selected.get(i).VerifyParent();
            selected.get(i).ActivateSystem();
        }

        log("set activated");
    }
}