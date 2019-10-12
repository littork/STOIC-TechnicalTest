import Vue from "vue";
import Vuex from "vuex";

import * as d3 from "d3";

import datasetClassifier from "@/tools/dataset-classifier";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    dataSets: []
  },
  mutations: {
    pushDataset(state, dataSet) {
      state.dataSets.push({ data: dataSet });
    },
    classifyDataset(state) {
      // state.dataSets.track = datasetClassifier(state.dataSet);
    }
  },
  actions: {
    async addDataset({ commit }, payload) {
      switch (payload.fileType.toLowerCase()) {
        case "json":
          try {
            commit(
              "pushDataset",
              await d3.json({ data: payload.dataSet, name: payload.name })
            );
          } catch (e) {
            console.error(e);
            alert(e);
            return;
          }
          break;
        case "txt":
        case "csv":
          try {
            commit(
              "pushDataset",
              await d3.csv({ data: payload.dataSet, name: payload.name })
            );
          } catch (e) {
            console.error(e);
            alert(e);
            return;
          }
          break;
      }

      commit("classifyDataset");
    }
  }
});
