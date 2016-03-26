package pulsar.ecs;

import haxe.ds.ObjectMap;

class Entity
{
    // TODO: add method to receive an event and call a function
    
    // Haxe doesn't seem to allow compiling with Class<Component> as the key.
    // Ditto for a Map<Dynamic, Component>.
    // If that ever changes, turn this into a right proper Map<Class<Component>, Component>
    private var map = new ObjectMap<Dynamic, Component>();

    public function new() { }
    
    public function add(component:Component):Entity
    {
        var key = Type.getClass(component);
        this.map.set(key, component);
        return this; // for chaining calls
    }
    
    public function get(type:Class<Component>):Dynamic
    {
        return this.map.get(type);
    }
}