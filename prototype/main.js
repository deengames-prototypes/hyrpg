Crafty.c('Player', {
  init: function() {
    this.requires('Actor, Text2')
      .text('HP: 50')
      .size(64, 64).move(64, 64).color('blue');
  },

  getDamage: function() {
    return randomBetween(8, 12);
  },

  attack: function(target, strength) {
    damage = this.getDamage();
    target.hp -= damage;
    target.refresh();
    var message = 'Player attacks for ' + damage + ' damage!';
    if (target.hp <= 0) {
      message += " Enemy dies!!";
    }
    Crafty('StatusBar').show(message);
  }
})

Crafty.c('Enemy', {
  init: function() {
    var self = this;
    this.requires('Actor, Text2').color('red');
    self.hp = 30;
    self.refresh();
    this.click(function() {
      Crafty('Player').attack(self);
    });
  },

  refresh: function() {
    this.text(this.hp);
    this.size(40, 40);
    if (this.hp <= 0) {
      this.destroy();
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
  }
}

window.addEventListener('load', Game.start);
