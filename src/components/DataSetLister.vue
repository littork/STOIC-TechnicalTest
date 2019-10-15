<template>
  <div>
    <v-expansion-panels accordion>
      <v-expansion-panel
        v-for="(dataSet, index) in dataSets"
        v-bind:key="`${dataSet.loading}-${index}-${dataSet.uniqueId}`"
      >
        <v-expansion-panel-header>
          <v-progress-circular v-if="dataSet.loading" indeterminate />
          <span
            contenteditable
            @click.stop
            @input="changeDatasetName($event, index)"
            v-else
          >{{ dataSet.name }}</span>
          <v-spacer />
          <div class="flex-right">
            <div class="flex-center pr-2" v-if="!dataSet.computed">
              <v-btn
                class="py-4"
                color="red"
                @click.stop="syncDataset(index)"
                outlined
                depressed
                small
                :loading="dataSetsUnderComputation.includes(dataSet.uniqueId)"
              >{{ $l.go("SYNC") }}</v-btn>
            </div>
            <div class="flex-center pr-2" v-else-if="dataSet.data && !dataSet.data.length">
              <v-chip class="py-4" outlined depressed small>{{ $l.go("EMPTY") }}</v-chip>
            </div>
            <v-btn text @click.stop="remove(index)">{{ $l.go("REMOVE") }}</v-btn>
          </div>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <DataSetTransformations
            :value="dataSet.transformations"
            @change="processDatasetTransformationChange($event, index)"
            @watchChange="markTransformationsNeedRecomputation(dataSet.uniqueId)"
          />
          <v-btn
            tile
            depressed
            block
            @click.stop="duplicateDataset(index)"
            class="mt-4"
          >{{ $l.go("CREATE_DUPLICATE") }}</v-btn>
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
  computed: mapState(["dataSets", "dataSetsUnderComputation"]),
  methods: {
    changeDatasetName(change, index) {
      this.$store.commit("dataset.name.change", {
        index,
        name: change.target.textContent
      });
    },
    markTransformationsNeedRecomputation(uniqueId) {
      /*
        Whenever the user edits a transformation, we now have to recompute it at some point
        This function marks the dataset to be recomputed in the future
      */
      this.$store.commit("dataset.mark_recompute", uniqueId);
    },
    duplicateDataset(index) {
      this.$store.commit("dataset.duplicate", index);
    },
    syncDataset(index) {
      this.$store.dispatch("syncDataset", index);
    },
    processDatasetTransformationChange(change, index) {
      this.$store.commit("dataset.set_transformations", { change, index });
    },
    async remove(i) {
      this.$store.commit("dataset.remove", i);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>