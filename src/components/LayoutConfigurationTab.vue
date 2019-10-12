<template>
  <div>
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="headline">Layout</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-divider></v-divider>
    <div class="pa-4">
      <FormTree :nodes="layoutMetadata" v-model="layout" />
    </div>
  </div>
</template>

<script>
import FormTree from "@/components/FormTree";

import * as layoutMetadataJSON from "@/circos.layout.json";

export default {
  name: "LayoutConfigurationTab",
  components: {
    FormTree
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
    }
  }
};
</script>

<style lang="scss" scoped>
</style>