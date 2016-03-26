package pulsar.ecs;

import pulsar.ecs.EventBus;

class Component
{
    public function new()
    {
        
    }
    
    // Sends this message to all entities
    public function broadcast(event:String, data:Dynamic)
    {
        EventBus.getInstance().broadcast(event, data);
    }
}