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

  // Returns true if the attack was queued, false if not
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
    var comboString = "";

    for (var i = 0; i < this.queue.length; i++) {
      var attack = this.queue[i];
      comboString += attack;
    }
    var cost = this.getComboCost();
    Crafty('ComboText').text("Combo: " + comboString + " (" + cost + ")");
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

  attack: function(attack) {
    if (this.target == null) {
      Crafty('StatusBar').show("Select a target first!");
    }
    else if (this.enqueue(attack)) {
      damage = this.getDamage(attack);

      this.target.hp -= damage;
      this.target.refresh();

      var message = 'Player ' + attack + '-attacks for ' + damage + ' damage!';
      if (this.target != null && this.target.hp <= 0) {
        message += " Enemy dies!!";
      }

      this.updateComboText();
      Crafty('StatusBar').show(message);

      if (this.getComboCost() == config('max_energy')) {
        this.queue = [];
        this.updateComboText();
      }
    } else {
      Crafty('StatusBar').show('Not enough energy!');
    }
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

    Crafty.e('Actor, Text2').text("S").move(25, 350).size(50, 50).color('#ffffaa').click(function() {
      Crafty('Player').attack('S');
    });
    Crafty.e('Actor, Text2').text("M").move(100, 350).size(50, 50).color('#ffff66').click(function() {
      Crafty('Player').attack('M');
    });
    Crafty.e('Actor, Text2').text("L").move(175, 350).size(50, 50).color('#ffff00').click(function() {
      Crafty('Player').attack('L');
    });
    Crafty.e('Actor, Text2, ComboText').move(350, 350).text('Combo: 0')
  }
}

window.addEventListener('load', Game.start);
