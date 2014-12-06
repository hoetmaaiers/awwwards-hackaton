(function(){

var canvas = document.getElementById('myCanvas'),
    ctx = canvas.getContext('2d'),
    fps = 30,
    showOriginalDots = false,
    dotColor = "#599A90";

setupCanvasSize();
init();


function init() {
  $(window).on('resize', setupCanvasSize);
  render();
}

function render() {
  setTimeout(function() {
    window.requestAnimationFrame(function() {

      // updateCanvas();
      // updateObjects();
      // drawObjects();

      drawDots();

      displayOriginalDots();
      render();
    });
  }, 1000 / fps);
};


function displayOriginalDots() {
  ctx.fillStyle = dotColor;
  ctx.globalAlpha = 0.025;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawDots() {
  // console.log("draw dots");
}

function setupCanvasSize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

}());
