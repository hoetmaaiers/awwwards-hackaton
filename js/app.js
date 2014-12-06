// (function(){

var canvas = document.getElementById('myCanvas'),
    ctx = canvas.getContext('2d'),
    fps = 60,
    originalDotColor = "#46b6ac",

    dots = [];

init();


function init() {
  setupCanvasSize();
  $(window).on('resize', setupCanvasSize);

  setupDots();

  render();
}


function setupDots() {
  var xPosition = -18,
      yPosition = 16,
      xSpacing = 35,
      ySpacing = 27,
      row = 0;

  while ((yPosition * row) < canvas.height) {
    xPosition += xSpacing;

    if (xPosition > canvas.width) {
      row += 1;
      xPosition = -18;
    }

    var dot = new Dot(xPosition, yPosition + (ySpacing * row));
    dots.push(dot);
  }
}

function render() {
  setTimeout(function() {
    window.requestAnimationFrame(function() {

      hideOriginalDots();

      updateDots();
      drawDots();

      render();
    });
  }, 1000 / fps);
};




function hideOriginalDots() {
  ctx.fillStyle = originalDotColor;
  ctx.globalAlpha = 0.025;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

}

function updateDots() {}

function drawDots() {
  _.forEach(dots, function(dot) {
    ctx.globalAlpha = 1;
    ctx.fillStyle = "white";
    ctx.fillRect(dot.x, dot.y, 2, 2);
  });
}

function setupCanvasSize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

// }());
