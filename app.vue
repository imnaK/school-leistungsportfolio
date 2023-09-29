<script setup lang="js">
import { ref, provide } from "vue";
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

// provide the active item and the list of items to the components that need it
provide("activeItem", { activeItem, setActiveItem });
provide("items", items);
</script>

<template>
  <NuxtLayout>
    <div id="content">
      <ContentDoc :path="items[activeItem].path" />
    </div>
  </NuxtLayout>
</template>

<style lang="scss">
@use "~/assets/scss/variables" as *;
@import "~/assets/scss/main.scss";

#content {
  background-color: #fff1;
}
</style>