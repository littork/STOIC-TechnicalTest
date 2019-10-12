<template>
  <div>
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="headline">Tracks</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-divider></v-divider>
    <div class="pa-4">
      <FormTree :nodes="trackMetadata" v-model="tracks" />
    </div>
  </div>
</template>

<script>
import FormTree from "@/components/FormTree";

import * as trackMetadataJSON from "@/circos.tracks.json";

export default {
  name: "TrackConfigurationTab",
  components: {
    FormTree
  },
  computed: {
    trackMetadata() {
      return trackMetadataJSON.default;
    }
  },
  data: () => ({
    tracks: {}
  })
};
</script>

<style lang="scss" scoped>
</style>