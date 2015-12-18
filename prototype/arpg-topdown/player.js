Crafty.c('Sword', {
  init: function() {
    this.requires('Actor').size(56, 8).color('#dddddd');

    var self = this;
    var player = Crafty('Player');
    var myX;
    var myY;
    var endRotation;
    this.z = player.z - 1;
    Crafty('StatusBar').clear();

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

  attack: function(key, attack) {
    this.tween({ rotation: this.endRotation }, attack.delay);

    var combo = Crafty('ComboWatcher').attack(key);
    // Technically, the combo should always execute (whether you land a hit or not).
    // But, since there's no animation, etc. we're okay just executing it on hit.
    this.collide('Monster', function(monsters) {
      for (var i = 0; i < monsters.length; i++) {
        var monster = monsters[i].obj;
        // This happens multiple times per frame. monster.getHurt remembers,
        // then resets "was I hit this swing" flag when the sword dies.
        if (!monster.isHitThisAttack) {
          monster.getHurt(attack.damage);
          monster.isHitThisAttack = true;
          if (combo != null) {
            monster.getHurt(combo.damage);
            Crafty('StatusBar').showMessage('Executed ' + combo.name + ' for an additional ' + combo.damage + ' damage!')
          }
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
      self.attack('1', extern('attacks')[0]);
    });
    this.keyPress('NUMPAD_2', function() {
      self.attack('2', extern('attacks')[1]);
    });
    this.keyPress('NUMPAD_3', function() {
      self.attack('3', extern('attacks')[2]);
    });

    this.collideWith('Tree');
    this.collideWith('Wall');
    this.collideWith('Bush');

    this.collideWith('Monster');

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

  attack: function(key, attack) {
    if (Crafty('Sword').length == 0) {
      this.disableControl();
      Crafty.e('Sword').attack(key, attack);
    }
  },

  monsterTouch: function(monster) {
    var now = Date.now();
    if (now - this.lastHurt >= 1000) { // 1s or more ago?
      this.hurt(monster.damage);
      this.lastHurt = now;
    }
  },

  hurt: function(damage) {
    this.hp -= damage;
    this.hp = Math.max(0, this.hp);
    if (this.hp == 0) {
      this.die();
      Crafty.e('Actor, Text2').fontSize(72).text("GAME OVER!").move(-Crafty.viewport.x, -Crafty.viewport.y);
    }

    var sword = Crafty('Sword');
    if (sword.length > 0) {
      sword.die();
      this.enableControl();
      Crafty('StatusBar').showMessage("Attack interrupted!");
    }

    this.refresh();
  },

  refresh: function() {
    this.text.text(this.hp);
  }
});

Crafty.c('ComboWatcher', {
  init: function() {
    this.queue = '';
  },

  // Note that an attack executed. Returns the combo (if there was one) or null
  // (if we didn't execute a combo). Note that this mutates state.
  attack: function(key) {
    this.queue += key;

    var combos = extern('combos');
    // TODO: order shouldn't matter. If the keys match more than one combo, we
    // should really pick the best, eh?
    for (var i = 0; i < combos.length; i++) {
      var combo = combos[i];
      if (this.queue.endsWith(combo.moves)) {
        this.queue = '';
        return combo;
      }
    }

    return null;
  }
});
