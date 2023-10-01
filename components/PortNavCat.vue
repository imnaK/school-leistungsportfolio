<script setup lang="js">
import { ref, inject } from "vue";

const { header, logo } = inject("refs");

// header, logo variables
let logoOffsetLeft, logoHeight, logoWidth, headerHeight, logoBound;

// cat variables
const cat = ref(null);
const debug = false;
const STATE_IDLE = 0;
const STATE_WALK_LEFT = 1;
const STATE_WALK_RIGHT = 2;
let currentState = STATE_WALK_RIGHT;
let lastState = STATE_IDLE;
let currentFrame = 1; // current index of the current state, which will be used in calculation of the background-position (current frame)
let stateTimer = 8000; // tells how long the current state will remain active until the next state is selected
let catXPos = 0;
let catYOffset = 0;
const speed = 50; // pixels per second
let pong = false; // switches if hits last or first frame to go back or forward in the sprite for walking animation
const catSize = 64;
const catFeetOffset = catSize / 32 * 5;

// game loop variables
let lastTime = 0;
let deltaTime = 0;
const fps = 5;
const interval = 1000 / fps;

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

class logoBounds {
  // ellipse shape
  constructor(left, top, width, height, headerHeight) {
    this.left = left;
    this.top = top;
    this.width = width;
    this.height = height;
    this.headerHeight = headerHeight;

    const perimeter = Math.PI * Math.sqrt((this.width * this.height) / 4);
    this.stretch = this.width / perimeter;
    this.w = this.width / 2;
    this.h = this.height / 2;
    this.hw = this.h / this.w;

    const xOff = this.width / 2 - this.getXOffset(headerHeight);
    this.leftBound = this.left + xOff;
    this.rightBound = this.left + this.width - xOff;

    this.inHeaderHeight = headerHeight < this.top || headerHeight > this.top + this.height;
  }
  isInBounds(x) {
    if (this.inHeaderHeight) return false;
    if (x < this.left || x > this.left + this.width) return false;
    return x >= this.leftBound && x <= this.rightBound;
  }
  getYOffset(absoluteX) {
    const x = absoluteX - this.left - this.w;
    if (x < -this.w || x > this.w) throw new Error("x is out of bounds");
    return Math.sqrt(this.w ** 2 - x ** 2) * this.hw;
  }
  getXOffset(absoluteY) {
    const y = absoluteY - this.top - this.h;
    if (y < -this.h || y > this.h) throw new Error("y is out of bounds");
    return Math.sqrt(this.w ** 2 - (y / this.hw) ** 2);
  }
}

function updateCatPosition(deltaTime) {
  let velocity = speed * (deltaTime / 1000);

  const catCenter = catXPos + catSize / 2;
  if (logoBound.isInBounds(catCenter)) {
    catYOffset = logoBound.getYOffset(catCenter);
    // cat is in bounds of the logo
    switch (currentState) {
      case STATE_WALK_LEFT:
        catXPos -= velocity * logoBound.stretch;
        break;
      case STATE_WALK_RIGHT:
        catXPos += velocity * logoBound.stretch;
        break;
    }
    return;
  }

  // move the cats position by the speed variable in the direction of the current state (X axis)
  catYOffset = 0;
  switch (currentState) {
    case STATE_WALK_LEFT:
      catXPos -= velocity;
      break;
    case STATE_WALK_RIGHT:
      catXPos += velocity;
      break;
  }
}

function checkCatOutOfBounds() {
  // check if cat is out of bounds and move it to the other side
  if (catXPos < -catSize) {
    catXPos = window.innerWidth;
  } else if (catXPos > window.innerWidth + catSize) {
    catXPos = -catSize;
  }
}

function renderCatPosition() {
  // update the background-position of the cat sprite to the current state and frame
  if (currentState === STATE_IDLE) {
    currentFrame = 1;
  } else {
    currentFrame += pong ? 1 : -1;

    if (currentFrame === 0 || currentFrame === 2)
      pong = !pong;
  }

  let right = currentState === STATE_IDLE ? lastState === STATE_WALK_RIGHT : currentState === STATE_WALK_RIGHT;

  // update the background-position of the styles of the cat sprite by vue ref
  cat.value.style.backgroundPosition = `${-currentFrame * catSize}px ${right ? -catSize : 0}px`;
  // update the left position of the styles of the cat sprite by vue ref
  cat.value.style.left = `${catXPos}px`;
  cat.value.style.top = `${headerHeight - catSize + catFeetOffset + catYOffset}px`;
}

function debugCat() {
  console.table({
    currentState,
    currentFrame,
    stateTimer,
    catXPos,
    catYOffset,
  });
}

function animateCat(timeStamp) {
  deltaTime = timeStamp - lastTime;

  if (deltaTime > interval) {
    updateState(deltaTime);
    updateCatPosition(deltaTime);
    checkCatOutOfBounds();
    renderCatPosition();

    if (debug)
      debugCat();

    lastTime = timeStamp;
  }

  requestAnimationFrame(animateCat);
}

function setInitialPositionVariables() {
  logoOffsetLeft = logo.value.offsetLeft;
  logoHeight = logo.value.offsetHeight;
  logoWidth = logo.value.offsetWidth;
  headerHeight = header.value.offsetHeight;
  logoBound = new logoBounds(logoOffsetLeft, 0, logoWidth, logoHeight, headerHeight);
}

function setInitialCatStyles() {
  catXPos = -catSize;

  cat.value.style.backgroundPosition = `${-currentFrame * catSize}px ${currentState === STATE_WALK_RIGHT ? -catSize : 0}px`;
  cat.value.style.left = `${catXPos}px`;
  cat.value.style.top = `${headerHeight - catSize + catFeetOffset + catYOffset}px`;
  cat.value.style.width = `${catSize}px`;
  cat.value.style.height = `${catSize}px`;
  cat.value.style.opacity = 1;
}

onMounted(() => {
  setInitialPositionVariables();
  setInitialCatStyles();
  animateCat();
});
</script>

<template>
  <div id="port-nav-cat" ref="cat"></div>
</template>

<style scoped lang="scss">
@use "~/assets/scss/variables" as *;

#port-nav-cat {
  position: fixed;
  left: 0;
  opacity: 0;

  background-image: url("/img/cat_sprite_64.png");
  background-repeat: no-repeat;
}
</style>