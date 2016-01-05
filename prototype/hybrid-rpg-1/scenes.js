
Crafty.defineScene('Battle', function(properties) {
  Game.turn = 'player';
  Crafty.background('#4A4');
  Crafty.e('StatusBar').show('The battle begins!');
  Crafty.e('Player');

  var n = randomBetween(2, 4);
  for (var i = 0; i < n; i++) {
    var e = Crafty.e(properties.name).color(properties.color).move(400 + 64 * i, 64 + 32 * i);
    e.colour = properties.color;
  }

  Crafty.e('Button').move(25, 300).color('#ffffaa').button('S');
  Crafty.e('Button').move(100, 300).color('#ffff66').button('M');
  Crafty.e('Button').move(175, 300).color('#ffff00').button('L');
  Crafty.e('Actor, Text2, ComboText').move(350, 300).text('Combo: 0')
  Crafty.e('TimingBar');
});

Crafty.defineScene('Selection', function() {
  Crafty.background('black');
  Crafty.e('Actor, Text2').color('red').text("Slimes").size(50, 50).move(50, 50).click(function() {
    Crafty.enterScene('Battle', { name: 'Slime', color: '#880000' });
  });
  Crafty.e('Actor, Text2').color('green').text("Bees").size(50, 50).move(150, 50).click(function() {
    Crafty.enterScene('Battle', { name: 'Bee', color: '#008800' });
  });
});
