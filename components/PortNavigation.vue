<script setup lang="js">
import { ref } from "vue";

// a sample list of items with an index to keep track of the active item
const activeItem = ref(-1);
let itemIdx = 0;
const items = ref([
  { id: itemIdx++, name: "Home", path: "/" },
  { id: itemIdx++, name: "About", path: "/about" },
  { id: itemIdx++, name: "Projects", path: "/projects" },
  { id: itemIdx++, name: "Contact", path: "/contact" },
  { id: itemIdx++, name: "Blog", path: "/blog" },
  { id: itemIdx++, name: "Resume", path: "/resume" },
]);
</script>

<template>
  <nav>
    <ul>
      <li v-for="item in items" :key="item.id" :class="{ active: activeItem === item.id }" @click="activeItem = item.id">
        {{ item.name }}
      </li>
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