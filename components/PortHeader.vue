<script setup lang="js">
import { ref, provide } from "vue";

const header = ref(null);
const logo = ref(null);

provide("refs", { header, logo });
</script>

<template>
  <header ref="header">
    <div ref="logo" id="logo">
      <img src="~/assets/img/logo_chamaeleon.svg" />
    </div>
  </header>

  <PortNavCat />
</template>

<style lang="scss">
@use "~/assets/scss/variables" as *;

header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: $nord-ss-300;
  height: $header-height;
  display: flex;
  justify-content: center;
  box-shadow: $default-shadow;

  #logo {
    height: $header-logo-height;
    padding: 1rem 2rem 2rem;
    background-color: $nord-ss-300;
    border-radius: 50%;
    box-shadow: 0 1rem 1rem -1rem #0005;

    img {
      height: inherit;
    }
  }
}
</style>