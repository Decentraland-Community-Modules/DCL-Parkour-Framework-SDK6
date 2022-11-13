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

    the system could be changed to optimize the amount of data retained in-scene,
    at the cost of processing during each set change: we could allow the same objects
    to be used across different sets by creating a pooling system, then reconstructing
    the required layout for each set with those objects. this would cost quite a few more
    processes, but would make the scene leaner overall.

    Author: Alex Pazder, thecryptotrader69@gmail.com
*/
import * as utils from '@dcl/ecs-scene-utils';
import { movePlayerTo } from '@decentraland/RestrictedActions';
import { MenuGroup2D } from "src/utilities/menu-group-2D";
import { Dictionary, List } from "src/utilities/collections";
//  collectibles
import { collectible_data } from "./data/collectible-data";
import { collectible_object_data } from "./config/collectible-config";
import { ParkourCollectible } from "./parkour-collectible";
//  platforms
import { platform_data } from "./data/platform-data";
import { ParkourObject } from "./parkour-object";
import 
{ 
    platform_object_data_static,
    platform_object_data_pathing,
    platform_object_data_rotating,
    platform_object_data_toggling as platform_object_data_blinking 
} from "./config/platform-config";
import 
{ 
    ParkourPlatformStatic,
    ParkourPlatformPathing,
    ParkourPlatformRotating,
    ParkourPlatformBlinking
} from "./parkour-platforms";
//  traps
import { trap_data, trap_data_multi } from "./data/trap-data";
import
{ 
    trap_object_data_projectile,
    trap_object_data_static, 
    trap_object_data_toggling 
} from "./config/trap-config";
import 
{
    ParkourTrapProjectile,
    ParkourTrapStatic,
    ParkourTrapToggle
} from "./parkour-trap";
//  checkpoints
import { checkpoint_data } from "./data/checkpoint-data";
import
{ 
    checkpoint_object_data
} from "./config/checkpoint-config";
import 
{
    ParkourCheckpoint
} from "./parkour-checkpoint";

@Component("ParkourManager")
export class ParkourManager extends Entity 
{
    private isDebugging:boolean = false;

    //collection of all custom object shapes used in module, access by type name
    //  this is an optimization that save on component creation
    private objectShapeDict:Dictionary<GLTFShape>;

    //menu manager used to create 2D HUD for # of remaining collectibles
    private menuGroup2D:MenuGroup2D = new MenuGroup2D(this);

    //prepares 2D HUD, creating base line display
    private MenuSetUp()
    {
        //  background
        //      object
        this.menuGroup2D.AddMenuObject("Background");
        this.menuGroup2D.AdjustMenuObject("Background", 0, new Vector2(200,45));
        this.menuGroup2D.AdjustMenuObject("Background", 1, new Vector2(200,100));
        this.menuGroup2D.AdjustMenuObject("Background", 2, new Vector2(0,0));
        this.menuGroup2D.AdjustMenuColour("Background", new Color4(0.2, 0.2, 0.2, 1));
        //  title
        //      bakcground object
        this.menuGroup2D.AddMenuObject("TitleBg", "Background");
        this.menuGroup2D.AdjustMenuObject("TitleBg", 0, new Vector2(0,15));
        this.menuGroup2D.AdjustMenuObject("TitleBg", 1, new Vector2(170,30));
        this.menuGroup2D.AdjustMenuObject("TitleBg", 2, new Vector2(1,0));
        this.menuGroup2D.AdjustMenuColour("TitleBg", new Color4(0.3, 0.3, 0.8, 1));
        //      object
        this.menuGroup2D.AddMenuObject("Title", "TitleBg");
        this.menuGroup2D.AdjustMenuObject("Title", 1, new Vector2(160,20));
        this.menuGroup2D.AdjustMenuObject("Title", 2, new Vector2(1,1));
        //      text
        this.menuGroup2D.AddMenuText("Title", "Text", "Parkour Collectibles");
        this.menuGroup2D.AdjustTextDisplay("Title", "Text", 0, 12);
        //activate by default
        this.menuGroup2D.SetMenuState(0);
    }

