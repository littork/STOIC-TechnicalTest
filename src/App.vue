<template>
  <div class="v-application">
    <!-- <div id="nav"></div> -->
    <router-view />
  </div>
</template>

<script>
export default {
  mounted() {
    document.body.setAttribute("data-app", true);
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
