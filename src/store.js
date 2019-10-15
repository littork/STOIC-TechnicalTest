import Vue from "vue";
import Vuex from "vuex";

import * as d3 from "d3";

import datasetClassifier from "@/tools/dataset-classifier";

import LayoutDefaults from "circos/layout-conf.js";

Vue.use(Vuex);

function mapOperation(data, operation) {
  let workingResult = {};
  for (let [operationName, subOperation] of Object.entries(operation)) {
    if (
      !subOperation.hasOwnProperty("to") ||
      !subOperation.hasOwnProperty("from")
    ) {
      // Must be an object
      //console.log(operation);
      workingResult[operationName] = mapOperation(data, subOperation);
      continue;
    }

    //console.log(`Broke through: ${JSON.stringify(subOperation)}`);

    workingResult[operationName] = subOperation.toInt
      ? parseInt(data[subOperation.from])
      : data[subOperation.from];
  }

  return workingResult;
}

function recursiveRequiredCheck(node) {
  if (!node) {
    return true;
  }

  if (node.required || node.from || node.to) {
    return node.from.length && node.to.length;
  }

  let result = true;
  for (let [operationName, subOperation] of Object.entries(node)) {
    if (!recursiveRequiredCheck(subOperation)) {
      result = false;
      break;
    }
  }

  return result;
}

