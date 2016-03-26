package deengames.hyrpg.state;

import flixel.FlxG;
import flixel.FlxSprite;
import flixel.FlxState;
import flixel.text.FlxText;
import flixel.ui.FlxButton;
import flixel.util.FlxColor;
import flixel.input.keyboard.FlxKeyList;

class TitleScreenState extends FlxState
{
	/**
	 * Function that is called up when to state is created to set it up.
	 */
	override public function create():Void
	{
        var text:FlxText = new FlxText(0, 0, 0, 'Ibn Battah\'s Adventures');
		text.setFormat('assets/fonts/OpenSans-Regular.ttf', 72, FlxColor.WHITE);
		add(text);
		text.x = (FlxG.width - text.width) / 2;
		text.y = (FlxG.height - text.height) / 2;

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
		if (FlxG.keys.firstJustPressed() > -1 || FlxG.mouse.justPressed)
        {
			FlxG.camera.fade(FlxColor.BLACK, 0.5, false, createGame);
		}
	}

	private function createGame() : Void
	{
		FlxG.switchState(new deengames.hyrpg.state.CreateGameState());
	}
}