    //creates an additional HUD container for a collectible counter based on given definition index
    private MenuCollectibleAdd(index:number)
    {
        //add def index
        this.collectibleStyleIndex.addItem(collectible_data[index].type, index);
        //create gather count entry
        this.collectibleCountGathered.addItem(collectible_data[index].type, new ParkourVal());

        //create object
        const tag:string = collectible_data[index].type;
        //  object
        this.menuGroup2D.AddMenuObject(tag, "Background");
        this.menuGroup2D.AdjustMenuObject(tag, 0, new Vector2(0,-20-(25*index)));
        this.menuGroup2D.AdjustMenuObject(tag, 1, new Vector2(190,20));
        this.menuGroup2D.AdjustMenuObject(tag, 2, new Vector2(1,0));
        //  text
        this.menuGroup2D.AddMenuText(tag, "Text", collectible_data[index].displayName+": 0 / 0");
        this.menuGroup2D.AdjustTextDisplay(tag, "Text", 0, 12);

        //readjust background size
        this.menuGroup2D.AdjustMenuObject("Background", 1, new Vector2(200,45+(25*index)));
    }

    //updates the collection HUD for the given definition index to the given value
    private MenuCollectibleUpdate(type:string)
    {//if there is an entry for the current set
        if(this.collectibleCountDict.getItem(this.setCur).containsKey(type))
        {
            this.menuGroup2D.SetMenuText(type, "Text", collectible_data[this.collectibleStyleIndex.getItem(type)].displayName+": "+
                this.collectibleCountGathered.getItem(type).value+" / "+
                this.collectibleCountDict.getItem(this.setCur).getItem(type).value
            );
        }
        else
        {
            this.menuGroup2D.SetMenuText(type, "Text", collectible_data[this.collectibleStyleIndex.getItem(type)].displayName+": Not Included");
        }
    }

    //updates the collection HUD for the given definition index to the given value
    private MenuCollectibleReset()
    {
        if(this.isDebugging) log("resetting collectible hud...");
        //reset gather count for each style
        for(var i:number=0; i<collectible_data.length; i++)
        {
            //ensure collectible type has been included in game
            if(!this.collectibleCountGathered.containsKey(collectible_data[i].type))
            continue;

            //zero out gathered counts
            this.collectibleCountGathered.getItem(collectible_data[i].type).value = 0;
            
            //update display
            this.MenuCollectibleUpdate(collectible_data[i].type);
        }
        if(this.isDebugging) log("reset collectible hud!");
    }
    
    //action called upon collectible gather (collectible object exits scene by default)
    public GatherCollectible(type:string)
    {
        if(this.isDebugging) log("collectible of type "+type+" gathered!");
        this.collectibleCountGathered.getItem(type).value += 1;
        this.MenuCollectibleUpdate(type);
    }

    //set management details
    //  collection of all objects, access via type+sub-type+tag
    private parkourObjectDict:Dictionary<ParkourObject>;
    //  current set
    private setCur:string = '';
    //  list of all available sets 
    private setTags:List<String>;
    //  collection of all objects belonging to a set, access via set tag
    private setObjects:Dictionary<List<ParkourObject>>;

