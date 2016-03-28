package pulsar.ecs;

import haxe.ds.ObjectMap;
import pulsar.ecs.EventBus;

class Entity
{
    // Haxe doesn't seem to allow compiling with Class<Component> as the key.
    // Ditto for a Map<Dynamic, Component>. Using haxe.ds.ObjectMap is shady (generates weak-references
    // in dynamic languages, and Dynamic has a definite runtime cost.) Let's go with the simpler approach
    // of keeping components in an array. Lookup is O(n), but n is relatively small per entity, and the
    // number of entities in total is also quite small. If performance suffers, try something different,
    // like having the rendering system look up the SpriteComponent once, and keep a reference.
    private var components:Array<Component> = new Array<Component>();
    // Events are a string key; the callback takes a single dynamic param as input.
    private var eventHandlers:Map<String, Dynamic -> Void> = new Map<String, Dynamic -> Void>();

    public function new()
    {
        EventBus.getInstance().add(this);
    }
    
    /**
    Adds a component to this entity. Throws if there's already a component of
    that type in this entity.
    */
    public function add(component:Component):Entity
    {
        if (this.has(Type.getClass(component)))
        {
            throw 'Entity already has a component of the same type as ${component}';
        }
        
        this.components.push(component);
        return this; // for chaining calls
    }
    
    /** Gets the component of an entity, eg. entity.get(SpriteComponent)
    Throws if there's no component of that type.
    */
    public function get(clazz:Class<Component>):Dynamic
    {
        for (component in this.components)
        {
            if (Type.getClass(component) == clazz)
            {
                return component;
            }
        }
        
        throw 'Entity ${this} doesn\'t have a component of type ${clazz}';
    }
    
    /**
    Check if a component of the specified type exists.
    */
    public function has(clazz:Class<Component>):Bool
    {
        for (component in this.components)
        {
            if (Type.getClass(component) == clazz)
            {
                return true;
            }
        }
        
        return false;    
        
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