package unit.pulsar.ecs;

import massive.munit.Assert;
import pulsar.ecs.Component;
import pulsar.ecs.Entity;
import pulsar.ecs.EventBus;

class EntityTest
{
    @Test
    public function getGetsComponentAdded()
    {
        var e:Entity = new Entity();
        var expected = new StringComponent("test value");
        e.add(expected);
        var actual:StringComponent = e.get(StringComponent);

        Assert.areEqual(expected, actual);
        Assert.areEqual("test value", actual.value);
    }
    
    @Test
    public function getGetsLastComponentAddedOfThatType()
    {
        var e:Entity = new Entity();
        var expected = new StringComponent("correct value");
        
        e.add(new StringComponent("wrong value"));
        e.add(expected);
        e.add(new IntComponent(37));
        
        var actual:StringComponent = e.get(StringComponent);

        Assert.areEqual(expected, actual);
        Assert.areEqual("correct value", actual.value);
        
        Assert.areEqual(37, e.get(IntComponent).value);
    }
    
    @Test
    public function constructorAddsEntityToEventBus()
    {
        var bus:EventBus = EventBus.getInstance();
        var e = new Entity();
        Assert.isTrue(bus.has(e));
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