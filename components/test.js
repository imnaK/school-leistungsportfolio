// simple game loop with javascript (without anything, just game loop logic with delta time)

// game loop
var lastTime = performance.now();
var deltaTime = 0;
var fps = 5;
var interval = 1000 / fps;

function gameLoop(timeStamp = performance.now()) {
  let deltaTime = timeStamp - lastTime;
  let lastTime = timeStamp;

  if (deltaTime > interval) {
    update();
    draw();
  }

  requestAnimationFrame(gameLoop);
}

function update() {
  // update game logic
}

function draw() {
  // draw game
}

requestAnimationFrame(gameLoop);