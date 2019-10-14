<template>
  <div>
    <v-expansion-panels accordion>
      <v-expansion-panel
        v-for="(dataSet, index) in dataSets"
        v-bind:key="`${dataSet.loading}${index}`"
      >
        <v-expansion-panel-header>
          <v-progress-circular v-if="dataSet.loading" indeterminate />
          <span v-else>{{ dataSet.name }}</span>
          <v-spacer />
          <div class="flex-right">
            <v-btn text @click="remove(index)">Remove</v-btn>
          </div>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <DataSetTransformations />
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-divider v-if="dataSets.length" />
  </div>
</template>

<script>
import { mapState } from "vuex";

import DataSetTransformations from "@/components/DataSetTransformations";

export default {
  name: "DataSetLister",
  components: {
    DataSetTransformations
  },
  computed: mapState({
    dataSets: "dataSets"
  }),
  methods: {
    async remove(i) {
      this.$store.commit("dataset.remove", i);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>