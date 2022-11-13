/*      PARKOUR OBJECT
    base class just by every object controlled by the parkour manager,
    includes all features required by the system.

    Author: Alex Pazder, thecryptotrader69@gmail.com
*/
export class ParkourObject extends Entity 
{
    //entity targeted for parenting another system to this object
    public parentingEntity:Entity;
    //entity this object will be parented to when activated
    public parentedEntity:Entity;
    //entity's system component
    public system:ISystem|undefined;

    //constructor
    //  takes in transform data from any inheriting class
    constructor(position:string, scale:string, rotation:string)
    {
        super();

        //assign default entity identities
        this.parentingEntity = this;
        this.parentedEntity = this;

        //  set position and scale
        var pos = position.split('_');
        var sca = scale.split('_');
        var rot = rotation.split('_');
        this.addComponent(new Transform
        ({
            position: new Vector3(+pos[0],+pos[1],+pos[2]),
            scale: new Vector3(+sca[0],+sca[1],+sca[2]),
            rotation: new Quaternion().setEuler(+rot[0],+rot[1],+rot[2])
        }));
    }

    //redefines the object's current parent entity
    public DefineParent(par:Entity)
    {
        this.parentedEntity = par;
    }

    //adds this object to the scene
    public ActivateObject() 
    { 
        if(!this.isAddedToEngine()) engine.addEntity(this); 
    }
    //attempts to parent this object to its designated parent, if that object is added to the engine
    public VerifyParent() 
    {
        //if parent object is not in engine
        if(!this.parentedEntity.isAddedToEngine())
        {
            this.Deactivate();
            return;
        }
        //if entity requires parenting
        if(this.parentedEntity != this)
        {
            this.setParent(this.parentedEntity);
        }
    }

    //attempts to activate attached system
    public ActivateSystem() 
    {
        if(this.system != undefined) engine.addSystem(this.system); 
    }

    //removes this object and system from the scene
    public Deactivate() 
    {
        if(this.isAddedToEngine())
        {
            //attempt system removal
            if(this.system != undefined) engine.removeSystem(this.system);

            //remove entity
            this.setParent(null);
            engine.removeEntity(this);
        }
    }
}