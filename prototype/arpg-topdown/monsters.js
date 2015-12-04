Crafty.c('Monster', {
  init: function() {
    var self = this;
    this.requires('Actor').size(32, 32).color('blue');
    var x = randomBetween(0, Game.width - this.attr('w'));
    var y = randomBetween(0, Game.height - this.attr('y'));
    this.move(x, y);

    this.repeatedly(randomBetween(3, 5), function() {
      self.pickRandomSpot();
    });

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
    var MOVE_STEP = 5;
    if (this.destination == null) { return; }

    if (Math.abs(this.attr('x') - this.destination.x) >= MOVE_STEP) {
      if (this.attr('x') < this.destination.x) {
        this.attr('x', this.attr('x') + MOVE_STEP);
      } else if (this.attr('x') > this.destination.x) {
        this.attr('x', this.attr('x') - MOVE_STEP);
      }
    }

    if (Math.abs(this.attr('y') - this.destination.y) >= MOVE_STEP) {
      if (this.attr('y') < this.destination.y) {
        this.attr('y', this.attr('y') + MOVE_STEP);
      } else if (this.attr('y') > this.destination.y) {
        this.attr('y', this.attr('y') - MOVE_STEP);
      }
    }
  }
});
