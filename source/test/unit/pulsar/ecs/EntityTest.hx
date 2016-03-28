package unit.pulsar.ecs;

import massive.munit.Assert;
import pulsar.ecs.Component;
import pulsar.ecs.Entity;
import pulsar.ecs.EventBus;

import test.Assert2;

@:access(pulsar.ecs.EventBus)
class EntityTest
{
    @Test
    public function getGetsComponentAddedByAdd()
    {
        var e:Entity = new Entity();
        var expected = new StringComponent("test value");
        e.add(expected);
        var actual:StringComponent = e.get(StringComponent);

        Assert.areEqual(expected, actual);
        Assert.areEqual("test value", actual.value);
    }    
    
    @Test
    public function getThrowsIfComponentIsntAdded()
    {
        var e = new Entity();
        var message:String = Assert2.throws(function()
        {
            e.get(StringComponent);
        });
        
        Assert.isTrue(message.indexOf("doesn't have") > -1);
    }
    
    @Test
    public function hasReturnsTrueIfComponentWasAdded()
    {
        var e:Entity = new Entity();
        e.add(new StringComponent("exists!"));
        Assert.isTrue(e.has(StringComponent));
    }
    
    @Test
    public function hasReturnsFalseIfComponentWasntAdded()
    {
        var e:Entity = new Entity();
        e.add(new StringComponent("string"));
        Assert.isFalse(new Entity().has(IntComponent));
    }
    
    @Test
    public function addThrowsIfComponentIsAlreadyAdded()
    {
        var e:Entity = new Entity();
        e.add(new StringComponent("doesn't throw"));
        
        var message:String = Assert2.throws(function()
        {
            e.add(new StringComponent("throws"));
        });
        
        Assert.isTrue(message.indexOf('already has a component') > -1);
    }
    
    @Test
    public function constructorAddsEntityToEventBus()
    {
        var bus:EventBus = EventBus.getInstance();
        var e = new Entity();
        Assert.isTrue(bus.entities.indexOf(e) > -1);
    }
    
    // Mostly a duplicate of the EventBus broadcast test
    @Test
    public function receiveEventExecutesHandlerIfEventNameMatches()
    {
        var e = new Entity();
        var count:Int = 0;
        var event:String = "+1";
        var expectedCount:Int = 5;
        
        e.onEvent(event, function(data)
        {
            count += data;
        });
        
        e.receiveEvent(event, expectedCount);
        e.receiveEvent("log", 10);
        
        Assert.areEqual(expectedCount, count);
    }
}

// Dummy components for testing

class StringComponent extends Component {
    public var value(default, null):String;
    
    public function new(value:String)
    {
        super();
        this.value = value;
    }
}

class IntComponent extends Component {
    public var value(default, null):Int;
    
    public function new(value:Int)
    {
        super();
        this.value  = value;
    }
}