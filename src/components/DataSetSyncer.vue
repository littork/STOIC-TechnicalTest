<template>
  <div>
    <v-divider />
    <v-alert class="ma-4" border="left" color="red" dark outlined v-if="dataSetsComputed">
      {{ $l.go("UNCOMPUTED_TRANSFORMATIONS") }}
      <br />
      <v-btn
        class="mt-4"
        color="red"
        depressed
        :loading="dataSetsComputing"
        @click="$store.dispatch('syncAllDatasets')"
      >{{ $l.go("COMPUTE_NOW") }}</v-btn>
    </v-alert>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "DataSetSyncer",
  computed: {
    ...mapState(["dataSets", "dataSetsUnderComputation"]),
    dataSetsComputed() {
      return !!this.dataSets.filter(v => !v.computed).length;
    },
    dataSetsComputing() {
      return !!(
        this.dataSets.filter(v => !v.computed).length &&
        this.dataSets
          .filter(v => !v.computed)
          .every(v => this.dataSetsUnderComputation.includes(v.uniqueId))
      );
    }
  }
};
</script>

<style lang="scss" scoped>
</style>