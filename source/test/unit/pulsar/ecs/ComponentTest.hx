package unit.pulsar.ecs;

import massive.munit.Assert;
import pulsar.ecs.Component;
import pulsar.ecs.EventBus;

class ComponentTest
{
    @Test
    public function broadcastSendsEventToEventBus()
    {
        var c = new Component();
        var event:String = "fish died";
        c.broadcast(event, {});
        Assert.areEqual(event, EventBus.getInstance().lastEvent);
    }
}