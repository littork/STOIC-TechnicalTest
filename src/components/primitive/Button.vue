<template>
  <div v-on="$listeners">
    <button class="custom-button">
      <slot />
    </button>
  </div>
</template>

<script>
export default {
  name: "Button"
};
</script>

<style lang="scss" scoped>
.custom-button {
  border-radius: 8px;

  padding: 4px 8px 4px 8px;
}
</style>