    //registers the given object to the given raw set sting ('set0,set1')
    //  type/style-specific processing should be handled here
    private RegisterToSet(type:number, style:string, setsRaw:string, obj:ParkourObject)
    {
        const sets:string[] = setsRaw.split(',');
        for(var i:number=0; i<sets.length; i++)
        {
            //check for set's existance
            if(!this.setObjects.containsKey(sets[i]))
            {
                //generate new set container
                this.setTags.addItem(sets[i]);
                this.setObjects.addItem(sets[i], new List<ParkourObject>());
                //collectible count
                if(!this.collectibleCountDict.containsKey(sets[i]))
                {
                    this.collectibleCountDict.addItem(sets[i],new Dictionary<ParkourVal>());
                } 
            }

            //register object
            this.setObjects.getItem(sets[i]).addItem(obj);
            //add to the count of collections included in set
            if(type == 0)
            {
                //ensure existance
                if(!this.collectibleCountDict.getItem(sets[i]).containsKey(style))
                {
                    this.collectibleCountDict.getItem(sets[i]).addItem(style, new ParkourVal());
                }
                this.collectibleCountDict.getItem(sets[i]).getItem(style).value += 1;
            }
            //check checkpoint defaults
            if(type == 3)
            {
                if(!this.respawnDefaults.containsKey(sets[i]))
                {
                    this.respawnDefaults.addItem(sets[i], (obj as ParkourCheckpoint));
                }
            }
        }
    }

    //access for collectible entities
    //  collectible styles by index order (for HUD updates)
    private collectibleStyleIndex:Dictionary<number>;
    //  all collectible objects
    private collectibleList:List<ParkourObject>;
    //  collectible count for each set, access by set then style
    private collectibleCountDict:Dictionary<Dictionary<ParkourVal>>;
    //  number of collectibles gathered by the player 
    private collectibleCountGathered:Dictionary<ParkourVal>;

    //access for platform entities
    //  all platform objects
    private platformList:List<ParkourObject>;

    //access for trap entities
    //  trap styles by index order (setting simplification)
    private trapStyleIndex:Dictionary<number>;
    //  all trap objects
    private trapList:List<ParkourObject>;

    //access for checkpoint system
    //  checkpoint styles by index order (for HUD updates)
    private checkpointStyleIndex:Dictionary<number>;
    //  all checkpoint objects
    private checkpointList:List<ParkourObject>;
    //  default respawns per set
    private respawnDefaults:Dictionary<ParkourCheckpoint>;
    //  current respawn details
    private respawnPosition:Vector3;
    private respawnLook:Vector3;

    //constructor
    constructor()
    {
        //initial entity initialization
        super();
        //NOTE: this manager must be added to the engine before any objects with a system
        //  attached can have their parents modified
        engine.addEntity(this);
        if(this.isDebugging) log("initializing...");

        //modify player trigger shape
        utils.TriggerSystem.instance.setCameraTriggerShape(
            new utils.TriggerBoxShape(
                new Vector3(2.01, 1.01, 2.01),   //scale
                new Vector3(0, -0.75, 0)      //position
            )
        );

        //prepare 2D HUD
        this.MenuSetUp();

        //process all object shapes to dict
        this.objectShapeDict = new Dictionary<GLTFShape>();
        //  collectibles
        for(var i:number=0; i<collectible_data.length; i++)
        {
            this.objectShapeDict.addItem("collectible_"+collectible_data[i].type, new GLTFShape("models/collectibles/"+collectible_data[i].path+".glb"));
        }
        //  platforms
        for(var i:number=0; i<platform_data.length; i++)
        {
            this.objectShapeDict.addItem("platform_"+platform_data[i].type, new GLTFShape("models/platforms/"+platform_data[i].path+".glb"));
        }
        //  traps - single
        for(var i:number=0; i<trap_data.length; i++)
        {
            this.objectShapeDict.addItem("trap_"+trap_data[i].type, new GLTFShape("models/traps/"+trap_data[i].path+".glb"));
        }
        //  traps - multi
        for(var i:number=0; i<trap_data_multi.length; i++)
        {
            this.objectShapeDict.addItem("trap_base_"+trap_data_multi[i].type, new GLTFShape("models/traps/"+trap_data_multi[i].path_base+".glb"));
            this.objectShapeDict.addItem("trap_proj_"+trap_data_multi[i].type, new GLTFShape("models/traps/"+trap_data_multi[i].path_projectile+".glb"));
        }
        //  checkpoints
        for(var i:number=0; i<checkpoint_data.length; i++)
        {
            this.objectShapeDict.addItem("checkpoint_"+checkpoint_data[i].type, new GLTFShape("models/checkpoints/"+checkpoint_data[i].path+".glb"));
        }

        if(this.isDebugging) log("built style dictionary, count: "+this.objectShapeDict.size());

        //initialize collections
        //  overhead
        this.parkourObjectDict = new Dictionary<ParkourObject>();
        this.setTags = new List<String>();
        this.setObjects = new Dictionary<List<ParkourObject>>();
        //  collectibles
        this.collectibleStyleIndex = new Dictionary<number>();
        this.collectibleList = new List<ParkourCollectible>();
        this.collectibleCountDict = new Dictionary<Dictionary<ParkourVal>>();
        this.collectibleCountGathered = new Dictionary<ParkourVal>();
        //  platforms
        this.platformList = new List<ParkourObject>();
        //  traps
        this.trapStyleIndex = new Dictionary<number>();
        this.trapList = new List<ParkourObject>();
        //  checkpoints
        this.checkpointStyleIndex = new Dictionary<number>();
        this.checkpointList = new List<ParkourCheckpoint>();
        //  respawn details
        this.respawnDefaults = new Dictionary<ParkourCheckpoint>();
        this.respawnPosition = new Vector3();
        this.respawnLook = new Vector3();

        //create and set objects to entry-default
        //  generate objects
        this.GenerateCollectibles();
        this.GeneratePlatforms();
        this.GenerateTraps();
        this.GenerateCheckpoints();
        //  generate parenting linkage
        this.GenerateParenting();

        if(this.isDebugging) log("initialization completed!");
    }

