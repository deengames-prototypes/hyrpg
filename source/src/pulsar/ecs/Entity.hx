package pulsar.ecs;

class Entity
{
    // TODO: add method to receive an event and call a function
    
    // I don't have enough understanding on the type system and reflection to make this work
    // with types. For now, the key is just the class name, and the type is dynamic.
    //private var components = new Map<Class<Component>, Component>();
    private var components = new Array<Component>();
    private var types = new Array<Class<Component>>();
    
    public function new()
    {
        
    }
    
    public function add(component:Component):Entity
    {
        var key = Type.getClass(component);
        //this.components.set(key, component);
        this.components.push(component);
        this.types.push(key);
        return this; // for chaining calls
    }
    
    public function get(type:Class<Component>):Dynamic
    {
        //return this.get(type);
        var i:Int = 0;
        for (t in types)
        {
            if (t == type)
            {
                return this.components[i];
            }
            i++;
        }
        
        return null;
    }
}