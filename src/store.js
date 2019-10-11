import Vue from "vue";
import Vuex from "vuex";

import * as d3 from "d3";

import * as trackMetadata from "@/circos.tracks.json";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    dataSet: []
  },
  mutations: {
    writeDataset(state, dataSet) {
      state.dataSet = dataSet;
    }
  },
  actions: {
    async processDataset({ commit }, payload) {
      console.log(trackMetadata);
      switch (payload.fileType.toLowerCase()) {
        case "json":
          try {
            commit("writeDataset", await d3.json(payload.dataSet));
          } catch (e) {
            console.error(e);
            alert(e);
          }
          break;
        case "txt":
        case "csv":
          try {
            commit("writeDataset", await d3.csv(payload.dataSet));
          } catch (e) {
            console.error(e);
            alert(e);
          }
          break;
      }
    }
  }
});
