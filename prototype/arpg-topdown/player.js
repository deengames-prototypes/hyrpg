Crafty.c('Sword', {
  init: function() {
    this.requires('Actor').size(56, 8).color('#dddddd');

    var self = this;
    var player = Crafty('Player');
    var myX;
    var myY;
    var endRotation;

    if (player.direction == 'left' || player.direction == 'right') {
      if (player.direction == 'right') {
        this.origin('middle left');
        myX = player.attr('x') + player.attr('w');
        this.rotation = -45;
        endRotation = 45;
      } else if (player.direction == 'left') {
        this.origin('middle right');
        myX = player.attr('x') - this.attr('w');
        this.rotation = -45;
        endRotation = 45;
      }
      this.move(myX, player.attr('y') + (player.attr('h') / 2));
    } else {
      if (player.direction == 'down') {
        this.origin(0, this.attr('h') / 2);
        myY = player.attr('y') + player.attr('h');
        this.rotation = 45;
        endRotation = 135;
      } else if (player.direction == 'up') {
        this.origin(0, this.attr('h') / 2);
        myY = player.attr('y');
        this.rotation = -135;
        endRotation = -45;
      }
      this.move(player.attr('x') + (player.attr('w') / 2), myY);
    }

    this.tween({ rotation: endRotation }, 0.25);
    this.one('TweenEnd', function() {
      Crafty('Player').enableControl();
      self.die();
    });

    this.collide('Monster', function(monsters) {
      for (var i = 0; i < monsters.length; i++) {
        var monster = monsters[i].obj;
        monster.die();
      }
    })
  }
});

Crafty.c('Player', {
  init: function() {
    var self = this;
    this.requires('Actor').controllable(200).color('red').size(48, 48);

    // fourway seems to take Z and ignore the numeric keypad. Use X, C, and V
    this.keyPress('NUMPAD_1', function() {
      // Assume right for testing
      self.disableControl();
      Crafty.e('Sword');
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
