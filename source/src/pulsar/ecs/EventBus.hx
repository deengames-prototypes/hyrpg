package pulsar.ecs;

import pulsar.ecs.Entity;

// Static is evil. Singleton is evil. There's no easy way around this, because
// events have to go to all entities, not just the parent of the component.
// We keep a reference to the last instance so you can "reset" it for testing.
class EventBus
{
    public var lastEvent:String = ""; // Not used outside of testing.
    private var entities:Array<Entity> = new Array<Entity>();
    
    private static var instance:EventBus = new EventBus();
    
    public static function getInstance():EventBus
    {
        return instance;
    }
    
    public function new()
    {
        instance = this;
    }
    
    public function add(e:Entity):Void
    {
        this.entities.push(e);
    }
    
    // Use this to send a message to all entities.
    public function broadcast(event:String, data:Dynamic)
    {
        lastEvent = event;
        
        for (entity in this.entities)
        {
            entity.receiveEvent(event, data);
        }
    }
    
    // For testing
    public function has(e:Entity):Bool
    {
        return this.entities.indexOf(e) > -1;
    }
}