Crafty.c('Player', {
  init: function() {
    this.target = null;
    this.queue = [];
    this.health = 50;
    var self = this;

    this.requires('Actor, Text2')
      .move(64, 64).color('blue')
      .keyPress('SPACE', function() {
        if (Crafty('TimingBar').visible) {
          Crafty('TimingBar').checkForHit();
        }
      });
      this.refresh();
  },

  hurt: function(damage) {
    this.health -= damage;
    this.health = Math.max(0, this.health);
    if (this.health == 0) {
      Crafty.e('Actor, Text2').fontSize(72).color('red').text('You DIED!!');
      Game.hideUi();
    }
    this.refresh();
  },

  refresh: function() {
    this.text('HP: ' + this.health)
      .size(64, 64);
  },

  // Control this distribution to control how players should attack
  // Consider "efficiency" as the energy cost per one point of damage.

  // If you want all three to be equally efficient, damage is linearly
  // correlated with cost, eg. S=1-2, M=2-4, L=3-6. With nine points
  // of energy, the ranges are: all Sx9 = 9-18, Mx4 + S = 9-18, Lx3 = 9-18)

  // On the other hand, if you want M and L to "feel" stronger, you can use
  // damage ranges like S=1-2, M=4-6, and L=7-10. This gives you distributions
  // of Sx9 = 9-18, Mx4 + S = 17-26, Lx3 = 21-30. But in this case, what reason
  // would players ever use for S and even M attacks?
  getDamage: function(attack) {
    switch(attack) {
        case "L":
          return randomBetween(3, 7); // 9-18
        case "M":
          return randomBetween(2, 5); // 9-18
        case "S":
          return randomBetween(1, 3); // 9-18
    }
  },

  // Enqueues an attack. Returns true if the attack was queued, false if not
  // (if we didn't have enough energy to add the attack, we return false).
  enqueue: function(strength) {
    var toReturn = true;
    // Try to get the cost. If more than 9, revert last push.
    this.queue.push(strength);
    if (this.getComboCost() > config('max_energy')) {
      this.queue.pop();
      var toReturn = false;
    }
    this.updateComboText();
    return toReturn;
  },

  updateComboText: function() {
    var comboString = this.getComboString();
    var cost = this.getComboCost();
    Crafty('ComboText').text("Combo: " + comboString + " (" + cost + ")");
  },

  getComboString: function() {
    var comboString = "";

    for (var i = 0; i < this.queue.length; i++) {
      var attack = this.queue[i];
      comboString += attack;
    }

    return comboString;
  },

  getComboCost: function() {
    var cost = 0;

    for (var i = 0; i < this.queue.length; i++) {
      var attack = this.queue[i];
      switch(attack) {
          case "L":
            cost += 3;
            break;
          case "M":
            cost += 2;
            break;
          case "S":
            cost += 1;
            break;
      }
    }

    return cost;
  },

  // Called from attack buttons. Enqueues an attack, checks for a combo strike,
  // and shows a combo bar if applicable. See: finishAttack.
  attack: function(attack) {
    if (this.target == null) {
      Crafty('StatusBar').show("Select a target first!");
    }
    else if (this.enqueue(attack)) {
      var combo = this.isComboStrike();
      if (combo != null) {
        Crafty('TimingBar').show();
      } else {
        this.finishAttack();
      }
    } else {
      Crafty('StatusBar').show('Not enough energy!');
    }
  },

  // comboSuccess is triary: true (combo hit), false (combo missed), and null (no combo)
  // Called on a regular attack, and combo (after hit or miss)
  finishAttack: function(comboSuccess) {
    // Attack is queued; it's the last move we did.
    var attack = this.queue[this.queue.length - 1];
    var damage = this.getDamage(attack);
    var message = 'Player ' + attack + '-attacks ' + this.target.name + ' for ' + damage + ' damage!';
    var hitOrMiss = 'SMASHED';
    var combo = this.isComboStrike();

    if (typeof(comboSuccess) !== "undefined" && comboSuccess != null) {
      // Combo hit or missed
      if (comboSuccess == true) {
        damage += combo.damage;
      } else {
        damage += Math.round(combo.damage *= 0.5);
        hitOrMiss = 'grazed';
      }

      message = 'Player ' + hitOrMiss + " a " + combo.name + " on " + this.target.name + " for " + damage + ' damage!';
    }

    if (this.target != null && this.target.hp <= 0) {
      message += " Enemy dies!!";
    }

    this.target.hp -= damage;
    this.target.refresh();
    this.updateComboText();

    Crafty('StatusBar').show(message);

    if (this.getComboCost() == config('max_energy')) {
      Game.endPlayerTurn();
    }
  },

  // Return a combo object if the last attack ignited a combo
  // Otherwise, returns null
  // WARNING: DO NOT MAKE THIS MUTABLE. It's called from finishAttack to
  // quickly re-calculate the current combo, out of context of attack.
  isComboStrike: function() {
    var comboString = this.getComboString().toUpperCase();
    var combos = extern('combos');
    for (var i = 0; i < combos.length; i++) {
      var combo = combos[i];
      if (comboString.endsWith(combo.moves.toUpperCase())) {
        return combo;
      }
    }
    return null;
  },

  select: function(target) {
    this.target = target;

    var targets = window.targets;
    for (var i = 0; i < targets.length; i++) {
      targets[i].color('#aa0000');
    }
    if (this.target != null) {
      this.target.color('red');
    }
  }
})

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

    this.requires('Actor, Text2').color('#aa0000');
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
  },

  attack: function(wasBlocked) {
    var damage = this.getDamage();
    var message = 'attacks'
    if (randomBetween(0, 100) <= config('enemy_critical_percent')) {
      damage *= 2;
      message = 'critically attacks';
    }
    if (wasBlocked == true) {
      message += ' (blocked)';
      damage = Math.round(damage * config('blocked_attack_damage_percent'));
    }
    Crafty('Player').hurt(damage);
    Crafty('StatusBar').show(this.name + " " + message + " for " + damage + " health.");
  },

  getDamage: function() {
    return randomBetween(2, 6);
  }
})

