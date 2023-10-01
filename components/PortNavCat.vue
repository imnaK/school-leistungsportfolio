<script setup lang="js">
import { ref, inject } from "vue";

const { header, logo } = inject("refs");

// header, logo variables
let logoOffsetLeft, logoHeight, logoWidth, headerHeight, logoBnd;

// cat variables
const cat = ref(null);
const DEBUG = false;
const STATE_IDLE = 0;
const STATE_WALK_LEFT = 1;
const STATE_WALK_RIGHT = 2;
const catSize = 64;
const speed = 25; // pixels per second
const catFootSpace = 0.35;
const stateTimerMin = 5000; // milliseconds
const stateTimerMax = 15000; // milliseconds
let catXPos = 0; // left position of the cat
let catYOffset = 0; // top position of the cat
let catAngle = 0; // angle of the cat
let currentState = STATE_WALK_RIGHT;
let lastState = STATE_IDLE;
let stateTimer = stateTimerMax; // tells how long the current state will remain active until the next state is selected
let currentFrame = 1; // current index of the current state, which will be used in calculation of the background-position (current frame)
let pong = false; // switches if hits last or first frame to go back or forward in the sprite for walking animation

// game loop variables
const fps = 5;
const interval = 1000 / fps;
let lastTime = 0;
let deltaTime = 0;

function updateState(deltaTime) {
  // check if a new state is needed (stateTimer <= 0), if so, select a new state and reset the stateTimer to a random milliseconds number between 1 and 5 seconds.
  if (stateTimer <= 0) {
    lastState = currentState; // save the last state for the idle state looking direction
    currentState = Math.floor(Math.random() * 3); // select a new state
    stateTimer = Math.floor(Math.random() * (stateTimerMax - stateTimerMin)) + stateTimerMin; // set the stateTimer to a random number in milliseconds
  }

  stateTimer -= deltaTime; // update the stateTimer
}

class logoBounds {
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
    this.yOff = this.getYOffset(this.leftBound);

    this.inHeaderHeight = headerHeight < this.top || headerHeight > this.top + this.height;
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
  inBound(x) {
    if (this.inHeaderHeight) return false;
    if (x < this.left || x > this.left + this.width) return false;
    return x >= this.leftBound && x <= this.rightBound;
  }
  getY(absoluteX) {
    return this.getYOffset(absoluteX) - this.yOff;
  }
}

function moveByVelocity(velocity) {
  // move the cats position by the velocity variable in the direction of the current state (X axis)
  switch (currentState) {
    case STATE_WALK_LEFT:
      catXPos -= velocity;
      break;
    case STATE_WALK_RIGHT:
      catXPos += velocity;
      break;
  }
}

function updateCatPosition(deltaTime) {
  if (currentState === STATE_IDLE) return;

  let velocity = speed * (deltaTime / 1000);

  let leftX = catXPos + catSize * catFootSpace;
  let rightX = catXPos + catSize * (1 - catFootSpace);

  moveByVelocity((logoBnd.inBound(leftX) && logoBnd.inBound(rightX)) ? velocity * logoBnd.stretch : velocity);

  leftX = catXPos + catSize * catFootSpace;
  rightX = catXPos + catSize * (1 - catFootSpace);

  const leftFootInBound = logoBnd.inBound(leftX);
  const rightFootInBound = logoBnd.inBound(rightX);
  if (leftFootInBound || rightFootInBound) {
    const catLeftFoot = leftFootInBound ? logoBnd.getY(leftX) : 0;
    const catRightFoot = rightFootInBound ? logoBnd.getY(rightX) : 0;
    const heightDiff = catLeftFoot - catRightFoot;
    const widthDiff = catSize * (1 - catFootSpace * 2);
    catAngle = Math.atan(heightDiff / widthDiff);
    catYOffset = (catLeftFoot + catRightFoot) / 2;
    return;
  }

  catYOffset = 0;
  catAngle = 0;
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

    if (currentFrame !== 1)
      pong = !pong;
  }

  const right = currentState === STATE_IDLE ? lastState === STATE_WALK_RIGHT : currentState === STATE_WALK_RIGHT;
  // update the background-position of the styles of the cat sprite by vue ref
  cat.value.style.backgroundPosition = `${-currentFrame * catSize}px ${right ? -catSize : 0}px`;
  // update the left position of the styles of the cat sprite by vue ref
  cat.value.style.left = `${catXPos}px`;
  cat.value.style.top = `${headerHeight - catSize + catYOffset}px`;
  cat.value.style.transform = `rotate(${-catAngle}rad)`;
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
    if (DEBUG) debugCat();

    lastTime = timeStamp;
  }

  requestAnimationFrame(animateCat);
}

function setWindowVars() {
  logoOffsetLeft = logo.value.offsetLeft;
  logoHeight = logo.value.offsetHeight;
  logoWidth = logo.value.offsetWidth;
  headerHeight = header.value.offsetHeight;
  logoBnd = new logoBounds(logoOffsetLeft, 0, logoWidth, logoHeight, headerHeight);
}

function setInitialCatStyles() {
  catXPos = -catSize;

  cat.value.style.backgroundPosition = `${-currentFrame * catSize}px ${currentState === STATE_WALK_RIGHT ? -catSize : 0}px`;
  cat.value.style.transformOrigin = "bottom center";
  cat.value.style.left = `${catXPos}px`;
  cat.value.style.top = `${headerHeight - catSize + catYOffset}px`;
  cat.value.style.width = `${catSize}px`;
  cat.value.style.height = `${catSize}px`;
}

onMounted(() => {
  setWindowVars();
  setInitialCatStyles();
  animateCat();
  window.addEventListener("resize", setWindowVars);
});

onUnmounted(() => {
  window.removeEventListener("resize", setWindowVars);
});
</script>

<template>
  <div id="port-nav-cat" ref="cat"></div>
</template>

<style scoped lang="scss">
@use "~/assets/scss/variables" as *;

#port-nav-cat {
  position: fixed;

  background-image: url("/img/cat_sprite_64.png");
  background-repeat: no-repeat;
}
</style>