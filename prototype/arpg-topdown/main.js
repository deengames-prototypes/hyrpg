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

    var numSheep = randomBetween(6, 10);
    for (var i = 0; i < numSheep; i++) {
      Crafty.e('Sheep');
    }
    Crafty.e('Slime');
    Crafty.e('Slime');
    Crafty.e('Archer');

    var numTrees = randomBetween(10, 15);
    var numBushes = randomBetween(5, 10);

    for (var i = 0; i < numTrees; i++) {
      Crafty.e('Tree');
    }

    for (var i = 0; i < numBushes; i++) {
      Crafty.e('Bush');
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

Crafty.c('Bush', {
  init: function() {
    var self = this;
    this.requires('Actor').color('#88FF44').size(32, 32)
      .move(randomBetween(0, Game.width), randomBetween(0, Game.height))
      .collide('Sword', function() {
        self.die();
      })
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
