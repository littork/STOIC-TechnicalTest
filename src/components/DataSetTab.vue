<template>
  <div>
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="headline">{{ $l.go("DATA_SETS") }}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-divider></v-divider>
    <DataSetLister />
    <DataSetPicker />
    <DataSetSyncer />
  </div>
</template>

<script>
import DataSetPicker from "@/components/DataSetPicker";
import DataSetLister from "@/components/DataSetLister";
import DataSetSyncer from "@/components/DataSetSyncer";

export default {
  name: "DataSetTab",
  components: {
    DataSetPicker,
    DataSetLister,
    DataSetSyncer
  }
};
</script>

<style lang="scss" scoped>
</style>