<script setup lang="js">
import { ref, provide, onMounted } from "vue";
import navData from "~/assets/json/nav-data.json";

// a sample list of items with an index to keep track of the active item
let itemIdx = 0;
const activeItem = ref(itemIdx);
const setActiveItem = (id) => { activeItem.value = id; };
const items = ref(navData.map(
  (item) => {
    return { id: itemIdx++, name: item.name, path: item.path };
  }
));

// handle keypresses (arrow keys) to navigate the list of items
function handleKeyPress(event) {
  console.log(event.key);

  switch (event.key) {
    case "ArrowUp":
      if (activeItem.value > 0) {
        activeItem.value--;
      }
      break;
    case "ArrowDown":
      if (activeItem.value < items.value.length - 1) {
        activeItem.value++;
      }
      break;
    case "ArrowLeft":
      if (activeItem.value > 0) {
        activeItem.value--;
      }
      break;
    case "ArrowRight":
      if (activeItem.value < items.value.length - 1) {
        activeItem.value++;
      }
      break;
  }
}

// provide the active item and the list of items to the components that need it
provide("activeItem", { activeItem, setActiveItem });
provide("items", items);

// focus the content div when the page loads
const contentRef = ref(null);
onMounted(() => {
  contentRef.value.focus();
});
</script>

<template >
  <NuxtLayout>
    <div id="content" ref="contentRef" @keydown="handleKeyPress" tabindex="0">
      <ContentDoc :path="items[activeItem].path" />
    </div>
  </NuxtLayout>
</template>

<style lang="scss">
@use "~/assets/scss/variables" as *;
@import "~/assets/scss/main.scss";

#content {
  outline: unset;

  blockquote {
    background-color: $nord-pn-200;
    padding: .5rem 1rem;
    width: max-content;
    white-space: pre-wrap;
  }

  pre {
    background-color: $black-opacity-25;
    padding: .5rem 1rem;
    width: max-content;
  }

  $border-color: $nord-f-400;
  $border-width: 6px;
  $padding-left: 1rem;

  @for $i from 1 through 6 {
    h#{$i} {
      border-left: calc(#{$border-width} - #{$i}px + 1px) solid $border-color;
      padding-left: $padding-left;
      color: $nord-f-300;

      a {
        color: inherit;
      }
    }
  }

  img {
    max-width: 40vw;
    max-height: 40vh;
  }
}
</style>