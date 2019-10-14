<template>
  <div>
    <h5 class="pb-3">Transformations</h5>
    <div class="outlined-panel">
      <v-expansion-panels accordion>
        <v-expansion-panel
          v-for="(transformation, index) in transformations"
          v-bind:key="`${index}`"
        >
          <v-expansion-panel-header>
            <span>{{ transformationTypeNames[transformation.type] }}</span>
            <v-spacer />
            <div class="flex-right">
              <v-btn text @click.stop="removeTransformation(index)">Remove</v-btn>
            </div>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-tabs
              @change="changeTransformationType($event, index)"
              background-color="#e5e5e5"
              class="escape-expansion-panel"
              style="height: 128px"
            >
              <v-tabs-slider></v-tabs-slider>
              <v-tab
                v-for="(transformType, typeIndex) in transformationTypeNames"
                v-bind:key="typeIndex"
              >{{ transformType }}</v-tab>
              <v-tab-item>
                <div class="pa-4">
                  <div
                    class="flex-horizontal pb-4"
                    v-for="(mapItem, mapItemIndex) in transformation.mapOperations"
                    v-bind:key="`${mapItemIndex}`"
                  >
                    <v-text-field label="From Key" outlined hide-details v-model="mapItem.from" />
                    <div class="map-to-text px-4">to</div>
                    <v-text-field label="To Key" outlined hide-details v-model="mapItem.to" />
                    <div class="ml-4 flex-center" style="height: 56px;">
                      <v-btn text @click="deleteMapPiece(index, mapItemIndex)" color="red">Delete</v-btn>
                    </div>
                  </div>
                  <v-btn tile depressed block @click="newMapPiece(index)">Add New Map Piece</v-btn>
                </div>
              </v-tab-item>
              <v-tab-item>
                <div class="pa-4">
                  <div
                    class="flex-horizontal pb-4"
                    v-for="(conditionItem, conditionItemIndex) in transformation.filterOperations"
                    v-bind:key="`${conditionItemIndex}`"
                  >
                    <v-text-field label="Key" outlined hide-details v-model="conditionItem.key" />
                    <!-- <div class="map-to-text px-4">{{'<>'}}</div> -->
                    <v-select :items="conditions" dense outlined></v-select>
                    <v-text-field
                      label="Value"
                      outlined
                      hide-details
                      v-model="conditionItem.comparator"
                    />
                    <div class="ml-4 flex-center" style="height: 56px;">
                      <v-btn
                        text
                        @click="deleteFilterCondition(index, conditionItemIndex)"
                        color="red"
                      >Delete</v-btn>
                    </div>
                  </div>
                  <v-btn
                    tile
                    depressed
                    block
                    @click="newFilterCondition(index)"
                  >Add New Filter Condition</v-btn>
                </div>
              </v-tab-item>
            </v-tabs>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <v-divider v-if="transformations.length" />
      <v-btn tile depressed block @click="newTransformation">Add New Transformation</v-btn>
    </div>
  </div>
</template>

<script>
import Vue from "vue";

export default {
  name: "DataSetTransformations",
  data: () => ({
    transformations: [],
    transformationTypeNames: ["Map", "Filter"],
    transformationTypes: [],
    conditions: ["<", ">", "!=", "!==", "==", "==="]
  }),
  methods: {
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
    },
    deleteFilterCondition(transformationIndex, conditionIndex) {
      this.transformations[transformationIndex].filterOperations.splice(
        conditionIndex,
        1
      );
    },
    deleteMapPiece(transformationIndex, pieceIndex) {
      this.transformations[transformationIndex].mapOperations.splice(
        pieceIndex,
        1
      );
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
    },
    changeTransformationType(newType, index) {
      this.transformations[index].type = newType;
    },
    newTransformation() {
      this.transformations.push({
        type: 0
      });
    },
    removeTransformation(index) {
      this.transformations.splice(index, 1);
    }
  }
};
</script>

<style lang="scss" scoped>
.outlined-panel {
  outline: 1px solid rgba(0, 0, 0, 0.12);
}

.map-to-text {
  display: flex;
  align-items: center;
}

.v-text-field {
  padding-top: 0px;
}
</style>