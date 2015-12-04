Game = {
  start: function() {
    Crafty.init(800, 600);
    Crafty.background('#008800');
    Crafty.e('Player');
  }
}

window.addEventListener('load', Game.start);
