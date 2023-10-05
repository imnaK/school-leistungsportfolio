<script setup lang="js">
import { computed, inject } from "vue";
import backgroundImages from "~/assets/json/background-images.json";

const { activeItem } = inject("activeItem");

function sfc32(a, b, c, d) {
  a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0;
  var t = (a + b) | 0;
  a = b ^ b >>> 9;
  b = c + (c << 3) | 0;
  c = (c << 21 | c >>> 11);
  d = d + 1 | 0;
  t = t + d | 0;
  c = c + t | 0;
  return (t >>> 0) / 4294967296;
}

let lastRandom = 42;

function randomPercent(seed1, seed2) {
  let random = (sfc32(seed1, seed2, 42, lastRandom) * 100).toString().slice(-2);
  lastRandom = parseInt(random);
  return random;
}

// computedImages with pseudo randomness of location from top and left based on image index and active item
const computedImages = computed(() => {
  return backgroundImages.map((img, idx) => {

    return {
      ...img,
      style: {
        width: img.width + "px",
        height: img.height + "px",
        left: randomPercent(activeItem.value | 1 * 123, idx) + "%",
        top: randomPercent(activeItem.value | 1 * 321, idx) + "%",
      },
    };
  });
});
</script>

<template>
  <div id="background">

    <img v-for="(img, idx) in computedImages" :src="img.src" :alt="img.alt" :style="img.style">
  </div>
</template>

<style lang="scss">
@use "~/assets/scss/variables" as *;

#background {
  overflow: hidden;
  background-color: $nord-pn-100;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;

  img {
    position: absolute;
    transition: 1s ease-in-out;
  }
}
</style>
