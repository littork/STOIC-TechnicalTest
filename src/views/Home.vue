<template>
  <div class="home">
    <VisualSettings class="visual-settings" />
    <CircosDisplay class="circos-display flex-center" />
  </div>
</template>

<script>
import CircosDisplay from "@/components/CircosDisplay";
import VisualSettings from "@/components/VisualSettings";

export default {
  name: "Home",
  components: {
    CircosDisplay,
    VisualSettings
  }
};
</script>

<style lang="scss" scoped>
.home {
  display: flex;
  flex-direction: row;

  width: 100vw;
}

.visual-settings {
  width: min-content;
  min-width: 700px;

  height: 100vh;

  border-radius: 0 4px 4px 0;
}

.circos-display {
  width: 100%;
  height: 100%;
}
</style>