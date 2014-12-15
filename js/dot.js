var Dot = function(x, y) {
  this.x = x;
  this.y = y;
  this.stackOrder = 0;
  this.visible = true;

  this.defaultRadius = 5;
  this.radius = this.defaultRadius;
  // this.color = "white";
  this.opacity = 1;

  this.speed = 6;

  this.colors = [
    "#46B6AE",
    "#A4E8E3",
    "#6ED0C9",
    "#289C94",
    "#0B9086",

    "#5679C0",
    "#ADC2EC",
    "#7B9AD7",
    "#385EA9",
    "#1A469C",

    "#62DD55",
    "#B3F4AC",
    "#86E97B",
    "#44D036",
    "#1FC00E"

    // "lightyellow",
    // "red",
    // "orange",
    // "yellow",
    // "lightgreen",
    // "green",
    // "coral",
    // "pink",
    // "tomato"

    // "#0DFF60",
    // "0CE896",
    // "0CC0E8",
    // "0D94FF",
  ]
}

Dot.prototype = {
  color: function() {
    // console.log(this.stackOrder);
    return this.colors[this.stackOrder];
    // return '#'+Math.floor(Math.random()*16777215).toString(16);
  },
  moveTo: function(targetX, targetY, time, callback) {
    $(this).animate({
      x: targetX,
      y: targetY
    }, time, function() {
      callback();
    });
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
};
