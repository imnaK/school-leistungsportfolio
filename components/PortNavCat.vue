<script setup lang="js">
import { ref } from "vue";

// cat sprite is 96px wide, 64px tall and has 32px * 32px per frame. top row is walking left, bottom row is walking right. middle frame of both rows is also standing still (idle)
const cat = ref(0);
const states = ["idle", "walk-left", "walk-right"];
// current state of the cat, which will be used in calculation of the background-position (current row)
let currentState = states[0];
// current index of the current state, which will be used in calculation of the background-position (current frame)
let currentFrame = 0;
// tells how long the current state will remain active until the next state is selected
let stateTimer = 1000;
let catPos = 0;
let speed = .2;

// make a game loop that does the following: check if a new state is needed (stateTimer <= 0), if so, select a new state and reset the stateTimer to a random milliseconds number between 1 and 5 seconds. move the cats position by the speed variable in the direction of the current state. update the background-position of the cat sprite to the current state and frame.

function updateState() {
  // check if a new state is needed (stateTimer <= 0), if so, select a new state and reset the stateTimer to a random milliseconds number between 1 and 5 seconds.
  if (stateTimer <= 0) {
    // select a new state
    currentState = states[Math.floor(Math.random() * states.length)];
    // reset the stateTimer to a random milliseconds number between 1 and 5 seconds
    stateTimer = Math.floor(Math.random() * 4000) + 1000;
  }

  // update the stateTimer
  stateTimer -= speed * 1000;
}

function updateCatPosition() {
  // move the cats position by the speed variable in the direction of the current state
  if (currentState === "walk-left") {
    cat.value.style.left -= speed;
  } else if (currentState === "walk-right") {
    cat.value.style.left += speed;
  }
}

function renderCatPosition() {
  // update the background-position of the cat sprite to the current state and frame
  if (currentState === "idle") {
    currentFrame = 1;
  } else if (currentState === "walk-left") {
    currentFrame = Math.floor(cat.value / 32) % 3;
  } else if (currentState === "walk-right") {
    currentFrame = Math.floor(cat.value / 32) % 3;
  }

  // update the background-position of the styles of the cat sprite by vue ref
  cat.value.style.backgroundPosition = `${-currentFrame * 32}px ${states.indexOf(currentState) * 32}px`;
}

function animateCat() {
  updateState();
  updateCatPosition();
  renderCatPosition();

  requestAnimationFrame(animateCat);
}

animateCat();
</script>

<template>
  <div id="port-nav-cat" ref="cat"></div>
</template>

<style scoped lang="scss">
@use "~/assets/scss/variables" as *;

$cat-size: 32px;
$cat-feet-offset: 5px;

#port-nav-cat {
  position: fixed;
  top: calc($header-height - $cat-size + $cat-feet-offset);
  left: 0;

  width: $cat-size;
  height: $cat-size;
  // background-color: $nord-f-400;
  background-image: url("/img/cat_sprite.png");
  background-position: -64px -32px;
  background-repeat: no-repeat;
}
</style>