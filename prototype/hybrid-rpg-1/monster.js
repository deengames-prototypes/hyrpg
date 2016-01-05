// Base enemy class; contains common functionality.
// Since we can't override methods when we declare components like this, there
// are no base attack/damage methods; only derived versions.
Crafty.c('Enemy', {
  init: function() {
    var self = this;

    // What's my unique number?
    if (typeof(window.nextEnemyNumber) === 'undefined') {
      window.nextEnemyNumber = 1;
    }
    this.name = "M" + window.nextEnemyNumber++;

    if (typeof(window.targets) === "undefined") {
      window.targets = [];
    }
    window.targets.push(self);

    this.requires('Actor, Text2');
    self.hp = 30;
    self.refresh();
    this.click(function() {
      Crafty('Player').select(self);
    });
  },

  refresh: function() {
    this.text(this.name + ":" + this.hp);
    this.size(60, 40);
    if (this.hp <= 0) {
      this.destroy();
      Crafty('Player').target = null;
    }
  }

  // Missing attack and getDamage functions, since we call derived versions.
});

Crafty.c('Slime', {
  init: function() {
    this.requires('Enemy');
    this.hp = 30;
    this.refresh();
  },

  attack: function(wasBlocked) {
    var split = randomBetween(1, 100) <= config('slime_split_percent');
    if (split && !wasBlocked) {
      var s = Crafty.e('Slime').color('#AA6600').move(350, 64 + 32 * Crafty('Enemy').length);
      s.colour = '#AA6600';
      s.hp = this.hp;
      s.refresh();
      Crafty('StatusBar').show(this.name + " split into two!");
    } else {
      var damage = this.getDamage();
      var message = 'attacks'
      if (randomBetween(1, 100) <= config('enemy_critical_percent')) {
        damage *= 2;
        message = 'critically attacks';
      }
      if (wasBlocked == true) {
        if (split) {
          message += ' (blocked from splitting)';
        } else {
          message += ' (blocked)'
        }
        damage = Math.round(damage * config('blocked_attack_damage_percent'));
      }
      Crafty('Player').hurt(damage);
      Crafty('StatusBar').show(this.name + " " + message + " for " + damage + " health.");
    }
  },

  getDamage: function() {
    return randomBetween(2, 5);
  }
});

Crafty.c('Bee', {
  init: function() {
    this.requires('Enemy');
    this.hp = 40;
    this.refresh();
  },

  attack: function(wasBlocked) {
    var damage = this.getDamage();
    var message = 'attacks'
    if (randomBetween(1, 100) <= config('bee_poison_percent')  && !wasBlocked) {
      message += ' and poisons';

      // Apply poison damage five times, once per second
      var poisonDamage = config('bee_poison_damage');
      for (var i = 0; i < 5; i++) {
        wait(i + 1, function() {
          Crafty('Player').hurt(poisonDamage / 5);
        });
      }
    }
    Crafty('Player').hurt(damage);
    Crafty('StatusBar').show(this.name + " " + message + " for " + damage + " health.");
  },

  getDamage: function() {
    return randomBetween(4, 6);
  }
});