    //loads all collectibles from config
    public GenerateCollectibles()
    {
        if(this.isDebugging) log("generating collectibles...");

        //create collectible definition type 
        for(var i:number=0; i<collectible_data.length; i++)
        {
            this.MenuCollectibleAdd(i);
        }

        //create all collectibles
        for(var i:number=0; i<collectible_object_data.length; i++)
        {
            //create object
            const obj = new ParkourCollectible(i, this.objectShapeDict.getItem("collectible_"+collectible_object_data[i].style));
            //  collision pickup
            if((+collectible_object_data[i].interact) == 0)
            {
                obj.addComponent(
                    new utils.TriggerComponent(
                    obj.trigger,
                    {
                        onCameraEnter :() => 
                        {
                            if(this.isDebugging) log("collision hit: "+collectible_object_data[obj.defIndex].style);
                            //gather collectible
                            this.GatherCollectible(collectible_object_data[obj.defIndex].style);
                            //hide self
                            obj.Deactivate();
                        }
                    }
                    )
                );
            }
            //  interaction pickup
            else
            {
                obj.addComponent
                (
                    //add click action listener
                    new OnPointerDown
                    (
                        (e) =>
                        {
                            if(this.isDebugging) log("collision hit: "+collectible_object_data[obj.defIndex].style);
                            //gather collectible
                            this.GatherCollectible(collectible_object_data[obj.defIndex].style);
                            //hide self
                            obj.Deactivate();
                        },
                        {
                            button: ActionButton.ANY,
                            showFeedback: true,
                            hoverText: "[E] GATHER",
                            distance: 8
                        }
                    )
                );
            }
            obj.DefineParent(this);
            //add to collection
            this.collectibleList.addItem(obj);
            this.parkourObjectDict.addItem("collectible_"+collectible_object_data[i].tag, obj);
            //add to set collection
            this.RegisterToSet(0, collectible_object_data[i].style, collectible_object_data[i].set, obj);
        }

        if(this.isDebugging) log("generated collectibles, count: "+this.collectibleList.size().toString());
    }

