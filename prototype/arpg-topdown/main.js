Game = {
  width: 800,
  height: 500,

  start: function() {
    Crafty.init(Game.width, Game.height);
    Crafty.background('grey');
    Crafty.e('Player');

    var numMonsters = randomBetween(3, 5);
    for (var i = 0; i < numMonsters; i++) {
      Crafty.e('Sheep');
    }

    Crafty.e('Slime');
  }
}

window.addEventListener('load', Game.start);
