/*      MENU GROUP 3D
    used to create a 2d menu group in the game scene. menu objects can be created and 
    organized through an instance of this manager. also creates a 3d object to act as
    the activator for the menu.

    the menu group and toggle button are placed as parents of the object given, all
    menu objects are parented onto the menu group, and all text shape entities are
    parented to those menu objects.
*/
import { List, Dictionary } from "collections";
@Component("MenuGroup2D")
export class MenuGroup2D extends Entity
{
    //parental draw canvas
    private canvas:UICanvas = new UICanvas();
    //action object used to toggle main menu object
    private menuToggleState:number = 0;
    //private menuToggle:Entity = new Entity();
    //action ui button used to close menu
    private menuClose:UIImage|undefined;
    //collections for entity access
    private menuList:List<MenuObject2D>;
    private menuDict:Dictionary<MenuObject2D>;

    //constructor, takes in an entity that will be used when parenting
    constructor(parent:Entity)
    {
        super();

        //add transform
        this.setParent(parent);
        this.addComponent(new Transform
        ({
            position: new Vector3(0,0,0),
            scale: new Vector3(1,1,1),
            rotation: new Quaternion().setEuler(0,0,0)
        }));

        //set up menu toggle
        /*this.menuToggle.setParent(parent);
        this.menuToggle.addComponent(new GLTFShape("models/utilities/menuObjSettingsAbout.glb"));
        this.menuToggle.addComponent(new Transform
        ({
            position: new Vector3(0,0,0),
            scale: new Vector3(1,1,1),
            rotation: new Quaternion().setEuler(0,180,0)
        }));
        //  primary action: toggle
        this.menuToggle.addComponent
        (
            //add click action listener
            new OnPointerDown
            (
                (e) =>
                {
                    if (e.buttonId == 1) { this.SetMenuState(0); }
                },
                {
                    button: ActionButton.ANY,
                    showFeedback: true,
                    hoverText: "[E] Toggle Info",
                    distance: 8
                }
            )
        );*/
        this.canvas.visible = false;

        //initialize collections
        this.menuList = new List<MenuObject2D>();
        this.menuDict = new Dictionary<MenuObject2D>();
    }

    //prepares the close button
    //  parenting and arrangement of ui objects appears limited atm, so
    //  we just create the close button after all other objects to ensure it
    //  is not blocked.
    public PrepareMenuClose()
    {
        //object
        this.menuClose = new UIImage(this.canvas, new Texture("src/textures/icon_close.png"));
        this.menuClose.width = 60;
        this.menuClose.height = 60;
        this.menuClose.positionX = 390;
        this.menuClose.positionY = 20;
        this.menuClose.hAlign = "center";
        this.menuClose.vAlign = "top";
        //actions
        this.menuClose.onClick =new OnClick
        (
            (e) => 
            {
                this.SetMenuState(1);
            }
        )

    }

    //toggles the current menu state
    public ToggleMenuState()
    {
        if(this.menuToggleState == 0) this.SetMenuState(1);
        else this.SetMenuState(0);
    }

    //sets the state of the primary menu tree
    public SetMenuState(state:number)
    {
        //enable menu
        if(state == 0)
        {
            this.canvas.visible = true;
        }
        //disable menu
        else
        {
            this.canvas.visible = false;
        }
        this.menuToggleState = state;
    }

    //menu toggle object
    //  type: 0->position, 1->scale, 2->rotation
    public AdjustMenuToggle(type:number, vect:Vector3)
    {
        switch(type)
        {
            case 0:
                //this.menuToggle.getComponent(Transform).position = vect;
            break;
            case 1:
                //this.menuToggle.getComponent(Transform).scale = vect;
            break;
            case 2:
                //this.menuToggle.getComponent(Transform).rotation = new Quaternion(vect.x, vect.y, vect.z);
            break;
        }
    }

    //prepares a menu object of the given size/shape, with the given text, 
    //  registered under the given name
    public AddMenuObject(name:string, par:string='')
    {
        //create and prepare entities
        var tmp:MenuObject2D;
        if(par != '') tmp = new MenuObject2D(this.canvas, name, this.menuDict.getItem(par).rect);
        else tmp = new MenuObject2D(this.canvas, name);

        //register object to collections
        this.menuList.addItem(tmp);
        this.menuDict.addItem(name, tmp);
    }

    //returns the requested menu object
    public GetMenuObject(objName:string):MenuObject2D
    {
        return this.menuDict.getItem(objName);
    }

    //returns the requested menu object
    public GetMenuObjectText(objName:string, textName:string):UIText
    {
        return this.menuDict.getItem(objName).GetText(textName);
    }

    //changes a targeted menu object
    //  type: 
    //  0->position
    //  1->size(x=width,y=height)
    //  2->alignment(x=hAlign,y=vAligh)
    //      result,x: 0=left,1=center,2=right
    //      result,y: 0=top,1=center,2=bottom
    public AdjustMenuObject(name:string, type:number, vect:Vector2)
    {
        switch(type)
        {
            case 0:
                this.menuDict.getItem(name).rect.positionX = vect.x;
                this.menuDict.getItem(name).rect.positionY = vect.y;
            break;
            case 1:
                this.menuDict.getItem(name).rect.width = vect.x;
                this.menuDict.getItem(name).rect.height = vect.y;
            break;
            case 2:
                switch(Math.floor(vect.x))
                {
                    case 0: this.menuDict.getItem(name).rect.hAlign = "left"; break;
                    case 1: this.menuDict.getItem(name).rect.hAlign = "center"; break;
                    case 2: this.menuDict.getItem(name).rect.hAlign = "right"; break;
                }
                switch(Math.floor(vect.y))
                {
                    case 0: this.menuDict.getItem(name).rect.vAlign = "top"; break;
                    case 1: this.menuDict.getItem(name).rect.vAlign = "center"; break;
                    case 2: this.menuDict.getItem(name).rect.vAlign = "bottom"; break;
                }
            break;
        }
    }
    //changes a targeted menu object's colour
    public AdjustMenuColour(name:string, colour:Color4)
    {
        this.menuDict.getItem(name).rect.color = colour;
    }

