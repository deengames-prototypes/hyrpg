Game = {
  width: 1600,
  height: 1200,

  start: function() {
    Crafty.init(Game.width, Game.height);
    Crafty.background('grey');
    var p = Crafty.e('Player');

    Crafty.viewport.init(800, 500);
    Crafty.viewport.follow(p);

    Crafty.e('ComboWatcher');
    Crafty.e('StatusBar');

    var numMonsters = randomBetween(6, 10);
    for (var i = 0; i < numMonsters; i++) {
      Crafty.e('Sheep');
    }

    Crafty.e('Slime');
    Crafty.e('Slime');

    Crafty.e('Archer');

    for (var i = 0; i < 15; i++) {
      Crafty.e('Tree');
    }

    Crafty.e('Wall').size(Game.width, 4);
    Crafty.e('Wall').size(Game.width, 4).move(0, Game.height - 4);
    Crafty.e('Wall').size(4, Game.height);
    Crafty.e('Wall').size(4, Game.height).move(Game.width - 4, 0);
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
    var self = this;
    this.bind('ViewportScroll', function() {
      self.attr('x', -Crafty.viewport.x);
      self.attr('y', -Crafty.viewport.y);
    })
  },

  showMessage: function(text) {
    this.text(text);
  },

  clear: function() {
    this.text('');
  }
});

Crafty.c('Wall', {
  init: function() {
    this.requires('Actor').color('#FFBB88');
  }
});
