<script setup lang="js">
import { ref } from "vue";

// cat sprite is 96px wide, 64px tall and has 32px * 32px per frame. top row is walking left, bottom row is walking right. middle frame of both rows is also standing still (idle)
const cat = ref(null);
const debug = false;
const STATE_IDLE = 0;
const STATE_WALK_LEFT = 1;
const STATE_WALK_RIGHT = 2;
let currentState = STATE_IDLE;
let lastState = STATE_IDLE;
let currentFrame = 0; // current index of the current state, which will be used in calculation of the background-position (current frame)
let stateTimer = 12000; // tells how long the current state will remain active until the next state is selected
let catPos = 0;
let speed = 50; // pixels per second
let pong = false; // switches if hits last or first frame to go back or forward in the sprite for walking animation
let catSize = 64;

// make a game loop that does the following: check if a new state is needed (stateTimer <= 0), if so, select a new state and reset the stateTimer to a random milliseconds number between 1 and 5 seconds. move the cats position by the speed variable in the direction of the current state. update the background-position of the cat sprite to the current state and frame.

function updateState(deltaTime) {
  // check if a new state is needed (stateTimer <= 0), if so, select a new state and reset the stateTimer to a random milliseconds number between 1 and 5 seconds.
  if (stateTimer <= 0) {
    lastState = currentState;
    // select a new state
    currentState = Math.floor(Math.random() * 3);
    // reset the stateTimer to a random milliseconds number between 1 and 5 seconds
    stateTimer = Math.floor(Math.random() * 4000) + 2000;
  }

  // update the stateTimer
  stateTimer -= deltaTime;
}

function updateCatPosition(deltaTime) {
  let velocity = speed * (deltaTime / 1000);

  // move the cats position by the speed variable in the direction of the current state
  if (currentState === STATE_WALK_LEFT) {
    catPos -= velocity;
  } else if (currentState === STATE_WALK_RIGHT) {
    catPos += velocity;
  }

  if (catPos < -catSize) {
    catPos = window.innerWidth;
  } else if (catPos > window.innerWidth + catSize) {
    catPos = -catSize;
  }
}

function renderCatPosition() {
  // update the background-position of the cat sprite to the current state and frame
  if (currentState === STATE_IDLE) {
    currentFrame = 1;
  } else if (currentState === STATE_WALK_LEFT || currentState === STATE_WALK_RIGHT) {
    currentFrame += pong ? 1 : -1;

    if (currentFrame === 0 || currentFrame === 2)
      pong = !pong;
  }

  let right = currentState === STATE_WALK_RIGHT;

  if (currentState === STATE_IDLE)
    right = lastState === STATE_WALK_RIGHT;

  // update the background-position of the styles of the cat sprite by vue ref
  cat.value.style.backgroundPosition = `${-currentFrame * catSize}px ${right ? -catSize : 0}px`;
  // update the left position of the styles of the cat sprite by vue ref
  cat.value.style.left = `${catPos}px`;
}

function debugCat() {
  let catDebugStatue = {
    currentState: currentState,
    currentFrame: currentFrame,
    stateTimer: stateTimer,
    catPos: catPos,
  };
  console.table(catDebugStatue);
}

let lastTime = 0;
let deltaTime = 0;
let fps = 5;
let interval = 1000 / fps;

function animateCat(timeStamp) {
  deltaTime = timeStamp - lastTime;

  if (deltaTime > interval) {
    updateState(deltaTime);
    updateCatPosition(deltaTime);
    renderCatPosition();

    if (debug)
      debugCat();

    lastTime = timeStamp;
  }

  requestAnimationFrame(animateCat);
}

function setInitialCatStyles() {
  catPos = -catSize;

  cat.value.style.backgroundPosition = `${-currentFrame * catSize}px ${currentState === STATE_WALK_RIGHT ? -catSize : 0}px`;
  cat.value.style.left = `${catPos}px`;
  cat.value.style.opacity = 1;
}

onMounted(() => {
  setInitialCatStyles();
  animateCat();
});
</script>

<template>
  <div id="port-nav-cat" ref="cat"></div>
</template>

<style scoped lang="scss">
@use "~/assets/scss/variables" as *;

$cat-size: 64px;
$cat-feet-offset: calc($cat-size / 32 * 5);

#port-nav-cat {
  position: fixed;
  top: calc($header-height - $cat-size + $cat-feet-offset);
  left: 0;
  opacity: 0;

  width: $cat-size;
  height: $cat-size;
  background-image: url("/img/cat_sprite_64.png");
  background-repeat: no-repeat;
}
</style>