<template>
  <div>
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="headline">Data Sets</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-divider></v-divider>
    <DataSetLister />
    <DataSetPicker />
  </div>
</template>

<script>
import DataSetPicker from "@/components/DataSetPicker";
import DataSetLister from "@/components/DataSetLister";

export default {
  name: "DataSetTab",
  components: {
    DataSetPicker,
    DataSetLister
  }
};
</script>

<style lang="scss" scoped>
</style>