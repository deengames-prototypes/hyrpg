Crafty.c('Player', {
  init: function() {
    this.target = null;
    this.queue = [];

    this.requires('Actor, Text2')
      .text('HP: 50')
      .size(64, 64).move(64, 64).color('blue');
  },

  getDamage: function() {
    var cost = 0;

    for (var i = 0; i < this.queue.length; i++) {
      var attack = this.queue[i];
      switch(attack) {
          case "L":
            cost += randomBetween(7, 9);
            break;
          case "M":
            cost += randomBetween(4, 6);
            break;
          case "S":
            cost += randomBetween(1, 3);
            break;
      }
    }

    return cost;
  },

  enqueue: function(strength) {
    // Try to get the cost. If more than 9, revert last push.
    this.queue.push(strength);
    if (this.getComboCost() > 9) {
      this.queue.pop();
    }
    this.updateComboText();
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

  attack: function() {
    if (this.target == null) { return; }
    damage = this.getDamage();

    this.target.hp -= damage;
    this.target.refresh();
    var message = 'Player attacks for ' + damage + ' damage!';
    if (this.target != null && this.target.hp <= 0) {
      message += " Enemy dies!!";
    }
    this.queue = [];
    this.updateComboText();
    Crafty('StatusBar').show(message);
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
      Crafty('Player').select(null);
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
      Crafty('Player').enqueue('S');
    });
    Crafty.e('Actor, Text2').text("M").move(100, 350).size(50, 50).color('#ffff66').click(function() {
      Crafty('Player').enqueue('M');
    });
    Crafty.e('Actor, Text2').text("L").move(175, 350).size(50, 50).color('#ffff00').click(function() {
      Crafty('Player').enqueue('L');
    });
    Crafty.e('Actor, Text2').text("Attack").move(250, 350).size(50, 50).color('#ff0000').click(function() {
      Crafty('Player').attack();
    });
    Crafty.e('Actor, Text2, ComboText').move(350, 350).text('Combo: 0')
  }
}

window.addEventListener('load', Game.start);
