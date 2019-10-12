import Vue from "vue";
import Vuex from "vuex";

import * as d3 from "d3";

import datasetClassifier from "@/tools/dataset-classifier";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    dataSet: {
      data: [],
      track: 0
    }
  },
  mutations: {
    writeDataset(state, dataSet) {
      state.dataSet = { data: dataSet };
    },
    classifyDataset(state) {
      state.dataSet.track = datasetClassifier(state.dataSet);
    }
  },
  actions: {
    async processDataset({ commit }, payload) {
      switch (payload.fileType.toLowerCase()) {
        case "json":
          try {
            commit("writeDataset", await d3.json(payload.dataSet));
          } catch (e) {
            console.error(e);
            alert(e);
            return;
          }
          break;
        case "txt":
        case "csv":
          try {
            commit("writeDataset", await d3.csv(payload.dataSet));
          } catch (e) {
            console.error(e);
            alert(e);
            return;
          }
          break;
      }

      // commit("classifyDataset");
    }
  }
});
