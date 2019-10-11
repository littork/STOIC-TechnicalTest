<template>
  <div class="home">
    <!-- <CircosDisplay /> -->
    <DataSetPicker />
  </div>
</template>

<script>
import CircosDisplay from "@/components/CircosDisplay";
import DataSetPicker from "@/components/DataSetPicker";

export default {
  name: "Home",
  components: {
    CircosDisplay,
    DataSetPicker
  }
};
</script>