const store = new Vuex.Store({
  state: {
    dataSets: [],
    layoutConfiguration: LayoutDefaults,
    layoutData: [],
    tracks: [],
    trackNameCounter: 0,
    dataSetsUnderComputation: [],
    uniqueIdCounter: 0,
    language: "en"
  },
  getters: {
    validDataSets: state => {
      return state.dataSets.filter(dataSet => {
        if (
          !dataSet.transformations ||
          !dataSet.transformations[1] ||
          !dataSet.transformations[1].mapOperations
        ) {
          return true;
        }

        return recursiveRequiredCheck(dataSet.transformations[1].mapOperations);
      });
    }
  },
  mutations: {
    ["language.set"](state, language) {
      console.info(`Switching to language: ${language}`);
      state.language = language;
    },
    ["dataset.duplicate"](state, index) {
      let duplicateDataset = JSON.parse(JSON.stringify(state.dataSets[index]));

      duplicateDataset.name = `${duplicateDataset.name} (Copy)`;

      Vue.set(state.dataSets, state.dataSets.length, duplicateDataset);
    },
    ["dataset.name.change"](state, payload) {
      Vue.set(state.dataSets[payload.index], "name", payload.name);
    },
    ["dataset.set_transformations"](state, payload) {
      Vue.set(state.dataSets[payload.index], "transformations", payload.change);
    },
    ["layout.data.set"](state, data) {
      state.layoutData = data.data;
    },
    ["tracks.set_data"](state, payload) {
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
    ["dataset.mark_recompute"](state, uniqueId) {
      let recomputeIndex = state.dataSets.findIndex(
        d => d.uniqueId === uniqueId
      );

      if (recomputeIndex < 0) {
        // Dataset may have been removed
        return;
      }

      Vue.set(state.dataSets[recomputeIndex], "computed", false);
    },
    ["dataset.push"](state, dataSet) {
      if (dataSet.uniqueId === undefined) {
        dataSet.uniqueId = ++state.uniqueIdCounter;
      }

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

      Vue.set(state, "layoutData", []); // To ensure that new data changes are propagated
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
    },
    ["dataset.compute"](state, datasetIndex) {
      const targetUniqueId = state.dataSets[datasetIndex].uniqueId;
      if (state.dataSetsUnderComputation.includes(targetUniqueId)) {
        return;
      }
      Vue.set(
        state.dataSetsUnderComputation,
        state.dataSetsUnderComputation.length,
        targetUniqueId
      );

      {
        // Run computations for data set
        let workingData = state.dataSets[datasetIndex].parsedData;

        state.dataSets[datasetIndex].transformations.forEach(transformation => {
          switch (transformation.type) {
            case 0:
              // Map
              /*console.log(
                `Working data before map operation: ${JSON.stringify(
                  workingData
                )}`
              );*/

              if (!transformation.mapOperations) {
                return;
              }

              try {
                workingData = workingData.map(d => {
                  let result = mapOperation(d, transformation.mapOperations);
                  /*console.log(
                    `Result of map operation: ${JSON.stringify(result)}`
                  );*/
                  return result;
                });
              } catch (error) {
                console.error(error);
                return;
              }
              /*console.log(
                `Result of map operation: ${JSON.stringify(workingData)}`
              );*/
              break;
            case 1:
              // Filter
              /*console.log(
                `Working data before filter operation: ${JSON.stringify(
                  workingData
                )}`
              );*/
              if (!transformation.filterOperations) {
                return;
              }

              workingData = workingData.filter(d => {
                let filterPositives = 0;

                transformation.filterOperations.forEach(filterOperation => {
                  if (filterPositives > 0) {
                    return;
                  }

                  if (
                    !filterOperation.key ||
                    !filterOperation.operation ||
                    !filterOperation.key.length ||
                    !filterOperation.operation.length ||
                    !filterOperation.comparator.length ||
                    !filterOperation.comparator
                  ) {
                    filterPositives++; // Allow data through if it is being filtered by something invalid
                    return;
                  }

                  // "<", ">", "!=", "!==", "==", "==="

                  switch (filterOperation.operation) {
                    case "<":
                      if (d[filterOperation.key] < filterOperation.comparator) {
                        filterPositives++;
                      }
                      break;
                    case ">":
                      if (d[filterOperation.key] > filterOperation.comparator) {
                        filterPositives++;
                      }
                      break;
                    case "!=":
                      if (
                        d[filterOperation.key] != filterOperation.comparator
                      ) {
                        filterPositives++;
                      }
                      break;
                    case "!==":
                      if (
                        d[filterOperation.key] !== filterOperation.comparator
                      ) {
                        filterPositives++;
                      }
                      break;
                    case "==":
                      if (
                        d[filterOperation.key] == filterOperation.comparator
                      ) {
                        filterPositives++;
                      }
                      break;
                    case "===":
                      if (
                        d[filterOperation.key] === filterOperation.comparator
                      ) {
                        filterPositives++;
                      }
                      break;
                  }

                  /*resultantObject[filterOperation.to] = mapOperation.toInt
                    ? parseInt(d[filterOperation.from])
                    : d[mapOperation.from];*/
                });

                return filterPositives > 0;
              });
              /*console.log(
                `Result of filter operation: ${JSON.stringify(workingData)}`
              );*/
              break;
          }
        });
        /*console.log(
          `Would be running computations on this thing: ${JSON.stringify(
            state.dataSets[datasetIndex]
          )}`
        );*/
        Vue.set(state.dataSets[datasetIndex], "data", workingData);
        //console.log(workingData);
      }

      Vue.set(state, "layoutData", []); // To ensure that new data changes are propagated

      Vue.set(state.dataSets[datasetIndex], "computed", true);

      state.dataSetsUnderComputation.splice(
        state.dataSetsUnderComputation.indexOf(targetUniqueId),
        1
      );
    },
    ["uniqueids.increase"](state) {
      state.uniqueIdCounter++;
    }
  },
  actions: {
    async syncAllDatasets({ state, commit }) {
      state.dataSets.forEach((v, i) => {
        if (!v.computed) {
          commit("dataset.compute", i);
        }
      });
    },
    async syncDataset({ commit }, datasetIndex) {
      commit("dataset.compute", datasetIndex);
    },
    async addDataset({ commit, state }, payload) {
      commit("uniqueids.increase");
      let pickedUniqueId = state.uniqueIdCounter;

      commit("dataset.push", { loading: true, computed: true });
      let dataSetIndex = state.dataSets.length - 1;
      try {
        let parsedData;
        switch (payload.fileType.toLowerCase()) {
          case "json":
            parsedData = payload.preParsed
              ? payload.dataSet
              : await d3.json(payload.dataSet);

            commit("dataset.update", {
              dataSet: {
                parsedData,
                rawData: payload.preParsed
                  ? JSON.stringify(parsedData)
                  : payload.dataSet,
                data: parsedData,
                name: payload.name,
                loading: false,
                computed: true,
                uniqueId: pickedUniqueId
              },
              index: dataSetIndex
            });

            break;
          case "txt":
          case "csv":
            parsedData = await d3.csv(payload.dataSet);

            commit("dataset.update", {
              dataSet: {
                parsedData,
                rawData: payload.dataSet,
                data: parsedData,
                name: payload.name,
                loading: false,
                computed: true,
                uniqueId: pickedUniqueId
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

export default store;
