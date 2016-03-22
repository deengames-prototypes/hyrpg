package deengames.hyrpg.state;

import flixel.FlxG;
import flixel.FlxSprite;
import flixel.FlxState;
import flixel.text.FlxText;
import flixel.ui.FlxButton;
import flixel.util.FlxColor;

class LocationMapState extends FlxState
{
	private static inline var TILE_WIDTH = 32;
	private static inline var TILE_HEIGHT = 32;

	private static inline var MAP_WIDTH = 1024;
	private static inline var MAP_HEIGHT = 576;

	// TODO: derp?
	private static inline var TILE_GRASS = 0;
	private static inline var TILE_WALL = 1;

	private static inline var PLAYER_SPRITE_FPS = 8;
	private static inline var PLAYER_SPEED = 250;

	private var player:FlxSprite = new FlxSprite();

	/**
	 * Function that is called up when to state is created to set it up.
	 */
	override public function create():Void
	{
		var horizontalTiles:Int = Math.ceil(MAP_WIDTH / TILE_WIDTH);
		var verticalTiles:Int = Math.ceil(MAP_HEIGHT / TILE_HEIGHT);

		for (y in 0 ... verticalTiles) {
			for (x in 0 ... horizontalTiles) {
				var tile:FlxSprite = new FlxSprite();
				tile.loadGraphic("assets/images/map/outside.png", true, 32, 32);
				tile.x = x * TILE_WIDTH;
				tile.y = y * TILE_HEIGHT;
				var tileType:Int = TILE_GRASS;

				if (x == 0 || x == horizontalTiles - 1 || y == 0 || y == verticalTiles - 1) {
					tileType = TILE_WALL;
				}

				tile.animation.frameIndex = tileType;
				add(tile);
			}
		}

		player.loadGraphic("assets/images/map/hero.png", true, 32, 32);
		player.animation.add('down', [0, 1, 2, 1], PLAYER_SPRITE_FPS, true);
		player.animation.add('left', [3, 4, 5, 4], PLAYER_SPRITE_FPS, true);
		player.animation.add('right', [6, 7, 8, 7], PLAYER_SPRITE_FPS, true);
		player.animation.add('up', [9, 10, 11, 10], PLAYER_SPRITE_FPS, true);
		player.animation.play('loop');
		player.x = FlxG.width / 2;
		player.y = FlxG.height / 2;
		player.animation.play('down');
		add(player);

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
		var anythingPressed:Bool = false;

		if (FlxG.keys.pressed.UP)
		{
			player.velocity.set(player.velocity.x, -PLAYER_SPEED);
			anythingPressed = true;
			player.animation.play('up');
		}
		else if (FlxG.keys.pressed.DOWN)
		{
			player.velocity.set(player.velocity.x, PLAYER_SPEED);
			anythingPressed = true;
			player.animation.play('down');
		} else {
			player.velocity.set(player.velocity.x, 0);
		}

		if (FlxG.keys.pressed.LEFT)
		{
			player.velocity.set(-PLAYER_SPEED, player.velocity.y);
			anythingPressed = true;
			player.animation.play('left');
		}
		else if (FlxG.keys.pressed.RIGHT)
		{
			player.velocity.set(PLAYER_SPEED, player.velocity.y);
			anythingPressed = true;
			player.animation.play('right');
		} else {
			player.velocity.set(0, player.velocity.y);
		}

		if (!anythingPressed) {
			player.animation.curAnim.stop();
			player.velocity.set(0, 0);
		}


		super.update(elapsed);
	}
}
