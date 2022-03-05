/*      STYLE DICT
    used as a sorting reference for all imported styles.
*/
import { Dictionary, List } from "./dict"
import { data_platform_styles } from "./cmPlatformStyleData";
export class cmParkourStyleDict
{
    public static INSTANCE:cmParkourStyleDict;
    
    //access for platform entities
    public StyleDict:Dictionary<string>;

    constructor()
    {
        //set instance
        cmParkourStyleDict.INSTANCE = this;

        //process all styles
        this.StyleDict = new Dictionary<string>();
        for(var i:number=0; i<data_platform_styles.length; i++)
        {
            //add all platforms for style to collection
            this.StyleDict.add("static_"+data_platform_styles[i].type, data_platform_styles[i].platform_static);
            this.StyleDict.add("pathing_"+data_platform_styles[i].type, data_platform_styles[i].platform_pathing);
            this.StyleDict.add("rotating_"+data_platform_styles[i].type, data_platform_styles[i].platform_rotating);
            this.StyleDict.add("blinking_"+data_platform_styles[i].type, data_platform_styles[i].platform_blinking);
        }
    }
}