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
import { Dictionary, List } from "src/utilities/collections";
import { platform_style_data } from "src/parkour-core/platform-style-data";
import { 
    platform_object_data_static,
    platform_object_data_pathing,
    platform_object_data_rotating,
    platform_object_data_blinking 
} from "src/parkour-core/platform-object-data";
import 
{ 
    cmParkourPlatformStatic,
    cmParkourPlatformPathing,
    cmParkourPlatformRotating,
    cmParkourPlatformBlinking,
    ParkourPlatform
} from "src/parkour-core/parkour-platforms";

@Component("ParkourManager")
export class ParkourManager extends Entity 
{
    private isDebugging:boolean = false;

    //collection of all platform styles as gtlf shapes, access by type name
    //  this is an optimization that save on component creation
    public styleDict:Dictionary<GLTFShape>;

    //access for platform entities
    //  all platforms access by tag
    private platformDict:Dictionary<ParkourPlatform>;
    //  platform lists based on type
    private staticList:List<cmParkourPlatformStatic>;
    private pathingList:List<cmParkourPlatformPathing>;
    private rotatingList:List<cmParkourPlatformRotating>;
    private blinkingList:List<cmParkourPlatformBlinking>;

    //constructor
    constructor()
    {
        //initial entity initialization
        super();
        //NOTE: this manager must be added to the engine before any objects with a system
        //  attached can have their parents modified
        engine.addEntity(this);
        if(this.isDebugging) log("initializing...");

        //process all styles
        this.styleDict = new Dictionary<GLTFShape>();
        for(var i:number=0; i<platform_style_data.length; i++)
        {
            //add all platforms for style to collection
            this.styleDict.addItem(platform_style_data[i].type, new GLTFShape("models/platforms/"+platform_style_data[i].path+".glb"));
        }
        if(this.isDebugging) log("built style dictionary, count: "+this.styleDict.size().toString());

        //initialize collections
        //  dict
        this.platformDict = new Dictionary<ParkourPlatform>();
        //  lists
        this.staticList = new List<cmParkourPlatformStatic>();
        this.pathingList = new List<cmParkourPlatformPathing>();
        this.rotatingList = new List<cmParkourPlatformRotating>();
        this.blinkingList = new List<cmParkourPlatformBlinking>();
        
        //create all platforms
        //  static platform placement
        for(var i:number=0; i<platform_object_data_static.length; i++)
        {
            //create object
            var objStatic = new cmParkourPlatformStatic(i, this.styleDict.getItem(platform_object_data_static[i].style));
            objStatic.setParent(this);    
            //add to collection
            this.platformDict.addItem("static_"+platform_object_data_static[i].tag, objStatic);
            this.staticList.addItem(objStatic);
        }
        //  pathing platform placement
        for(var i:number=0; i<platform_object_data_pathing.length; i++)
        {
            //create object
            var objPathing = new cmParkourPlatformPathing(i, this.styleDict.getItem(platform_object_data_pathing[i].style));
            objPathing.setParent(this);
            //add to collection
            this.platformDict.addItem("pathing_"+platform_object_data_pathing[i].tag, objPathing);
            this.pathingList.addItem(objPathing);
        }
        //  rotating platform placement
        for(var i:number=0; i<platform_object_data_rotating.length; i++)
        {
            //create object
            var objRotating = new cmParkourPlatformRotating(i, this.styleDict.getItem(platform_object_data_rotating[i].style));
            objRotating.setParent(this);
            //add to collection
            this.platformDict.addItem("rotating_"+platform_object_data_pathing[i].tag, objRotating);
            this.rotatingList.addItem(objRotating);
        }
        //  blinking platform placement
        for(var i:number=0; i<platform_object_data_blinking.length; i++)
        {
            //create object
            var objBlinking = new cmParkourPlatformBlinking(i, this.styleDict.getItem(platform_object_data_blinking[i].style));
            objBlinking.setParent(this);
            //add to collection
            this.platformDict.addItem("blinking_"+platform_object_data_pathing[i].tag, objBlinking);
            this.blinkingList.addItem(objBlinking);
        }
        if(this.isDebugging) log("generated platforms, count: "+this.platformDict.size().toString());

        //reparent all platforms
        //  this has to be done after ALL platform objects have been created
        var objChild;
        var objParent;
        //  static platforms
        for(var i:number=0; i<platform_object_data_static.length; i++)
        {
            objChild = this.platformDict.getItem("static_"+platform_object_data_static[i].tag);
            //if there is a parenting request to pair this platform with another
            if(platform_object_data_static[i].parent.length > 0)
            {
                //grab object and realign parenting
                objParent = this.platformDict.getItem(platform_object_data_static[i].parent);
                objChild.DefineParent(objParent.parentingEntity);
            }
            //set this manager object as the default parent
            else
            {
                objChild.DefineParent(this);
            }
        }
        //  pathing platforms
        for(var i:number=0; i<platform_object_data_pathing.length; i++)
        {
            objChild = this.platformDict.getItem("pathing_"+platform_object_data_pathing[i].tag);
            //if there is a parenting request to pair this platform with another
            if(platform_object_data_pathing[i].parent.length > 0)
            {
                //grab object and realign parenting
                objParent = this.platformDict.getItem(platform_object_data_pathing[i].parent);
                objChild.DefineParent(objParent.parentingEntity);
            }
            //set this manager object as the default parent
            else
            {
                objChild.DefineParent(this);
            }
        }
        //  rotating platforms
        for(var i:number=0; i<platform_object_data_rotating.length; i++)
        {
            objChild = this.platformDict.getItem("rotating_"+platform_object_data_rotating[i].tag);
            //if there is a parenting request to pair this platform with another
            if(platform_object_data_rotating[i].parent.length > 0)
            {
                //grab object and realign parenting
                objParent = this.platformDict.getItem(platform_object_data_rotating[i].parent);
                objChild.DefineParent(objParent.parentingEntity);
            }
            //set this manager object as the default parent
            else
            {
                objChild.DefineParent(this);
            }
        }
        //  blinking platforms
        for(var i:number=0; i<platform_object_data_blinking.length; i++)
        {
            objChild = this.platformDict.getItem("blinking_"+platform_object_data_blinking[i].tag);
            //if there is a parenting request to pair this platform with another
            if(platform_object_data_blinking[i].parent.length > 0)
            {
                //grab object and realign parenting
                objParent = this.platformDict.getItem(platform_object_data_blinking[i].parent);
                objChild.DefineParent(objParent.parentingEntity);
            }
            //set this manager object as the default parent
            else
            {
                objChild.DefineParent(this);
            }
        }
        if(this.isDebugging) log("regenerated platform parents");

        //disable all platforms
        this.DisablePlatforms();

        if(this.isDebugging) log("initialization completed!");
    }

