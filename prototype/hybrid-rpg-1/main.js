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
    Crafty.init(720, 405);
    Crafty.enterScene("Selection");
  },

  endPlayerTurn: function() {
    var self = this;
    this.turn = 'enemy';
    var player = Crafty('Player');
    player.queue = [];
    player.updateComboText();

    self.hideUi();

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
        Game.turn = 'player';
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
