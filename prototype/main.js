Crafty.c('Player', {
  init: function() {
    this.requires('Actor, Text2')
      .text('HP: 50')
      .size(64, 64).move(64, 64).color('blue');
  }
})

Crafty.c('Enemy', {
  init: function() {
    this.requires('Actor, Text2')
      .text('30')
      .size(40, 40).color('red');
  }
})

Game = {
  start: function() {
    Crafty.init(720, 405);
    Crafty.background('black');
    Crafty.e('Player');
    // Fake enemy
    Crafty.e('Enemy').move(640, 64);
    Crafty.e('Enemy').move(570, 96);
    Crafty.e('Enemy').move(660, 128);
  }
}

window.addEventListener('load', Game.start);
