<template>
  <div>
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="headline">{{ $l.go("TAB_LAYOUT") }}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-divider />
    <div>
      <v-select
        :items="simplifiedDatasets"
        v-model="layoutDataset"
        outlined
        hide-details
        class="ma-4"
        label="Dataset"
      />
    </div>
    <v-divider />
    <div class="pa-4">
      <FormTree :nodes="layoutMetadata" v-model="layout" />
    </div>
  </div>
</template>

<script>
import FormTree from "@/components/FormTree";

import * as layoutMetadataJSON from "@/circos.layout.json";

import { mapState } from "vuex";

export default {
  name: "LayoutConfigurationTab",
  components: {
    FormTree
  },
  data: () => ({
    layoutDataset: ""
  }),
  watch: {
    layoutDataset(set) {
      this.$store.commit(
        "layout.data.set",
        this.dataSets[this.dataSets.findIndex(data => data.name === set)]
      );
    }
  },
  computed: {
    layoutMetadata(state) {
      return layoutMetadataJSON.default;
    },
    layout: {
      get() {
        return this.$store.state.layoutConfiguration;
      },
      set(v) {
        this.$store.commit("layoutConfiguration.set", v);
      }
    },
    ...mapState(["dataSets"]),
    simplifiedDatasets() {
      return this.dataSets.map(set => set.name);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>