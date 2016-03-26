package pulsar.ecs;

import haxe.ds.ObjectMap;
import pulsar.ecs.EventBus;

class Entity
{
    // TODO: add method to receive an event and call a function
    
    // Haxe doesn't seem to allow compiling with Class<Component> as the key.
    // Ditto for a Map<Dynamic, Component>.
    // If that ever changes, turn this into a right proper Map<Class<Component>, Component>
    private var componentMap:ObjectMap<Dynamic, Component> = new ObjectMap<Dynamic, Component>();
    // Events are a string key; the callback takes a single dynamic param as input.
    private var eventHandlers:Map<String, Dynamic -> Void> = new Map<String, Dynamic -> Void>();

    public function new()
    {
        EventBus.getInstance().add(this);
    }
    
    public function add(component:Component):Entity
    {
        var key = Type.getClass(component);
        this.componentMap.set(key, component);
        return this; // for chaining calls
    }
    
    public function get(type:Class<Component>):Dynamic
    {
        return this.componentMap.get(type);
    }
    
    public function onEvent(eventName:String, callback:Dynamic -> Void)
    {
        this.eventHandlers.set(eventName, callback);
        return this; // for chaining calls
    }
    
    // Called by the event bus when a component sends a message
    public function receiveEvent(event:String, data:Dynamic)
    {
        if (this.eventHandlers.exists(event))
        {
            var callback = this.eventHandlers.get(event);
            callback(data);
        }
    }
}