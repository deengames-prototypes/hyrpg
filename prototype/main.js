Crafty.c('Player', {
  init: function() {
    this.requires('Actor, Text2')
      .text('HP: 50')
      .size(64, 64).move(64, 64).color('blue');
  },

  getDamage: function() {
    // 8-12
    return Math.round(8 + Math.random(4));
  }
})

Crafty.c('Enemy', {
  init: function() {
    var self = this;
    this.requires('Actor, Text2').color('red');
      self.hp = 30;
      this.click(function() {
        damage = Crafty('Player').getDamage();
        self.hp -= damage;
        self.refresh();
      });

      self.refresh();
  },

  refresh: function() {
    this.text(this.hp);
    this.size(40, 40);
    if (this.hp <= 0) {
      this.destroy();
    }
  }
})

Game = {
  start: function() {
    Crafty.init(720, 405);
    Crafty.background('#4A4');
    Crafty.e('Player');
    // Fake enemy
    Crafty.e('Enemy').move(640, 64);
    Crafty.e('Enemy').move(570, 96);
    Crafty.e('Enemy').move(660, 128);
  }
}

window.addEventListener('load', Game.start);
