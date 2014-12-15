// (function(){

$(document).ready(function() {
  init();
});

$('#dots, #mask').height(window.innerHeight);

var maskCanvas = document.getElementById('mask'),
    maskContext = maskCanvas.getContext('2d'),

    canvas = document.getElementById('dots'),
    ctx = canvas.getContext('2d'),
    fps = 60,
    originalDotColor = "#46b6ac",

    dots = [],
    visibleDots = [],
    maestro = null;



function init() {
  setupCanvasSize();
  $(window).on('resize', setupCanvasSize);

  setupDots();


  setTimeout(function() {
    moveDotsToMiddle();
  }.bind(this), 1000);

  setTimeout(function() {
    setupMaestro();
  }.bind(this), 2500);

  render();
}


function render() {
  setTimeout(function() {
    window.requestAnimationFrame(function() {

      ctx.globalAlpha = 0.025;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      hideOriginalDots();
      updateDots();

      drawDots();
      drawMaestro();

      render();
    }.bind(this));
  }.bind(this), 1000 / fps);
};


function setupDots() {
  var xPosition = -18,
      yPosition = 16,
      xSpacing = 35,
      ySpacing = 27,
      row = 0,
      column = 0;

  while ((yPosition + (ySpacing * row)) <  canvas.height) {
    column++;
    xPosition += xSpacing;

    if (xPosition > canvas.width) {
      column = 1;
      row += 1;
      xPosition = -18;
    }

    var dot = new Dot(xPosition, yPosition + (ySpacing * row));
    dot.stackOrder = row;
    dot.column = column;
    dot.radius = 1;
    dots.push(dot);
  }

  // define stack size
  stackSize = _.chain(dots).map(function(dot) {
    return dot.stackOrder;
  }).uniq().value().length;

  // define column size
  columnSize = _.chain(dots).map(function(dot) {
    return dot.column;
  }).uniq().value().length;
}

function setupMaestro() {
  maestro = new Maestro();
  maestro.x = canvas.width / 2;
  maestro.y = (canvas.height / 2) - 40
  maestro.radius = 1;
  maestro.color = '#F3CC60';

  leadMaestro();
  enterMaestro();
}

function leadMaestro() {
  document.addEventListener('mousemove', function(event) {
    maestro.x = event.x;
  });
}

function enterMaestro() {
  maestroTarget = (canvas.height / 2) - 40;

  if (maestro) {
    $(maestro).animate({ radius: 20 }, 300, 'easeOutBounce');
  }
}



function horDistance(p1,p2) {
  return Math.abs(p2.x - p1.x);
}

function lineDistance( p1, p2 ) {
  var dx = p2.x - p1.x;
  var dy = p2.y - p1.y;
  var distance = Math.sqrt(dx*dx + dy*dy);

  return distance
}

function updateDots() {

  if (maestro) {

    _.forEach(dots, function(dot) {
      distance = lineDistance(maestro, dot);
      horizontalDistance = horDistance(maestro, dot);

      var maxDistance = 200;

      if (horizontalDistance < maxDistance) {
        targetY = (canvas.height / 2) + ((maxDistance - horizontalDistance) / 8);
        targetY -= (dot.stackOrder + 1) * ((horizontalDistance / maxDistance) - 1);

        // apply stackorder
        $(dot).animate({ y: targetY }, {duration: 50}, 'easeInElastic');
        dot.y = targetY;

      } else {
        dot.y = (canvas.height / 2);
        dot.visualY = dot.y;
      }
    });
  }
}

function drawDots() {
  // Trail
  ctx.globalAlpha = 0.66;
  ctx.fillStyle = originalDotColor;
  ctx.fillRect(0,0, canvas.width, canvas.height);
  ctx.globalAlpha = 1;

  _.forEach(visibleDots, function(dot) {
    ctx.globalAlpha = dot.opacity;
    ctx.fillStyle = dot.color();
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
    var targetX = Math.round(canvas.width / 2);
    var targetY = Math.round(canvas.height / 2);
    dot.moveTo(targetX, targetY, 900, function() {
      dot.swell();
      if (dot.stackOrder < 9) {
        visibleDots.push(dot);
      }
    });
  });

  setTimeout(function() {
    columnSpacing = 30;
    _.forEach(visibleDots, function(dot) {
      dot.x = (canvas.width / 2 - ((columnSize * columnSpacing) / 2)) + (columnSpacing * dot.column);
    });

  }, 1000);
}


function hideOriginalDots() {
  maskContext.fillStyle = originalDotColor;
  maskContext.globalAlpha =   0.025;
  maskContext.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
}


function setupCanvasSize() {
  maskCanvas.width = window.innerWidth;
  maskCanvas.height = window.innerHeight;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

// }());
