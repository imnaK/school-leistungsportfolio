<script setup lang="js">
import { inject } from "vue";

const { activeItem, setActiveItem } = inject("activeItem");
const items = inject("items");
</script>

<template>
  <nav>
    <ul>
      <li v-for="item in items" :key="item.id" :class="{ active: activeItem === item.id }"
        @click="setActiveItem(item.id)">
        {{ item.name }}
      </li>
    </ul>
  </nav>
</template>

<style lang="scss">
@use "~/assets/scss/variables" as *;

nav {
  position: fixed;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  max-width: $navigation-width;

  ul {
    list-style: unset;
    padding: 0;
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
          background-color: $nord-f-400;
        }
      }
    }
  }
}
</style>