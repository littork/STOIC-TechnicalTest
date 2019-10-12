<template>
  <div>
    <div v-for="(dataSet, index) in dataSets" v-bind:key="`${dataSet.loading}${index}`">
      <v-banner single-line>
        <v-progress-circular v-if="dataSet.loading" indeterminate />
        <span v-else>{{ dataSet.name }}</span>
        <template v-slot:actions>
          <v-btn text @click="remove(index)">Remove</v-btn>
        </template>
      </v-banner>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "DataSetLister",
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