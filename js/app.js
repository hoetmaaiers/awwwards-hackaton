// (function(){

$('#dots, #mask').height(window.innerHeight);

var maskCanvas = document.getElementById('mask'),
    maskContext = maskCanvas.getContext('2d'),

    canvas = document.getElementById('dots'),
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

  while ((yPosition + (ySpacing * row)) < canvas.height) {
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

      drawDots();
      moveDotsToMiddle();

      render();
    });
  }.bind(this), 1000 / fps);
};


function drawDots() {
  ctx.globalAlpha = 0.025;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  _.forEach(dots, function(dot) {
    ctx.globalAlpha = 1;
    ctx.fillStyle = "white";
    // ctx.fillRect(dot.x, dot.y, dot.radius, dot.radius);
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
    ctx.closePath();

    ctx.fill();
    // ctx.stroke();
  });
}

function moveDotsToMiddle() {

  _.forEach(dots, function(dot) {

    var targetY = Math.round(canvas.height / 2);

    // if remaning is smaller then speed, use remaining
    speed = dot.speed;

    remaining = Math.abs(dot.y - targetY);
    if (remaining < dot.speed) { speed = remaining; }

    if (dot.y > targetY) { dot.y -= speed; }
    if (dot.y < targetY) { dot.y += speed; }

    if (!dot.swelled && dot.y == targetY) {
      dot.swelled = true;
      dot.swell();
    }
  });
}


function hideOriginalDots() {
  // console.log("hideOriginalDots");
  maskContext.fillStyle = originalDotColor;
  maskContext.globalAlpha = 1;//0.025;
  maskContext.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
}


function setupCanvasSize() {
  maskCanvas.width = window.innerWidth;
  maskCanvas.height = window.innerHeight;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

// }());
