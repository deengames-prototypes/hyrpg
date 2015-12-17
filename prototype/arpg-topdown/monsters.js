Crafty.c('Monster', {
  init: function() {
    var self = this;
    this.text = Crafty.e('Text2');
    this.damage = 0;
    this.moveStep = 1;
    this.requires('Actor');
    var x = randomBetween(0, Game.width - this.attr('w'));
    var y = randomBetween(0, Game.height - this.attr('y'));
    this.move(x, y);

    this.bind('EnterFrame', function() {
      var old = { x: this.attr("x"), y: this.attr("y") };
      this.moveTowardDestination();
      var curr = { x: this.attr("x"), y: this.attr("y") };

      this.text.attr("x", this.attr("x"));
      this.text.attr("y", this.attr("y"));

      // magnitudes
      var mags = { x: Math.abs(curr.x - old.x), y: Math.abs(curr.y - old.y) };
      if (mags.x >= mags.y) {
        this.facing = mags.x > 0 ? 'right' : 'left';
      } else {
        this.facing = mags.y > 0 ? 'down' : 'up';
      }
    });

    // List of things you can't intersect
    this.collideWith('Tree');
    this.collideWith('Monster');
    this.collideWith('Wall');
    this.collideWith('Bush');
  },


  pickRandomSpot: function() {
    var self = this;

    var destX = self.attr('x');
    var destY = self.attr('y');

    destX += randomBetween(-200, 200);
    destY += randomBetween(-200, 200);

    this.destination = { x: destX, y: destY };
  },

  moveTowardDestination: function() {
    if (this.destination == null) { return; }

    if (Math.abs(this.attr('x') - this.destination.x) >= this.moveStep) {
      if (this.attr('x') < this.destination.x) {
        this.attr('x', this.attr('x') + this.moveStep);
      } else if (this.attr('x') > this.destination.x) {
        this.attr('x', this.attr('x') - this.moveStep);
      }
    }

    if (Math.abs(this.attr('y') - this.destination.y) >= this.moveStep) {
      if (this.attr('y') < this.destination.y) {
        this.attr('y', this.attr('y') + this.moveStep);
      } else if (this.attr('y') > this.destination.y) {
        this.attr('y', this.attr('y') - this.moveStep);
      }
    }
  },

  health: function(health) {
    this.currentHealth = this.maxHealth = health;
    this.text.text(this.currentHealth);
  },

  getHurt: function(damage) {
    this.currentHealth -= damage;
    this.text.text(this.currentHealth);
    if (this.currentHealth <= 0) {
      this.die();
      this.text.die();

      if (Crafty('Monster').length == 0) {
        Crafty.e('Actor, Text2').fontSize(72).text("YOU WIN!").move(-Crafty.viewport.x, -Crafty.viewport.y);
      }
    }
  }
});

Crafty.c('Sheep', {
  init: function() {
    this.requires('Monster').size(32, 24).color('white');
    this.moveStep = 1;
    this.health(20);
    this.damage = extern('damage').sheep;
    var self = this;
    this.lastCharge = new Date();
    this.isCharging = false;

    this.repeatedly(randomBetween(3, 5), function() {
      if (!this.isCharging) {
        self.pickRandomSpot();
      }
    });

    this.bind('EnterFrame', function() {
      var p = Crafty('Player');
      var d = Math.abs(self.attr('x') - p.attr('x')) + Math.abs(self.attr('y') - p.attr('y'));
      var now = new Date();

      // Don't charge within 2s of the last charge. Prevents constant charging.
      if (!self.isCharging && d <= 200 && (now.valueOf() - self.lastCharge.valueOf()) >= 2000)
      {
        self.destination = { x: p.x, y: p.y };
        self.isCharging = true;
        self.lastCharge = now;
        this.moveStep = 2;
        this.color('yellow');
      } else if (self.isCharging && self.destination != null && Math.abs(self.attr('x') - self.destination.x) +
        Math.abs(self.attr('y') - self.destination.y) <= self.moveStep) { // reached destination
        self.destination = null;
        self.isCharging = false;
        this.moveStep = 1;
        this.color('white');
      }

      self.moveTowardDestination();

      if (self.facing == 'left' || self.facing == 'right') {
        self.size(32, 24);
      } else {
        self.size(24, 32);
      }
    });
  }
});

Crafty.c('Slime', {
  init: function() {
    this.requires('Monster').size(48, 48).color('#88ff88');
    this.moveStep = 2;
    var self = this;
    this.health(100);
    this.damage = extern('damage').slime;

    this.repeatedly(randomBetween(3, 5), function() {
      if (self.destination == null) {
        self.pickRandomSpot();
      }
    });

    this.bind('EnterFrame', function() {
      var p = Crafty('Player');
      if (Math.abs(self.attr('x') - p.attr('x')) + Math.abs(self.attr('y') - p.attr('y')) <= 200)
      {
        self.destination = { x: p.x, y: p.y };
        this.color('green');
      } else {
        self.destination = null;
        this.color('#88ff88');
        self.moveTowardDestination();
      }
    });
  }
});

Crafty.c('Archer', {
  init: function() {
    this.requires('Monster').size(16, 32).color('#4488bb');
    this.moveStep = 2;
    var self = this;
    this.lastFired = new Date();
    this.health(50);

    this.bind('EnterFrame', function() {
      var p = Crafty('Player');

      // Vector pointing from player to us
      var vAwayFromPlayer = { x: self.attr('x') - p.attr('x'), y: self.attr('y') - p.attr('y') };
      var d = Math.abs(vAwayFromPlayer.x) + Math.abs(vAwayFromPlayer.y);
      var now = new Date();

      if (d <= 150)
      {
        self.destination = { x: self.attr('x') + vAwayFromPlayer.x, y: self.attr('y') + vAwayFromPlayer.y };
        self.moveTowardDestination();
      }

      if (now.valueOf() - self.lastFired.valueOf() > 1000) {
        // 1s delay since we last shot at the player
        // Normalize the vector to the player. We always shoot at a constant velocity.
        var magnitude = Math.abs(vAwayFromPlayer.x) + Math.abs(vAwayFromPlayer.y);
        var vx = -vAwayFromPlayer.x / magnitude;
        var vy = -vAwayFromPlayer.y / magnitude;
        Crafty.e('Projectile').move(self.x, self.y).velocity(vx * 10, vy * 10);
        self.lastFired = now;
      }
    });
  }
});

Crafty.c('Projectile', {
  init: function() {
    this.requires('Actor').size(8, 8).color('red');
    var self = this;

    this.collide('Player', function() {
      Crafty('Player').hurt(extern("damage").archer);
      self.die();
    });

    this.collide('Tree', function() {
      self.die();
    });

    this.collide('Sword', function() {
      self.die();
    })
  }
});
