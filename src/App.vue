<template>
  <div class="v-application">
    <!-- <div id="nav"></div> -->
    <router-view />
  </div>
</template>

<script>
import demoData from "@/demo.json";

export default {
  mounted() {
    document.body.setAttribute("data-app", true);

    // Load demo data
    this.$store.replaceState(demoData);
  }
};
</script>

<style lang="scss">
:root {
  color: var(--text-color);
  background: var(--background-color);

  overflow: hidden;
}
</style>
