Crafty.c('Player', {
  init: function() {
    this.target = null;
    this.requires('Actor, Text2')
      .text('HP: 50')
      .size(64, 64).move(64, 64).color('blue');
  },

  getDamage: function() {
    return randomBetween(8, 12);
  },

  attack: function(strength) {
    if (this.target == null) { return; }
    damage = this.getDamage();
    this.target.hp -= damage;
    this.target.refresh();
    var message = 'Player attacks for ' + damage + ' damage!';
    if (this.target != null && this.target.hp <= 0) {
      message += " Enemy dies!!";
    }
    Crafty('StatusBar').show(message);
  },

  select: function(target) {
    this.target = target;
    var targets = window.targets;
    for (var i = 0; i < targets.length; i++) {
      targets[i].color('#aa0000');
    }
    if (this.target != null) {
      this.target.color('red');
    }
  }
})

Crafty.c('Enemy', {
  init: function() {
    var self = this;

    if (typeof(window.targets) === "undefined") {
      window.targets = [];
    }
    window.targets.push(self);

    this.requires('Actor, Text2').color('#aa0000');
    self.hp = 30;
    self.refresh();
    this.click(function() {
      Crafty('Player').select(self);
    });
  },

  refresh: function() {
    this.text(this.hp);
    this.size(40, 40);
    if (this.hp <= 0) {
      this.destroy();
      Crafty('Player').select(null);
    }
  }
})

Crafty.c('StatusBar', {
  init: function() {
    this.requires('Actor, Text2').color('#BBBBBB');
  },

  show: function(message) {
    this.text(message).size(720, 36);
  }
});

Game = {
  start: function() {
    Crafty.init(720, 405);
    Crafty.background('#4A4');
    Crafty.e('StatusBar').show('The battle begins!');
    Crafty.e('Player');
    // Fake enemy
    Crafty.e('Enemy').move(640, 64);
    Crafty.e('Enemy').move(570, 96);
    Crafty.e('Enemy').move(660, 128);

    Crafty.e('Actor').move(25, 350).size(200, 50).color('#ffffaa').click(function() {
      Crafty('Player').attack('light');
    });
  }
}

window.addEventListener('load', Game.start);
