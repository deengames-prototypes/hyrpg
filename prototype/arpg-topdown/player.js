Crafty.c('Sword', {
  init: function() {
    var self = this;
    this.requires('Actor').size(64, 16).color('blue').origin('middle left');
    this.rotation = -45;
    this.tween({ rotation: 45 }, 0.25);
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
        Crafty.e('Sword').move(self.attr('x') + self.attr('w'), self.attr('y') + (self.attr('h') / 2));
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
