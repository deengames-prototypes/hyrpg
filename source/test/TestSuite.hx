import massive.munit.TestSuite;

import unit.pulsar.ecs.EntityTest;
import unit.pulsar.ecs.ComponentTest;
import unit.pulsar.ecs.EventBusTest;

/**
 * Auto generated Test Suite for MassiveUnit.
 * Refer to munit command line tool for more information (haxelib run munit)
 */

class TestSuite extends massive.munit.TestSuite
{		

	public function new()
	{
		super();

		add(unit.pulsar.ecs.EntityTest);
		add(unit.pulsar.ecs.ComponentTest);
		add(unit.pulsar.ecs.EventBusTest);
	}
}