    //loads all platforms from config
    public GeneratePlatforms()
    {
        if(this.isDebugging) log("generating platforms...");

        //create all platforms
        //  static platform placement
        for(var i:number=0; i<platform_object_data_static.length; i++)
        {
            //create object
            const objStatic = new ParkourPlatformStatic(i, this.objectShapeDict.getItem("platform_"+platform_object_data_static[i].style));
            //add to collection
            this.platformList.addItem(objStatic);
            this.parkourObjectDict.addItem("platform_static_"+platform_object_data_static[i].tag, objStatic);
            //register to set
            this.RegisterToSet(1, platform_object_data_static[i].style, platform_object_data_static[i].set, objStatic);
        }
        //  pathing platform placement
        for(var i:number=0; i<platform_object_data_pathing.length; i++)
        {
            //create object
            const objPathing = new ParkourPlatformPathing(i, this.objectShapeDict.getItem("platform_"+platform_object_data_pathing[i].style));
            //add to collection
            this.platformList.addItem(objPathing);
            this.parkourObjectDict.addItem("platform_pathing_"+platform_object_data_static[i].tag, objPathing);
            //register to set
            this.RegisterToSet(1, platform_object_data_pathing[i].style, platform_object_data_pathing[i].set, objPathing);
        }
        //  rotating platform placement
        for(var i:number=0; i<platform_object_data_rotating.length; i++)
        {
            //create object
            const objRotating = new ParkourPlatformRotating(i, this.objectShapeDict.getItem("platform_"+platform_object_data_rotating[i].style));
            //add to collection
            this.platformList.addItem(objRotating);
            this.parkourObjectDict.addItem("platform_rotating_"+platform_object_data_static[i].tag, objRotating);
            //register to set
            this.RegisterToSet(1, platform_object_data_rotating[i].style, platform_object_data_rotating[i].set, objRotating);
        }
        //  blinking platform placement
        for(var i:number=0; i<platform_object_data_blinking.length; i++)
        {
            //create object
            const objBlinking = new ParkourPlatformBlinking(i, this.objectShapeDict.getItem("platform_"+platform_object_data_blinking[i].style));
            //add to collection
            this.platformList.addItem(objBlinking);
            this.parkourObjectDict.addItem("platform_blinking_"+platform_object_data_static[i].tag, objBlinking);
            //register to set
            this.RegisterToSet(1, platform_object_data_blinking[i].style, platform_object_data_blinking[i].set, objBlinking);
        }/**/
        if(this.isDebugging) log("generated platforms, count: "+this.platformList.size().toString());
    }

    //loads all traps from config
    public GenerateTraps()
    {
        if(this.isDebugging) log("generating traps...");

        //create style dict
        //  single
        for(var i:number=0; i<trap_data.length; i++)
        {
            this.trapStyleIndex.addItem(trap_data[i].type, i);
        }
        //  multi
        for(var i:number=0; i<trap_data_multi.length; i++)
        {
            this.trapStyleIndex.addItem("multi_"+trap_data_multi[i].type, i);
        }

        //create all traps
        //  single
        for(var i:number=0; i<trap_object_data_static.length; i++)
        {
            //create object
            const obj = new ParkourTrapStatic(i, this.trapStyleIndex.getItem(trap_object_data_static[i].style), this.objectShapeDict.getItem("trap_"+trap_object_data_static[i].style));
            //  collision deathzone
            obj.triggerObj.addComponent(
                new utils.TriggerComponent(
                obj.trigger,
                {
                    onCameraEnter :() => 
                    {
                        //kill player
                        this.PlayerRespawn();
                    }
                }
                )
            );
            //add to collection
            this.trapList.addItem(obj);
            this.parkourObjectDict.addItem("trap_static_"+trap_object_data_static[i].tag, obj);
            //add to set collection
            this.RegisterToSet(2, trap_object_data_static[i].style, trap_object_data_static[i].set, obj);
        }
        //  toggling
        for(var i:number=0; i<trap_object_data_toggling.length; i++)
        {
            //create object
            const obj = new ParkourTrapToggle(i, this.trapStyleIndex.getItem(trap_object_data_toggling[i].style), this.objectShapeDict.getItem("trap_"+trap_object_data_toggling[i].style));
            //  collision deathzone
            obj.triggerObj.addComponent(
                new utils.TriggerComponent(
                obj.trigger,
                {
                    onCameraEnter :() => 
                    {
                        //kill player
                        this.PlayerRespawn();
                    }
                }
                )
            );
            //add to collection
            this.trapList.addItem(obj);
            this.parkourObjectDict.addItem("trap_toggling_"+trap_object_data_toggling[i].tag, obj);
            //add to set collection
            this.RegisterToSet(2, trap_object_data_toggling[i].style, trap_object_data_toggling[i].set, obj);
        }
        //  projectile
        for(var i:number=0; i<trap_data_multi.length; i++)
        {
            //create object
            const obj = new ParkourTrapProjectile
            (
                i, 
                this.trapStyleIndex.getItem("multi_"+trap_object_data_projectile[i].style), 
                this.objectShapeDict.getItem("trap_base_"+trap_object_data_projectile[i].style),
                this.objectShapeDict.getItem("trap_proj_"+trap_object_data_projectile[i].style)
            );
            //  collision deathzone
            obj.triggerObj.addComponent(
                new utils.TriggerComponent(
                obj.trigger,
                {
                    onCameraEnter :() => 
                    {
                        //kill player
                        this.PlayerRespawn();
                    }
                }
                )
            );
            //add to collection
            this.trapList.addItem(obj);
            this.parkourObjectDict.addItem("trap_projectile_"+trap_object_data_projectile[i].tag, obj);
            //add to set collection
            this.RegisterToSet(2, trap_object_data_projectile[i].style, trap_object_data_projectile[i].set, obj);
        }

        if(this.isDebugging) log("generated traps, count: "+this.trapList.size().toString());
    }

