<template>
  <NuxtLayout>
    <div id="content"></div>
  </NuxtLayout>
</template>

<style lang="scss">
@use "~/assets/scss/variables" as *;
@import "~/assets/scss/main.scss";

#content {
  background-color: $nord-a-400;
  min-width: 200px;
  min-height: 200px;
}
</style>