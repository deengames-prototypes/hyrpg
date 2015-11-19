package deengames.swordofeman.state;

import flixel.FlxG;
import flixel.FlxSprite;
import flixel.FlxState;
import flixel.text.FlxText;
import flixel.ui.FlxButton;
import flixel.util.FlxMath;
import flixel.util.FlxColor;
import flixel.plugin.MouseEventManager;
/**
 * A FlxState which can be used for the game's menu.
 */
class TitleScreenState extends FlxState
{
	/**
	 * Function that is called up when to state is created to set it up.
	 */
	override public function create():Void
	{
    var sprite:FlxSprite = new FlxSprite(0, 0, 'assets/images/ui/title.png');
    add(sprite);
    sprite.x  = (FlxG.width - sprite.width) / 2;
    sprite.y = (FlxG.height - sprite.height) / 2;
		super.create();

		MouseEventManager.add(sprite, null, fadeOut);
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
	override public function update():Void
	{
		super.update();
	}

	private function fadeOut(sprite:FlxSprite) : Void
	{
		FlxG.camera.fade(FlxColor.BLACK, 0.5, false, createGame);
	}

	private function createGame() : Void
	{
		FlxG.switchState(new deenGames.swordOfEman.state.CreateGameState());
	}
}
