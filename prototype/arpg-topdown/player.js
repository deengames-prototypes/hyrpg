Crafty.c('Sword', {
  init: function() {
    this.requires('Actor').size(56, 8).color('#dddddd');

    var self = this;
    var player = Crafty('Player');
    var myX;
    var myY;
    var endRotation;
    this.z = player.z - 1;

    this.resetMonsterIsHit();

    if (player.direction == 'left' || player.direction == 'right') {
      if (player.direction == 'right') {
        this.origin('middle left');
        myX = player.attr('x') + player.attr('w');
        this.rotation = -30;
        this.endRotation = 30;
      } else if (player.direction == 'left') {
        this.origin('middle right');
        myX = player.attr('x') - this.attr('w');
        this.rotation = -30;
        this.endRotation = 30;
      }
      this.move(myX, player.attr('y') + (player.attr('h') / 2));
    } else {
      if (player.direction == 'down') {
        this.origin(0, this.attr('h') / 2);
        myY = player.attr('y') + 0.75 * player.attr('h');
        this.rotation = 45;
        this.endRotation = 135;
      } else if (player.direction == 'up') {
        this.origin(0, this.attr('h') / 2);
        myY = player.attr('y') + player.attr('h') / 4;
        this.rotation = -135;
        this.endRotation = -45;
      }
      this.move(player.attr('x') + (player.attr('w') / 2), myY);
    }

    this.one('TweenEnd', function() {
      self.resetMonsterIsHit();
      Crafty('Player').enableControl();
      self.die();
    });
  },

  attack: function(attack) {
    this.tween({ rotation: this.endRotation }, attack.delay);

    this.collide('Monster', function(monsters) {
      for (var i = 0; i < monsters.length; i++) {
        var monster = monsters[i].obj;
        // This happens multiple times per frame. monster.getHurt remembers,
        // then resets "was I hit this swing" flag when the sword dies.
        if (!monster.isHitThisAttack) {
          monster.getHurt(attack.damage);
          monster.isHitThisAttack = true;
        }
      }
    })
  },

  resetMonsterIsHit: function() {
    var monsters = Crafty('Monster');
    for (var i = 0; i < monsters.length; i++) {
      // Got the ID
      var id = monsters[i];
      var monster = Crafty(id);
      monster.isHitThisAttack = false;
    }
  }
});

Crafty.c('Player', {
  init: function() {
    var self = this;
    this.hp = 50;
    this.lastHurt = Date.now();

    this.requires('Actor').controllable(200).color('red').size(32, 48);

    this.keyPress('NUMPAD_1', function() {
      self.attack(extern('attacks')[0]);
    });
    this.keyPress('NUMPAD_2', function() {
      self.attack(extern('attacks')[1]);
    });
    this.keyPress('NUMPAD_3', function() {
      self.attack(extern('attacks')[2]);
    });


    this.collideWith('Tree');
    this.collideWith('Monster', function() {
      var now = Date.now();
      if (now - self.lastHurt >= 1000) { // 1s or more ago?
        self.hurt(5);
        self.lastHurt = now;
      }
      self.refresh();
    });

    this.text = Crafty.e('Actor, Text2').color('red');
    this.refresh();

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

    this.bind('Moved', function() {
      this.text.attr({ x: this.attr('x'), y: this.attr('y') });
    })
  },

  attack: function(attack) {
    if (Crafty('Sword').length == 0) {
      this.disableControl();
      Crafty.e('Sword').attack(attack);
    }
  },

  hurt: function(damage) {
    this.hp -= damage;
    this.hp = Math.max(0, this.hp);
    if (this.hp == 0) {
      this.die();
      Crafty.e('Actor, Text2').fontSize(72).text("GAME OVER!");
    }
  },

  refresh: function() {
    this.text.text(this.hp);
  }
})
