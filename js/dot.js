var Dot = function(x, y) {
  this.x = x;
  this.y = y;

  this.defaultRadius = 2;
  this.radius = this.defaultRadius;

  this.speed = 6;
}

Dot.prototype = {

  swell: function() {
    var targetRadius = 10;

    var swellUp = function() {
      window.requestAnimationFrame(function(){
        this.radius += 0.5;

        if (this.radius >= targetRadius) {
          swellDown();
        } else {
          swellUp();
        }
      }.bind(this));
    }.bind(this);

    var swellDown = function() {
      window.requestAnimationFrame(function(){
        this.radius -= 0.5;

        if (this.radius<= this.defaultRadius) {
          this.radius = 2;
        } else {
          swellDown();
        }
      }.bind(this));
    }.bind(this);

   swellUp();
  }
}
