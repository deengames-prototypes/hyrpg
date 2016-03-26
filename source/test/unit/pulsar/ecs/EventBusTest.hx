package unit.pulsar.ecs;

import massive.munit.Assert;
import pulsar.ecs.Entity;
import pulsar.ecs.EventBus;

class EventBusTest
{
    @Test
    public function broadcastSendsEventToAllEntitiesWithHandler()
    {
        var e1:Entity = new Entity();
        var e2:Entity = new Entity();
        
        var count:Int = 0;
        var event:String = "increment";
        var incFunction = function(data)
        {
           count += 1;
        }
        
        e1.onEvent(event, incFunction);
        e2.onEvent(event, incFunction);
        
        new Entity().onEvent("different event", incFunction); // shouldn't fire
        
        EventBus.getInstance().broadcast(event, null);
        
        Assert.areEqual(2, count);
    }
}