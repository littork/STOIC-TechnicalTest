<template>
  <div>
    <h5 class="pb-3">{{ $l.go("TRANSFORMATIONS") }}</h5>
    <div class="outlined-panel">
      <v-expansion-panels accordion>
        <v-expansion-panel
          v-for="(transformation, index) in transformations"
          v-bind:key="`${index}`"
        >
          <v-expansion-panel-header>
            <span>{{ transformationTypeNames[transformation.type] }}</span>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <div class="px-4 pt-3" v-if="transformation.type === 0">
              <v-select
                :items="trackTypeNames"
                :value="transformation.mapTrackType"
                @change="changeTargetTrack(transformation, $event)"
                label="Target Track"
                filled
                hide-details
                class="px-2"
              ></v-select>
              <MapTree
                :nodes="activeMapNode(transformation)"
                v-model="transformation.mapOperations"
                v-if="transformation.mapTrackType !== 'Pre-defined'"
                class="mt-8"
              />
            </div>
            <div class="px-4 pt-3" v-if="transformation.type === 1">
              <div
                class="flex-horizontal pb-4"
                v-for="(conditionItem, conditionItemIndex) in transformation.filterOperations"
                v-bind:key="`${conditionItemIndex}`"
              >
                <v-text-field
                  :label="$l.go('KEY')"
                  filled
                  hide-details
                  :value="conditionItem.key"
                  @change="$set(conditionItem, 'key', $event)"
                />
                <!-- <div class="map-to-text px-4">{{'<>'}}</div> -->
                <v-select
                  :items="conditions"
                  :value="conditionItem.operation"
                  @change="$set(conditionItem, 'operation', $event)"
                  outlined
                  hide-details
                  class="px-2"
                ></v-select>
                <v-text-field
                  :label="$l.go('VALUE')"
                  filled
                  hide-details
                  :value="conditionItem.comparator"
                  @change="$set(conditionItem, 'comparator', $event)"
                />
                <div class="ml-4 flex-center" style="height: 56px;">
                  <v-btn
                    text
                    @click="deleteFilterCondition(index, conditionItemIndex)"
                    color="red"
                    icon
                  >
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </div>
              </div>
              <v-btn
                tile
                depressed
                block
                @click="newFilterCondition(index)"
              >{{ $l.go("ADD_NEW_FILTER_CONDITION") }}</v-btn>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
    <v-dialog v-model="templateDialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ $l.go("MAP_TRANSFORMATION_TEMPLATES") }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            {{ $l.go("SELECT_BASED_TEMPLATES") }}
            <v-banner
              v-for="(transformationTemplate, index) in dataTransformationTemplates"
              v-bind:key="index"
            ></v-banner>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="templateDialog = false">{{ $l.go("CLOSE") }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Vue from "vue";

import * as tracksMetadataJSON from "@/circos.tracks.json";

import MapTree from "@/components/MapTree";

export default {
  name: "DataSetTransformations",
  data: () => ({
    transformationTypes: [],
    conditions: ["<", ">", "!=", "!==", "==", "==="],
    templateDialog: false
  }),
  components: {
    MapTree
  },
  props: {
    value: { type: Array, default: () => [] }
  },
  computed: {
    transformationTypeNames() {
      return [this.$l.go("DATA_MAPPINGS"), this.$l.go("OR_FILTERS")];
    },
    transformations: {
      get() {
        return this.value;
      },
      set(v) {
        this.$emit("change", v);
      }
    },
    dataTransformationTemplates() {
      return tracksMetadataJSON.default.map(v => {
        let maps = [];

        v.data.forEach(dataPiece => {
          maps.push({
            to: dataPiece.id
          });
        });

        return maps;
      });
    },
    trackTypeNames() {
      return ["Pre-defined"].concat(
        this.tracksMetadata.map(track => track.name.globalize[this.$l.lang()])
      );
    },
    tracksMetadata() {
      return tracksMetadataJSON.default;
    }
  },
  created() {
    this.addDefaultTransformations();
  },
  watch: {
    transformations: {
      deep: true,
      handler(newValue) {
        this.$emit("watchChange");
      }
    }
  },
  methods: {
    changeTargetTrack(transformation, event) {
      this.$set(transformation, "mapTrackType", event);
      this.$set(
        transformation,
        "mapOperations",
        event === this.trackTypeNames[0] ? undefined : {}
      );
    },
    activeMapNode(transformation) {
      return this.tracksMetadata[
        this.tracksMetadata.findIndex(
          track =>
            track.name.globalize.en === transformation.mapTrackType ||
            track.name.globalize.fr === transformation.mapTrackType
        )
      ].data;
    },
    newFilterCondition(transformationIndex) {
      if (!this.transformations[transformationIndex].filterOperations) {
        Vue.set(
          this.transformations[transformationIndex],
          "filterOperations",
          []
        );
      }

      Vue.set(
        this.transformations[transformationIndex].filterOperations,
        this.transformations[transformationIndex].filterOperations.length,
        { key: null, condition: null, comparator: null }
      );

      this.$emit("change", this.transformations);
    },
    deleteFilterCondition(transformationIndex, conditionIndex) {
      this.transformations[transformationIndex].filterOperations.splice(
        conditionIndex,
        1
      );

      this.$emit("change", this.transformations);
    },
    deleteMapPiece(transformationIndex, pieceIndex) {
      this.transformations[transformationIndex].mapOperations.splice(
        pieceIndex,
        1
      );

      this.$emit("change", this.transformations);
    },
    newMapPiece(transformationIndex) {
      if (!this.transformations[transformationIndex].mapOperations) {
        Vue.set(this.transformations[transformationIndex], "mapOperations", []);
      }

      Vue.set(
        this.transformations[transformationIndex].mapOperations,
        this.transformations[transformationIndex].mapOperations.length,
        { from: null, to: null }
      );

      this.$emit("change", this.transformations);
    },
    addDefaultTransformations() {
      if (this.transformations.length) {
        return;
      }

      this.transformations.push({
        // Filters
        type: 1
      });
      this.transformations.push({
        // Maps
        type: 0,
        mapOperations: {},
        mapTrackType: this.trackTypeNames[1]
      });
      this.$emit("change", this.transformations);
    },
    removeTransformation(index) {
      this.transformations.splice(index, 1);
      this.$emit("change", this.transformations);
    }
  }
};
</script>

<style lang="scss" scoped>
.map-to-text {
  display: flex;
  align-items: center;
}

.v-text-field {
  padding-top: 0px;
}

.checkbox-padder {
  margin-top: 12px;
}
</style>