Crafty.c('Player', {
  init: function() {
    this.target = null;
    this.queue = [];

    this.requires('Actor, Text2')
      .text('HP: 50')
      .size(64, 64).move(64, 64).color('blue');
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
          return randomBetween(3, 6); // 9-18
        case "M":
          return randomBetween(2, 4); // 9-18
        case "S":
          return randomBetween(1, 2); // 9-18
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
        Crafty('ComboBar').show();
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
    var message = 'Player ' + attack + '-attacks for ' + damage + ' damage!';
    var hitOrMiss = 'SMASHED';
    var combo = this.isComboStrike();

    if (comboSuccess != null) {
      // Combo hit or missed
      if (comboSuccess == true) {
        damage += combo.damage;
      } else {
        damage += Math.round(combo.damage *= 0.5);
        hitOrMiss = 'grazed';
      }

      message = 'Player ' + hitOrMiss + " a " + combo.name + " for " + damage + ' damage!';
    }

    if (this.target != null && this.target.hp <= 0) {
      message += " Enemy dies!!";
    }

    this.target.hp -= damage;
    this.target.refresh();
    this.updateComboText();

    Crafty('StatusBar').show(message);

    if (this.getComboCost() == config('max_energy')) {
      this.queue = [];
      this.updateComboText();
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
    // Clear queue only if we had someone selected
    if (this.target != null) {
      this.queue = [];
      this.updateComboText();
    }

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
    this.text(this.hp);
    this.size(40, 40);
    if (this.hp <= 0) {
      this.destroy();
      Crafty('Player').target = null;
    }
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

Crafty.c('ComboBar', {
  init: function() {
    this.requires('Actor').color('white').size(675, 15).move(25, 370);
    this.hitArea = Crafty.e('Actor').color('purple').size(150, 25).move(475, 365);
    var self = Crafty('ComboBar');
    this.nowButton = Crafty.e('Actor, Text2').text('!!!').size(50, 50).move(250, 300).color('red').click(function() {
      // AABB: does hitBox overlap hitArea? Just compare X, because Y lines up.
      // This includes hitBox partially overlapping hitArea.
      if (self.hitBox != null && self.hitBox.attr('x') >= self.hitArea.attr('x') &&
        self.hitBox.attr('x') + self.hitBox.attr('w') <= self.hitArea.attr('x') + self.hitArea.attr('w')) {
          // SUCCESS!
          Crafty('Player').finishAttack(true);
        } else {
          // Missed.
          Crafty('Player').finishAttack(false);
        }
        self.hide();
    });
    this.hide();
  },

  hide: function() {
    this.visible = false;
    this.hitArea.visible = false;
    this.nowButton.visible = false;
    if (this.hitBox != null) {
      this.hitBox.die();
    }
  },

  show: function() {
    this.visible = true;
    this.hitArea.visible = true;
    this.nowButton.visible = true;

    var self = this;
    // Only reason to show = start combo
    self.hitBox = Crafty.e('Actor').size(25, 25).color('red').move(this.attr('x'), this.attr('y'))
      .tween({ x: this.attr('x') + this.attr('w') - 25 }, 1).after(1.1, function() {
        self.hide();
      });
  }
});

Game = {
  start: function() {
    Crafty.init(720, 405);
    Crafty.background('#4A4');
    Crafty.e('StatusBar').show('The battle begins!');
    Crafty.e('Player');
    // Fake enemy
    Crafty.e('Enemy').move(640, 64);
    Crafty.e('Enemy').move(570, 96);
    Crafty.e('Enemy').move(660, 128);

    Crafty.e('Actor, Text2').text("S").move(25, 300).size(50, 50).color('#ffffaa').click(function() {
      Crafty('Player').attack('S');
    });
    Crafty.e('Actor, Text2').text("M").move(100, 300).size(50, 50).color('#ffff66').click(function() {
      Crafty('Player').attack('M');
    });
    Crafty.e('Actor, Text2').text("L").move(175, 300).size(50, 50).color('#ffff00').click(function() {
      Crafty('Player').attack('L');
    });
    Crafty.e('Actor, Text2, ComboText').move(350, 300).text('Combo: 0')
    Crafty.e('ComboBar');
  }
}

window.addEventListener('load', Game.start);
