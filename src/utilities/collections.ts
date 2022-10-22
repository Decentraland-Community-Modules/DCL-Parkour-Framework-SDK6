 //additions to allow collections for set management,
 // lists and dictionaries
 //raw source: Dominik Marciniszyn, codetain.com
 export interface IKeyCollection<T>
 {
     size(): number;
     getKeys(): string[];
     containsKey(key: string): boolean;
     addItem(key: string, value: T): undefined;
     getItem(key: string): T;
     removeItem(key: string): T;
     values(): T[];
 }
 export class List<T> {
     private items: Array<T>;
 
     constructor() {
         this.items = [];
     }
 
     size(): number {
         return this.items.length;
     }
 
     addItem(value: T): void {
         this.items.push(value);
     }
 
     getItem(index: number): T {
         return this.items[index];
     }
 
     //assigns the given <e> instance to targeted position in array
     assignItem(pos:number, instance:T)
     {
        this.items[pos] = instance;
     }

     //removes the selected element from the list, maintaining the order of elements
     removeItem(value: T): void {
        //shift selected element to last spot in array
        var i:number = 0;
        var tmp:T;
        while(i < this.items.length)
        {
            //if end of list
            if(i == this.items.length-1)
            {
                this.items.pop();
                return;
            }

            //if item is found
            if(this.items[i] == value)
            {
                //swap targeted element with next element in list
                tmp = this.items[i];
                this.items[i] = this.items[i+1];
                this.items[i+1] = tmp;
            }
            //force next case
            i++;
        }
    }
 }
 export { Dictionary };
 export default class Dictionary<T> implements IKeyCollection<T> 
 {
     private items: { [index: string]: T } = {};
     private count: number = 0;
 
     size(): number {
         return this.count;
     }
 
     getKeys(): string[] {
         let keySet: string[] = [];
 
         for (let property in this.items) {
             if (this.items.hasOwnProperty(property)) {
                 keySet.push(property);
             }
         }
 
         return keySet;
     }
 
     containsKey(key: string): boolean {
         return this.items.hasOwnProperty(key);
     }
 
     addItem(key: string, value: T): undefined {
         if (!this.items.hasOwnProperty(key)) {
             this.count++;
         }
 
         this.items[key] = value;
         return;
     }
 
     getItem(key: string): T {
         return this.items[key];
     }
 
     removeItem(key: string): T {
         let value = this.items[key];
 
         delete this.items[key];
         this.count--;
 
         return value;
     }
 
     values(): T[] {
         let values: T[] = [];
 
         for (let property in this.items) {
             if (this.items.hasOwnProperty(property)) {
                 values.push(this.items[property]);
             }
         }
 
         return values;
     }
 }