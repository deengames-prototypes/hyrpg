Crafty.c('Monster', {
  init: function() {
    var self = this;
    this.moveStep = 1;
    this.requires('Actor');
    var x = randomBetween(0, Game.width - this.attr('w'));
    var y = randomBetween(0, Game.height - this.attr('y'));
    this.move(x, y);
    this.bind('EnterFrame', this.moveTowardDestination);
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
  }
});

Crafty.c('Sheep', {
  init: function() {
    this.requires('Monster').size(32, 32).color('white');
    this.moveStep = 10;
    var self = this;

    this.repeatedly(randomBetween(3, 5), function() {
      self.pickRandomSpot();
    });
  }
});

Crafty.c('Slime', {
  init: function() {
    this.requires('Monster').size(40, 32).color('#88ff88');
    this.moveStep = 3;
    var self = this;

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
      } else {
        if (self.destination == p) {
          self.destination = null;
        } else {
          self.moveTowardDestination();
        }
      }
    });
  }
});
