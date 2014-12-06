var Dot = function(x, y) {
  this.x = x;
  this.y = y;
  this.stackOrder = 0;

  this.defaultRadius = 2;
  this.radius = this.defaultRadius;
  this.color = "white";

  this.speed = 6;
}

Dot.prototype = {
  moveToY: function(targetY, time, callback) {
    var distance = Math.abs(this.y - targetY),
        speed    = distance / 24;

    var move = function(targetY) {

      setTimeout(function() {
        window.requestAnimationFrame(function(){
          var remaining = Math.abs(this.y - targetY);

          if (remaining < speed) { speed = remaining; }
          if (this.y > targetY) { this.y -= speed; }
          if (this.y < targetY) { this.y += speed; }

          if (this.y == targetY) {
            // arrived at position

            if (this.stackOrder == 5) { callback() }
          } else {
            move.bind(this)(targetY);
          }
        }.bind(this));

      }.bind(this), time/60);
    }

    move.bind(this)(targetY);

    // // if remaning is smaller then speed, use remaining
    // speed = dot.speed;

    // remaining = Math.abs(dot.y - targetY);

    // if (!dot.swelled && dot.y == targetY) {
    //   dot.swelled = true;
    //   dot.swell();
    // }
  },

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

        if (this.radius<= 5) {
          this.radius = 5;
        } else {
          swellDown();
        }
      }.bind(this));
    }.bind(this);

   swellUp();
  }
}
