Crafty.c('Monster', {
  init: function() {
    var self = this;
    this.text = Crafty.e('Text2');

    this.moveStep = 1;
    this.requires('Actor');
    var x = randomBetween(0, Game.width - this.attr('w'));
    var y = randomBetween(0, Game.height - this.attr('y'));
    this.move(x, y);

    this.bind('EnterFrame', function() {
      this.moveTowardDestination();
      this.text.attr("x", this.attr("x"));
      this.text.attr("y", this.attr("y"));
    });

    // List of things you can't intersect
    this.collideWith('Tree');
    this.collideWith('Monster');
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
    }
  }
});

Crafty.c('Sheep', {
  init: function() {
    this.requires('Monster').size(32, 32).color('white');
    this.moveStep = 5;
    this.health(20);
    var self = this;

    this.repeatedly(randomBetween(3, 5), function() {
      if (!this.isCharging) {
        self.pickRandomSpot();
      }
    });

    this.bind('EnterFrame', function() {
      var p = Crafty('Player');
      var d = Math.abs(self.attr('x') - p.attr('x')) + Math.abs(self.attr('y') - p.attr('y'));

      if (!self.isCharging && d <= 200)
      {
        self.destination = { x: p.x, y: p.y };
        self.isCharging = true;
        this.moveStep = 1;
        this.color('yellow');
      } else if (self.isCharging && self.destination != null && Math.abs(self.attr('x') - self.destination.x) +
        Math.abs(self.attr('y') - self.destination.y) <= 10) { // reached destination
        self.destination = null;
        self.isCharging = false;
        this.moveStep = 5;
        this.color('white');
      }

      self.moveTowardDestination();
    });
  }
});

Crafty.c('Slime', {
  init: function() {
    this.requires('Monster').size(48, 48).color('#88ff88');
    this.moveStep = 3;
    var self = this;
    this.health(50);

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