Crafty.c('StatusBar', {
  init: function() {
    this.requires('Actor, Text2').color('#BBBBBB');
  },

  show: function(message) {
    this.text(message).size(720, 36);
  }
});

Crafty.c('TimingBar', {
  init: function() {
    this.requires('Actor').color('white').size(675, 15).move(25, 370);
    this.hitArea = Crafty.e('Actor').color('purple').size(100, 25).move(500, 365);
    var self = Crafty('TimingBar');
    this.hide();
  },

  checkForHit: function() {
    // AABB: does hitBox overlap hitArea? Just compare X, because Y lines up.
    // This includes hitBox partially overlapping hitArea.
    if (this.hitBox != null && this.hitBox.attr('x') >= this.hitArea.attr('x') &&
      this.hitBox.attr('x') + this.hitBox.attr('w') <= this.hitArea.attr('x') + this.hitArea.attr('w')) {
        // SUCCESS!
        if (Game.turn == 'player') {
          Crafty('Player').finishAttack(true);
        } else {
          Game.currentEnemy.attack(true);
        }
      } else {
        // Missed.
        if (Game.turn == 'player') {
          Crafty('Player').finishAttack(false);
        } else {
          Game.currentEnemy.attack(false);
        }
      }
      this.hide();
  },

  hide: function() {
    this.visible = false;
    this.hitArea.visible = false;
    if (this.hitBox != null) {
      this.hitBox.die();
    }
  },

  show: function() {
    this.visible = true;
    this.hitArea.visible = true;

    var self = this;
    var comboTime = extern('combo_time_seconds');
    // Only reason to show = start combo
    self.hitBox = Crafty.e('Actor').size(25, 25).color('red').move(this.attr('x'), this.attr('y'))
      .tween({ x: this.attr('x') + this.attr('w') - 25 }, comboTime).after(comboTime + 0.1, function() {
        // Didn't click in time
        if (Game.turn == 'player') {
          Crafty('Player').finishAttack(false);
        } else {
          Game.currentEnemy.attack(false);
        }
        self.hide();
      });
  }
});

Crafty.c('Button', {
  init: function() {
    this.requires('Actor, Text2');
  },

  button: function(attack) {
    this.text(attack).size(50, 50)
    .click(function() {
      Crafty('Player').attack(attack);
    });
  }
});

Game = {
  start: function() {
    Game.turn = 'player';
    Crafty.init(720, 405);
    Crafty.background('#4A4');
    Crafty.e('StatusBar').show('The battle begins!');
    Crafty.e('Player');
    // Fake enemy
    Crafty.e('Enemy').move(620, 64);
    Crafty.e('Enemy').move(550, 96);
    Crafty.e('Enemy').move(640, 128);

    Crafty.e('Button').move(25, 300).color('#ffffaa').button('S');
    Crafty.e('Button').move(100, 300).color('#ffff66').button('M');
    Crafty.e('Button').move(175, 300).color('#ffff00').button('L');
    Crafty.e('Actor, Text2, ComboText').move(350, 300).text('Combo: 0')
    Crafty.e('TimingBar');
  },

  endPlayerTurn: function() {
    var self = this;
    this.turn = 'enemy';
    var player = Crafty('Player');
    player.queue = [];
    player.updateComboText();

    this.hideUi();

    wait(1, function() {
      // Wait before any attacks
      Crafty('StatusBar').show('Monsters turn!');
      wait(1, function() {
        foreach('Enemy', function(i, enemy) {
          // A hack, wrapped in a kludge, wrapped in a delicious pastry shell ...
          // Account for the time it takes to block/hit, too (timing bar)
          enemy.after(i * (config('enemy_ui_delay') + config('combo_time_seconds')), function() {
            Crafty('TimingBar').show();
            Game.currentEnemy = enemy;
          });
        });
      });

      wait(Crafty('Enemy').length * (config('enemy_ui_delay') + config('combo_time_seconds')) + 1, function() {
        self.showUi();
        Game.currentEnemy = null;
      });
    });
  },

  hideUi: function() {
    this.setUiVisible(false);
    Crafty('Player').select(null);
  },

  showUi: function() {
    this.setUiVisible(true);
  },

  // private
  setUiVisible: function(boolValue) {
    foreach('Button', function(i, b) {
      b.visible = boolValue;
    });
    Crafty('ComboText').visible = boolValue;
  }
}

window.addEventListener('load', Game.start);
