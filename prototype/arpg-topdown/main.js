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

    for (var i = 0; i < 8; i++) {
      Crafty.e('Tree');
    }
  }
}

window.addEventListener('load', Game.start);

Crafty.c('Tree', {
  init: function() {
    this.requires('Actor').color('#884400').size(24, 24)
      .move(randomBetween(0, Game.width), randomBetween(0, Game.height));
  }
});
