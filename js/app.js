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
    columnSize,
    columnSpacing = 30,
    visibleDots = [],
    maestro = null,
    dirigentRelative,

    lineWidth,
    lineX,
    lineY;



function init() {
  setupCanvasSize();
  $(window).on('resize', setupCanvasSize);

  dirigentRelative = { value: -1 };

  setupDots();

  manualMaestro = false;


  // Orchestration
  setTimeout(function() {
    moveDotsToMiddle(function() {
      activateVisualDots()
    });
  }.bind(this), 1000);

  setTimeout(function() {
    _.forEach(visibleDots, function(dot) {

      dot.animatedMove({
        x: lineX + (dot.column * columnSpacing),
        y: lineY
      });

    });
  }.bind(this), 3000);

  setTimeout(function() {
    setupMaestro();
  }.bind(this), 5000);


  render();
}

function activateVisualDots() {
  visibleDots = [];

  _.forEach(dots, function(dot) {
    if (dot.stackOrder < 7) {
      visibleDots.push(dot);
    }
  });
}

function render() {
  setTimeout(function() {
    window.requestAnimationFrame(function() {

      ctx.globalAlpha = 0.025;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      hideOriginalDots();
      updateObjects();

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
    dot.row = row;
    dot.radius = 1;
    dots.push(dot);
  }

  visibleDots = dots;

  // define stack size
  stackSize = _.chain(dots).map(function(dot) {
    return dot.stackOrder;
  }).uniq().value().length;

  // define column size
  columnSize = _.chain(dots).map(function(dot) {
    return dot.column;
  }).uniq().value().length;

  lineWidth = columnSize * columnSpacing;
  lineX = (canvas.width / 2) - (lineWidth / 2);
  lineY = canvas.height / 2;
}

function setupMaestro() {
  maestro = new Maestro();
  maestro.x = -100;//canvas.width / 2;
  maestro.y = (canvas.height / 2) - 40;
  maestro.radius = 15;
  maestro.color = '#fdee2f';

  dirigentRelative = { value: -1.2 };

  $(dirigentRelative).animate({
    value: 0
  }, {
    duration: 1500,
    easing: 'easeInOutBack',
    complete: function() {
      setTimeout(function(){
        leadMaestro();
      }.bind(this), 0);
    }
  })
  // leadMaestro();
}

function leadMaestro() {
  if (manualMaestro) {
    document.addEventListener('mousemove', function(event) {
      // maestro.value = event.x;
      dirigentRelative = { value: event.x };
    });
  } else {
    autoLeadMaestro();
  }
}

function autoLeadMaestro(direction) {
  dirigentRelative = { value: dirigentRelative.value };

  var rand = Math.random();
  var distance = Math.abs(dirigentRelative.value - rand);

  if (distance < 0.4){
    distance = 0.4;
  }

  if (direction === "left") {
    rand *= -1;
    nextDirection = "right";
  } else {
    nextDirection = "left";
  }

  $(dirigentRelative).animate(
    {
      value: rand
    },
    {
      duration: 1500 * distance,
      easing: 'easeInOutBack',
      complete: function(){
        autoLeadMaestro(nextDirection);
      }
    }
  );
}

// function enterMaestro() {
//   maestroTarget = (canvas.height / 2) - 40;

//   if (maestro) {
//     $(maestro).animate({ radius: 15 }, 300, 'easeOutBounce');
//   }
// }


function updateObjects() {

  lineWidth = columnSize * columnSpacing;
  lineX = (canvas.width / 2) - (lineWidth / 2);
  lineY = canvas.height / 2;

  _.forEach(dots, function(dot) {
    dot.tracker = {
      x: lineX + (dot.column * columnSpacing),
      y: lineY
    }

    if (maestro) {
      dot.move(dot.tracker);
      dot.follow(maestro);
    }
  });

  if (maestro) {
    if (manualMaestro) {
      maestro.x = dirigentRelative.value;
    }
    maestro.x = lineX + (lineWidth / 2) + ((lineWidth / 2) * dirigentRelative.value);
    maestro.y = window.innerHeight / 2 - 50;
  }
}

function drawDots() {
  // Trail
  // ctx.globalAlpha = 0.66;
  // ctx.fillStyle = originalDotColor;
  // ctx.fillRect(0,0, canvas.width, canvas.height);
  // ctx.globalAlpha = 1;

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
    ctx.arc(maestro.x, maestro.y, maestro.radius, 0, 2 * Math.PI, false);
    ctx.closePath();

    ctx.fill();
  }
}

function moveDotsToMiddle(complete) {
  var targetX = Math.round(canvas.width / 2);
  var targetY = Math.round(canvas.height / 2);

  var maxDelay = 1200;
  var maxDuration = 300;

  _.forEach(dots, function(dot) {
    var delay = Math.round(Math.random() * maxDelay);
    var duration = Math.round(Math.random() * maxDuration);

    setTimeout(function() {
      dot.moveTo(targetX, targetY, duration, function() {
        dot.swell();
      });
    }, delay);
  });

  setTimeout(function() {
    complete();
  }, (maxDuration + maxDelay));
}


function hideOriginalDots() {
  maskContext.fillStyle = "#602175";//originalDotColor;
  maskContext.globalAlpha =  0.15;
  maskContext.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
}


function setupCanvasSize() {
  maskCanvas.width = window.innerWidth;
  maskCanvas.height = window.innerHeight;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

// }());