    //loads all checkpoints from config
    public GenerateCheckpoints()
    {
        if(this.isDebugging) log("generating checkpoints...");

        //create style dict
        for(var i:number=0; i<checkpoint_data.length; i++)
        {
            this.checkpointStyleIndex.addItem(checkpoint_data[i].type, i);
        }

        //create all checkpoints
        for(var i:number=0; i<checkpoint_object_data.length; i++)
        {
            //create object
            const obj = new ParkourCheckpoint(i, this.checkpointStyleIndex.getItem(checkpoint_object_data[i].style), this.objectShapeDict.getItem("checkpoint_"+checkpoint_object_data[i].style));
            //  collision zone
            obj.triggerObj.addComponent(
                new utils.TriggerComponent(
                obj.trigger,
                {
                    onCameraEnter :() => 
                    {
                        this.SetPlayerRespawn(obj);
                    }
                }
                )
            );
            //add to collection
            this.collectibleList.addItem(obj);
            this.parkourObjectDict.addItem("checkpoint_"+checkpoint_object_data[i].tag, obj);
            //add to set collection
            this.RegisterToSet(3, checkpoint_object_data[i].style, checkpoint_object_data[i].set, obj);
        }

        if(this.isDebugging) log("generated checkpoints, count: "+this.collectibleList.size().toString());
    }

