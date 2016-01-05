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
          return randomBetween(7, 10); // 21-30 (average is 25)
        case "M":
          return randomBetween(3, 6); // 13-26 (average is 20)
        case "S":
          return randomBetween(1, 2); // 9-18 (average is 14)
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
      targets[i].color(targets[i].colour);
    }
    if (this.target != null) {
      this.target.color('red');
    }
  }
});
