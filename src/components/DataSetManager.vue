<template>
  <v-card class="mr-auto" width="300px" outlined>
    <DataSetPicker class="py-6" />
    <DataSetLister />
  </v-card>
</template>

<script>
import DataSetPicker from "@/components/DataSetPicker";
import DataSetLister from "@/components/DataSetLister";

export default {
  name: "DataSetManager",
  components: {
    DataSetPicker,
    DataSetLister
  }
};
</script>

<style lang="scss" scoped>
</style>