    //creates entity links for parenting between objects
    public GenerateParenting()
    {
        //reparent all platforms
        if(this.isDebugging) log("generating parkour object parents...");

        //  this has to be done after ALL parkour objects have been created
        var objChild;
        var objParent;

        //collectibles
        if(this.isDebugging) log("processing collectible parents...");
        for(var i:number=0; i<collectible_object_data.length; i++)
        {
            objChild = this.parkourObjectDict.getItem("collectible_"+collectible_object_data[i].tag);
            log("collectible_"+collectible_object_data[i].tag)
            //if there is a parenting request to pair this platform with another
            if(collectible_object_data[i].parent.length > 0)
            {
                //grab object and realign parenting
                objParent = this.parkourObjectDict.getItem(collectible_object_data[i].parent);
                objChild.DefineParent(objParent.parentingEntity);
            }
            //set this manager object as the default parent
            else
            {
                objChild.DefineParent(this);
            }
        }

        //platforms
        if(this.isDebugging) log("processing platform parents...");
        //  static platforms
        for(var i:number=0; i<platform_object_data_static.length; i++)
        {
            objChild = this.parkourObjectDict.getItem("platform_static_"+platform_object_data_static[i].tag);
            //if there is a parenting request to pair this platform with another
            if(platform_object_data_static[i].parent.length > 0)
            {
                //grab object and realign parenting
                objParent = this.parkourObjectDict.getItem(platform_object_data_static[i].parent);
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
            objChild = this.parkourObjectDict.getItem("platform_pathing_"+platform_object_data_pathing[i].tag);
            //if there is a parenting request to pair this platform with another
            if(platform_object_data_pathing[i].parent.length > 0)
            {
                //grab object and realign parenting
                objParent = this.parkourObjectDict.getItem(platform_object_data_pathing[i].parent);
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
            objChild = this.parkourObjectDict.getItem("platform_rotating_"+platform_object_data_rotating[i].tag);
            //if there is a parenting request to pair this platform with another
            if(platform_object_data_rotating[i].parent.length > 0)
            {
                //grab object and realign parenting
                objParent = this.parkourObjectDict.getItem(platform_object_data_rotating[i].parent);
                objChild.DefineParent(objParent.parentingEntity);
            }
            //set this manager object as the default parent
            else
            {
                objChild.DefineParent(this);
            }
        }
        //  toggling platforms
        for(var i:number=0; i<platform_object_data_blinking.length; i++)
        {
            objChild = this.parkourObjectDict.getItem("platform_blinking_"+platform_object_data_blinking[i].tag);
            //if there is a parenting request to pair this platform with another
            if(platform_object_data_blinking[i].parent.length > 0)
            {
                //grab object and realign parenting
                objParent = this.parkourObjectDict.getItem(platform_object_data_blinking[i].parent);
                objChild.DefineParent(objParent.parentingEntity);
            }
            //set this manager object as the default parent
            else
            {
                objChild.DefineParent(this);
            }
        }

        //traps
        if(this.isDebugging) log("processing trap parents...");
        for(var i:number=0; i<trap_object_data_static.length; i++)
        {
            objChild = this.parkourObjectDict.getItem("trap_static_"+trap_object_data_static[i].tag);
            //if there is a parenting request to pair this platform with another
            if(trap_object_data_static[i].parent.length > 0)
            {
                //grab object and realign parenting
                objParent = this.parkourObjectDict.getItem(trap_object_data_static[i].parent);
                objChild.DefineParent(objParent.parentingEntity);
            }
            //set this manager object as the default parent
            else
            {
                objChild.DefineParent(this);
            }
        }
        for(var i:number=0; i<trap_object_data_toggling.length; i++)
        {
            objChild = this.parkourObjectDict.getItem("trap_toggling_"+trap_object_data_toggling[i].tag);
            //if there is a parenting request to pair this platform with another
            if(trap_object_data_toggling[i].parent.length > 0)
            {
                //grab object and realign parenting
                objParent = this.parkourObjectDict.getItem(trap_object_data_toggling[i].parent);
                objChild.DefineParent(objParent.parentingEntity);
            }
            //set this manager object as the default parent
            else
            {
                objChild.DefineParent(this);
            }
        }
        for(var i:number=0; i<trap_object_data_projectile.length; i++)
        {
            objChild = this.parkourObjectDict.getItem("trap_projectile_"+trap_object_data_projectile[i].tag);
            //if there is a parenting request to pair this platform with another
            if(trap_object_data_projectile[i].parent.length > 0)
            {
                //grab object and realign parenting
                objParent = this.parkourObjectDict.getItem(trap_object_data_projectile[i].parent);
                objChild.DefineParent(objParent.parentingEntity);
            }
            //set this manager object as the default parent
            else
            {
                objChild.DefineParent(this);
            }
        }

        if(this.isDebugging) log("generated parkour object parents!");
    }

    //deactivates a given set of parkour objects
    public DeactivateSet(set:string)
    {
        if(this.isDebugging) log("deactivating set: "+set);
        
        //ensure set's existance
        if(!this.setObjects.containsKey(set))
        {
            if(this.isDebugging) log("skipped, set \'"+set+"\' does not exist!");
            return;
        }

        //disable all objects
        for(var i:number=0; i<this.setObjects.getItem(set).size(); i++)
        {
            this.setObjects.getItem(set).getItem(i).Deactivate();
        }

        //clear current set
        this.setCur = '';
        if(this.isDebugging) log("deactivated set: "+set);
    }

    //deactivates all objects for current set
    public Deactivate()
    {
        this.DeactivateSet(this.setCur);
    }

    //activates a given set of parkour objects, after deactivating the current set
    //  you can safely send this a nonexistant set to clear the current stage
    public ActivateSet(set:string)
    {
        if(this.isDebugging) log("activating set: "+set+"...");

        //deactivate previous set
        this.Deactivate();
        this.setCur = set;

        //ensure demanded set exists
        if(!this.setObjects.containsKey(this.setCur))
        { 
            if(this.isDebugging) log("ERROR: set "+this.setCur+" does not exist");
            return; 
        }
        if(this.isDebugging) log("set contains "+this.setObjects.getItem(set).size()+" parkour objects)");

        //activate all objects
        for(var i:number=0; i<this.setObjects.getItem(set).size(); i++)
        {
            this.setObjects.getItem(set).getItem(i).ActivateObject();
        }

        //verify all parents
        for(var i:number=0; i<this.setObjects.getItem(set).size(); i++)
        {
            this.setObjects.getItem(set).getItem(i).VerifyParent();
        }

        //activate all systems
        for(var i:number=0; i<this.setObjects.getItem(set).size(); i++)
        {
            this.setObjects.getItem(set).getItem(i).ActivateSystem();
        }


        //change respawn to default
        if(this.respawnDefaults.containsKey(this.setCur))
        {
            if(this.isDebugging) log("default checkpoint has been set");
            this.SetPlayerRespawn(this.respawnDefaults.getItem(this.setCur));

            //enforce player position
            this.PlayerRespawn();
        }
        else
        {
            if(this.isDebugging) log("no default checkpoint exists for set, zeroing to base");
            //  position
            this.respawnPosition.x = 0;
            this.respawnPosition.y = 1;
            this.respawnPosition.z = 0;
            //  look-at
            this.respawnLook.x = 24;
            this.respawnLook.y = 6;
            this.respawnLook.z = 1;
        }

        //reset gather HUD
        this.MenuCollectibleReset();

        if(this.isDebugging) log("set "+this.setCur+" activated");
    }

    //sets the player's respawn based on the given checkpoint data index
    public SetPlayerRespawn(checkpoint:ParkourCheckpoint)
    {
        if(this.isDebugging) log('checkpoint reached!');
        //  position
        var pos = checkpoint_data[checkpoint.styleIndex].offset.split('_');
        this.respawnPosition.x = (+pos[0]) + checkpoint.getComponent(Transform).position.x;
        this.respawnPosition.y = (+pos[1]) + checkpoint.getComponent(Transform).position.y;
        this.respawnPosition.z = (+pos[2]) + checkpoint.getComponent(Transform).position.z;
        //  look-at
        var look = checkpoint_object_data[checkpoint.defIndex].look.split('_');
        this.respawnLook.x = +look[0];
        this.respawnLook.y = +look[1];
        this.respawnLook.z = +look[2];
        if(this.isDebugging) log('new respawn location: '+this.respawnPosition.toString());
    }

    //moves the player to the location of the currently active checkpoint
    public PlayerRespawn()
    {
        if(this.isDebugging) log('player respawned!');
        movePlayerTo(this.respawnPosition, this.respawnLook);
    }
}
//used to represent the total number of parkour collectibles in-zone
//  might be used later to allow additional settings for collectibles in each set
//  such as amounts to reach for the stage to be considered clear
class ParkourVal
{
    value:number;

    constructor()
    {
        this.value = 0;
    }
}