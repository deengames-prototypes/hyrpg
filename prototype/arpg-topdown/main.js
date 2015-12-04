Game = {
  width: 800,
  height: 600,

  start: function() {
    Crafty.init(Game.width, Game.height);
    Crafty.background('grey');
    Crafty.e('Player');

    var numMonsters = randomBetween(3, 5);
    for (var i = 0; i < numMonsters; i++) {
      Crafty.e('Monster');
    }
  }
}

window.addEventListener('load', Game.start);