    //prepares a menu object of the given size/shape, with the given text, 
    //  registered under the given name
    public AddMenuText(nameObj:string, nameTxt:string, text:string)
    {
        this.menuDict.getItem(nameObj).AddText(nameTxt, text);
    }

    //sets a text object's display text
    public SetMenuText(nameObj:string, nameTxt:string, text:string)
    {
        this.menuDict.getItem(nameObj).ChangeText(nameTxt, text);
    }

    //changes a text object's textshape settings
    public AdjustTextObject(nameObj:string, nameTxt:string, type:number, value:Vector2)
    {
        this.menuDict.getItem(nameObj).AdjustText(nameTxt, type, value);
    }

    //changes a text object's textshape settings
    public AdjustTextDisplay(nameObj:string, nameTxt:string, type:number, value:number)
    {
        this.menuDict.getItem(nameObj).AdjustTextDisplay(nameTxt, type, value);
    }
}

//modified 2d ui rect container
//can contain multiple ui text objects
@Component("MenuObject2D")
export class MenuObject2D
{
    //access key
    public Name:string;

    //collection of all rect entities
    rect:UIContainerRect;
    //collections of all text entities
    textList:List<UIText>;
    textDict:Dictionary<UIText>;

    //constructor
    constructor(canvas:UICanvas, nam:string, par:UIShape|undefined=undefined)
    {
        if(par == undefined) this.rect = new UIContainerRect(canvas);
        else this.rect = new UIContainerRect(par);
        this.rect.color = new Color4(0.5, 0.5, 0.5, 1);

        //set access name
        this.Name = nam;

        //collections
        this.textList = new List<UIText>();
        this.textDict = new Dictionary<UIText>();
    }

    public GetText(name:string):UIText
    {
        return this.textDict.getItem(name);
    }

    //prepares a text object with the given text, 
    //  registered under the given name
    public AddText(name:string, text:string)
    {
        //create and prepare text
        var tmp:UIText = new UIText(this.rect);
        tmp.textWrapping = true;
        tmp.width = this.rect.width;
        tmp.height = this.rect.height;
        tmp.color = Color4.Black();
        tmp.hAlign = "center";
        tmp.vAlign = "center";
        tmp.hTextAlign = "center";
        tmp.vTextAlign = "center";
        tmp.fontSize = 24;
        tmp.value = text;
        //register object to collections
        this.textList.addItem(tmp);
        this.textDict.addItem(name, tmp);
    }

    //changes a targeted text object entity
    //  type: 
    //  0->position
    //  1->size(x=width,y=height)
    //  2->alignment(x=hAlign,y=vAligh)
    //      result,x: 0=left,1=center,2=right
    //      result,y: 0=top,1=center,2=bottom
    public AdjustText(name:string, type:number, vect:Vector2)
    {
        switch(type)
        {
            case 0:
                this.textDict.getItem(name).positionX = vect.x;
                this.textDict.getItem(name).positionY = vect.y;
            break;
            case 1:
                this.textDict.getItem(name).width = vect.x;
                this.textDict.getItem(name).height = vect.y;
            break;
            case 2:
                switch(Math.floor(vect.x))
                {
                    case 0: this.textDict.getItem(name).hAlign = "left"; break;
                    case 1: this.textDict.getItem(name).hAlign = "center"; break;
                    case 2: this.textDict.getItem(name).hAlign = "right"; break;
                }
                switch(Math.floor(vect.y))
                {
                    case 0: this.textDict.getItem(name).vAlign = "top"; break;
                    case 1: this.textDict.getItem(name).vAlign = "center"; break;
                    case 2: this.textDict.getItem(name).vAlign = "bottom"; break;
                }
            break;
            case 3:
                switch(Math.floor(vect.x))
                {
                    case 0: this.textDict.getItem(name).hTextAlign = "left"; break;
                    case 1: this.textDict.getItem(name).hTextAlign = "center"; break;
                    case 2: this.textDict.getItem(name).hTextAlign = "right"; break;
                }
                switch(Math.floor(vect.y))
                {
                    case 0: this.textDict.getItem(name).vTextAlign = "top"; break;
                    case 1: this.textDict.getItem(name).vTextAlign = "center"; break;
                    case 2: this.textDict.getItem(name).vTextAlign = "bottom"; break;
                }
            break;
        }
    }
    //changes a targeted menu object entity
    //  type: 0->font size
    public AdjustTextDisplay(name:string, type:number, value:number)
    {
        switch(type)
        {
            case 0:
                this.textDict.getItem(name).fontSize = value;
            break;
        }
    }

    //changes the text of a targeted textshape
    public ChangeText(name:string, text:string)
    {
        this.textDict.getItem(name).value = text;
    }
}