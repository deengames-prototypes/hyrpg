Game = {
  width: 800,
  height: 500,

  start: function() {
    Crafty.init(Game.width, Game.height);
    Crafty.background('grey');
    Crafty.e('Player');
    Crafty.e('ComboWatcher');
    Crafty.e('StatusBar');

    var numMonsters = randomBetween(3, 5);
    for (var i = 0; i < numMonsters; i++) {
      Crafty.e('Sheep');
    }

    Crafty.e('Slime');
    Crafty.e('Archer');

    for (var i = 0; i < 5; i++) {
      Crafty.e('Tree');
    }
  }
}

window.addEventListener('load', Game.start);

Crafty.c('Tree', {
  init: function() {
    this.requires('Actor').color('#884400').size(24, 72)
      .move(randomBetween(0, Game.width), randomBetween(0, Game.height));

    Crafty.e('Actor').color("#448844").size(72, 24).move(this.attr('x') - 24, this.attr('y'));
  }
});

Crafty.c('StatusBar', {
  init: function() {
    this.requires('Actor, Text2').size(800, 32).color('grey');
  },

  showMessage: function(text) {
    this.text(text);
  },

  clear: function() {
    this.text('');
  }
});
