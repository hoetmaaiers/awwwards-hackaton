// (function(){

var canvas = document.getElementById('dots'),
    ctx = canvas.getContext('2d'),
    fps = 60;

canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;

var dots = [],
    maestro = null

init();

function init() {
  setupDots();
  setupMaestro();

  drawDots();
  drawMaestro();

  render();
}

function setupDots() {
  _.times(10, function(n) {
    console.log("create dot");
    console.log(n/10);

    dots.push({
      x: 50 + canvas.width * (n / 10),
      y: canvas.height / 2,
      radius: 10,
      color: "yellow"
    })
  });
}

function setupMaestro() {
  maestro = {
    x: -20,//canvas.width / 2 ,
    y: (canvas.height / 2) - 50,
    radius: 20,
    color: "blue"
  }

  // setInterval(function() {
  //   // maestro.x = Math.round(event.x);
  // }, 1000/30);
  document.addEventListener('mousemove', function(event) {
    maestro.x = Math.round(event.x);
  });
}

function updateMaestro() {
  // maestro.x += 6;

  // if(maestro.x > canvas.width){
  //   maestro.x = maestro.radius *-1;
  // }

  /*
  if(maestro.x < maestro.radius *-1){
    maestro.x = canvas.width + 20;
  }
  */
}

function render() {
  setTimeout(function() {
    window.requestAnimationFrame(function() {
      ctx.globalAlpha = 1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drawDots();
      drawMaestro();

      updateDots();
      updateMaestro();

      render();
    });
  }.bind(this), 1000 / fps);
}

function updateDots() {
  _.forEach(dots, function(dot, i) {
    // console.log("update dots, maestro"  + maestro.x);
    distance = horDistance(maestro, dot);

    var maxDistance = 100;

    if (distance < maxDistance) {
      //console.log("#" + i + " distance: " + distance);
      dot.color = "green";
      dot.y = (canvas.height / 2) + ((maxDistance - distance)/maxDistance)*100;
    } else {
      dot.color = "yellow"
      dot.y = (canvas.height / 2);
    }
  }, this);
}

function drawDots() {
  _.forEach(dots, function(dot) {
    ctx.globalAlpha = 1;
    ctx.fillStyle = dot.color;
    ctx.fillRect(dot.x, dot.y, dot.radius, dot.radius);
  });
}

function drawMaestro() {
  ctx.globalAlpha = 1;
  ctx.fillStyle = maestro.color;
  ctx.fillRect(maestro.x, maestro.y, maestro.radius, maestro.radius);
}

function lineDistance( p1, p2 ) {
  var dx = p2.x - p1.x;
  var dy = p2.y - p1.y;
  var distance = Math.sqrt(dx*dx + dy*dy);

  return distance;
}

function horDistance(p1,p2) {
  return Math.abs(p2.x - p1.x);
}
// }());
