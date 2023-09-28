<template>
  <nav>
    <ul>
      <li>Lorem, ipsum.</li>
      <li>Voluptates, quia?</li>
      <li>Impedit, asperiores.</li>
      <li>Hic, suscipit.</li>
      <li>Harum, amet?</li>
      <li>Optio, suscipit.</li>
    </ul>
  </nav>
</template>

<style lang="scss">
@use "~/assets/scss/variables" as *;

nav {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);

  ul {
    display: flex;
    flex-direction: column;
    gap: .25rem;

    li {
      position: relative;
      color: $nord-ss-100;
      padding: .5rem 1rem .5rem 2rem;
      text-transform: uppercase;
      transition: $default-transition;
      cursor: pointer;

      &::before {
        content: "";
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: 0;
        width: 1rem;
        height: .25rem;
        background-color: $nord-ss-100;
        transition: $default-transition;
      }

      &.active,
      &:hover {
        font-weight: bold;
        padding: 1.5rem 1rem 1.5rem 3rem;
        color: inherit;
        font-size: 1.25rem;

        &::before {
          width: 2rem;
          background-color: $nord-a-300;
        }
      }
    }
  }
}
</style>