<template>
  <section>
    <slot name="content" />
    <slot name="image" />
  </section>
</template>

<style lang="scss" scoped>
section {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}
</style>