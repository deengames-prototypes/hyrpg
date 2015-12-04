Crafty.c('Sword', {
  init: function() {
    this.requires('Actor').size(64, 16).color('blue');

    var self = this;
    var player = Crafty('Player');
    var myX;
    var endRotation;

    if (player.direction == 'right') {
      this.origin('middle left');
      myX = player.attr('x') + player.attr('w');
      this.rotation = -45;
      endRotation = 45;
    } else if (player.direction == 'left') {
      this.origin('middle right');
      myX = player.attr('x') - this.attr('w');
      this.rotation = 45;
      endRotation = -45;
    }

    this.move(myX, player.attr('y') + (player.attr('h') / 2));

    this.tween({ rotation: endRotation }, 0.25);
    this.one('TweenEnd', function() {
      Crafty('Player').enableControl();
      self.die();
    });
  }
});

Crafty.c('Player', {
  init: function() {
    var self = this;
    this.requires('Actor').controllable(200).color('red').size(48, 48);

    // fourway seems to take Z and ignore the numeric keypad. Use X, C, and V
    this.keyPress('X', function() {
      if (self.direction == 'left' || self.direction == 'right') {
        // Assume right for testing
        self.disableControl();
        Crafty.e('Sword');
      }
    });

    // Keep track of direction
    this.bind('NewDirection', function(dir) {
      // Left/right take precedence over top/bottom/ eg. if left and up are
      // pressed at the same time, we face left.
      if (dir.x == -1) {
        self.direction = 'left';
      } else if (dir.x == 1) {
        self.direction = 'right';
      } else if (dir.y == -1) {
        self.direction = 'up';
      } else if (dir.y == 1) {
        self.direction = 'down';
      }
    });
  }
})
