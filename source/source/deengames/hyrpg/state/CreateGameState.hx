package deengames.hyrpg.state;

import flixel.FlxG;
import flixel.FlxSprite;
import flixel.FlxState;
import flixel.text.FlxText;
import flixel.ui.FlxButton;
import flixel.util.FlxColor;
import flixel.input.keyboard.FlxKeyboard;
/**
 * A FlxState which can be used for the game's menu.
 */
class CreateGameState extends FlxState
{    
    private static var MAX_SEED:Int = 1000000000; // 1B
	/**
	 * Function that is called up when to state is created to set it up.
	 */
	override public function create():Void
	{
		Reg.worldSeed = Std.random(MAX_SEED);
		var text:FlxText = new FlxText(0, 0, 0, 'World Universe #${Reg.worldSeed}');
		text.setFormat('assets/fonts/OpenSans-Regular.ttf', 72, FlxColor.WHITE);
		add(text);
		text.x = (FlxG.width - text.width) / 4;
		text.y = (FlxG.height - text.height) / 3;

		super.create();
	}

	/**
	 * Function that is called when this state is destroyed - you might want to
	 * consider setting all objects this state uses to null to help garbage collection.
	 */
	override public function destroy():Void
	{
		super.destroy();
	}

	/**
	 * Function that is called once every frame.
	 */
	override public function update(elapsed:Float):Void
	{
		super.update(elapsed);
        // Any key pressed or mouse clicked
		if (FlxG.keys.firstJustPressed() > -1 || FlxG.mouse.justPressed)
        {
			FlxG.switchState(new LocationMapState());
		}
	}
}
