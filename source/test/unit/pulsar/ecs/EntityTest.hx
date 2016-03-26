package unit.pulsar.ecs;

import massive.munit.Assert;
import pulsar.ecs.Component;
import pulsar.ecs.Entity;

class EntityTest
{
    @Test
    public function getGetsSetComponent()
    {
        var e:Entity = new Entity();
        var expected = new StringComponent("hi");
        e.add(expected);
        var actual:StringComponent = e.get(StringComponent);

        Assert.areEqual(expected, actual);
        Assert.areEqual("hi", actual.value);
    }
    
    @Test
    public function getGetsLastSetComponent()
    {
        
    }
}

class StringComponent extends Component {
    
    public var value(default, null):String;
    
    public function new(value:String) {
        this.value = value;
    }
}