    //disables all platforms
    public DisablePlatforms()
    {
        if(this.isDebugging) log("disabling active platforms...");
        //  static platforms
        for(var i:number=0; i<this.staticList.size(); i++)
        {
            this.staticList.getItem(i).Deactivate();
        }
        //  pathing platforms
        for(var i:number=0; i<this.pathingList.size(); i++)
        {
            this.pathingList.getItem(i).Deactivate();
        }
        //  rotating platforms
        for(var i:number=0; i<this.rotatingList.size(); i++)
        {
            this.rotatingList.getItem(i).Deactivate();
        }
        //  blinking platforms
        for(var i:number=0; i<this.blinkingList.size(); i++)
        {
            this.blinkingList.getItem(i).Deactivate();
        }
        if(this.isDebugging) log("disabled active platforms!");
    }

    //activates a given platform set
    public ActivateSet(set:string)
    {
        if(this.isDebugging) log("activating set: "+set);
        this.DisablePlatforms();

        var tags:string[];
        var selected:List<ParkourPlatform> = new List<ParkourPlatform>();
        //gather all platforms belonging to the set
        //  static platforms
        for(var i:number=0; i<platform_object_data_static.length; i++)
        {
            //split set tags
            tags = platform_object_data_static[i].set.split(',');

            for(var j:number=0; j<platform_object_data_static.length; j++)
            {
                if(set == tags[j]) 
                {
                    selected.addItem(this.platformDict.getItem("static_"+platform_object_data_static[i].tag));
                }
            }
        }
        //  pathing platforms
        for(var i:number=0; i<platform_object_data_pathing.length; i++)
        {
            //split set tags
            tags = platform_object_data_pathing[i].set.split(',');

            for(var j:number=0; j<platform_object_data_pathing.length; j++)
            {
                if(set == tags[j]) 
                {
                    selected.addItem(this.platformDict.getItem("pathing_"+platform_object_data_pathing[i].tag));
                }
            }
        }
        //  rotating platforms
        for(var i:number=0; i<platform_object_data_rotating.length; i++)
        {
            //split set tags
            tags = platform_object_data_rotating[i].set.split(',');

            for(var j:number=0; j<platform_object_data_rotating.length; j++)
            {
                if(set == tags[j]) 
                {
                    selected.addItem(this.platformDict.getItem("rotating_"+platform_object_data_rotating[i].tag));
                }
            }
        }
        //  blinking platforms
        for(var i:number=0; i<platform_object_data_blinking.length; i++)
        {
            //split set tags
            tags = platform_object_data_blinking[i].set.split(',');

            for(var j:number=0; j<platform_object_data_blinking.length; j++)
            {
                if(set == tags[j]) 
                {
                    selected.addItem(this.platformDict.getItem("blinking_"+platform_object_data_blinking[i].tag));
                }
            }
        }

        if(this.isDebugging) log("found "+selected.size().toString()+" platforms belonging to this set")
        //gather all platforms belonging to the set
        for(var i:number=0; i<selected.size(); i++)
        {
            selected.getItem(i).ActivateObject();
        }

        //verify all parents and enable all systems
        for(var i:number=0; i<selected.size(); i++)
        {
            selected.getItem(i).VerifyParent();
            selected.getItem(i).ActivateSystem();
        }

        if(this.isDebugging) log("set activated");
    }
}