// (function(){

$('#dots, #mask').height(window.innerHeight);

var maskCanvas = document.getElementById('mask'),
    maskContext = maskCanvas.getContext('2d'),

    canvas = document.getElementById('dots'),
    ctx = canvas.getContext('2d'),
    fps = 60,
    originalDotColor = "#46b6ac",

    dots = [],
    maestro = null;

init();


function init() {
  setupCanvasSize();
  $(window).on('resize', setupCanvasSize);

  setupDots();
  render();

  setTimeout(function() {
    moveDotsToMiddle();
  }, 1000);

  leadMaestro();
}


function leadMaestro() {
  // $(document).on('mouseMove')
  document.addEventListener('mousemove', function(event) {
    maestro.x = event.x;
  })
}

function render() {
  setTimeout(function() {
    window.requestAnimationFrame(function() {

      hideOriginalDots();
      drawDots();
      drawMaestro();

      render();
    });
  }.bind(this), 1000 / fps);
};


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
    dot.stackOrder = row;
    dots.push(dot);
  }
}


function setupMaestro() {
  maestro = new Maestro(canvas.width / 2, (canvas.height / 2) - 40)
  maestro.color = '#F3CC60';
}



function drawDots() {
  // // Trail
  // ctx.globalAlpha = 0.66;
  // ctx.fillStyle = originalDotColor;
  // ctx.fillRect(0,0, canvas.width, canvas.height);
  // ctx.globalAlpha = 1;

  ctx.globalAlpha = 0.025;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  _.forEach(dots, function(dot) {
    ctx.globalAlpha = 1;
    ctx.fillStyle = dot.color;
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
    ctx.closePath();

    ctx.fill();
  });
}


function drawMaestro() {
  if (maestro) {
    ctx.globalAlpha = 1;
    ctx.fillStyle = maestro.color;
    ctx.beginPath();
    ctx.arc(maestro.x, maestro.y, maestro.radius, 0, Math.PI * 2);
    ctx.closePath();

    ctx.fill();
  }
}

function moveDotsToMiddle() {
  _.forEach(dots, function(dot) {
    var targetY = Math.round(canvas.height / 2);
    dot.moveToY(targetY, 300, function() {
      dot.swell();
      setupMaestro();
    });
  });
}


function hideOriginalDots() {
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
