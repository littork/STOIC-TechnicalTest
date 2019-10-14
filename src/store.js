import Vue from "vue";
import Vuex from "vuex";

import * as d3 from "d3";

import datasetClassifier from "@/tools/dataset-classifier";

import LayoutDefaults from "circos/layout-conf.js";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    dataSets: [],
    layoutConfiguration: LayoutDefaults,
    layoutData: [],
    tracks: [],
    trackNameCounter: 0
  },
  mutations: {
    ["layout.data.set"](state, data) {
      state.layoutData = data.data;
    },
    ["tracks.setdata"](state, payload) {
      Vue.set(state.tracks[payload.index], "data", payload.data);
    },
    ["tracks.remove"](state, index) {
      state.tracks.splice(index, 1);
    },
    ["tracks.set"](state, tracks) {
      state.tracks = tracks;
    },
    ["tracks.add"](state, payload) {
      let newTrack = JSON.parse(JSON.stringify(payload.track));

      if (payload.autoname) {
        newTrack.name = `Track ${++state.trackNameCounter}`;
      }

      state.tracks.push(newTrack);
    },
    ["tracks.edit"](state, payload) {
      let editedTrack = JSON.parse(JSON.stringify(payload.track));

      state.tracks[payload.index] = editedTrack;
    },
    ["layoutConfiguration.set"](state, config) {
      state.layoutConfiguration = config;
    },
    ["dataset.push"](state, dataSet) {
      state.dataSets.push(dataSet);
    },
    ["dataset.update"](state, { dataSet, index }) {
      state.dataSets = state.dataSets.map((v, i) => {
        if (i === index) {
          v = dataSet;

          // Hashing algorithm from https://stackoverflow.com/a/7616484/10497537
          v.hash = 0;
          let i, chr;
          for (i = 0; i < dataSet.rawData.length; i++) {
            chr = dataSet.rawData.charCodeAt(i);
            v.hash = (v.hash << 5) - v.hash + chr;
            v.hash |= 0; // Convert to 32bit integer
          }
        }
        return v;
      }); // Done in order to achieve reactivity
    },
    ["dataset.remove"](state, index) {
      state.dataSets.splice(index, 1);
    },
    ["dataset.deduplicate"](state) {
      // Remove duplicates + cleanup loading
      let coveredHashes = [];
      state.dataSets = state.dataSets.filter(v => {
        if (
          (coveredHashes.includes(v.hash) && v.hash !== undefined) ||
          v.loading
        ) {
          return false;
        } else {
          coveredHashes.push(v.hash);
          return true;
        }
      });
    },
    ["dataset.classify"](state) {
      // state.dataSets.track = datasetClassifier(state.dataSet);
    }
  },
  actions: {
    async addDataset({ commit, state }, payload) {
      commit("dataset.push", { loading: true });
      let dataSetIndex = state.dataSets.length - 1;
      try {
        switch (payload.fileType.toLowerCase()) {
          case "json":
            commit("dataset.update", {
              dataSet: {
                data: await d3.json(payload.dataSet),
                rawData: payload.dataSet,
                name: payload.name,
                loading: false
              },
              index: dataSetIndex
            });

            break;
          case "txt":
          case "csv":
            commit("dataset.update", {
              dataSet: {
                data: await d3.csv(payload.dataSet),
                rawData: payload.dataSet,
                name: payload.name,
                loading: false
              },
              index: dataSetIndex
            });

            break;
        }
      } catch (e) {
        alert(`Failed to load data set ${payload.name}: ${e}`);
        commit("dataset.remove", dataSetIndex);
        return;
      }

      commit("dataset.classify");
    }
  }
});
