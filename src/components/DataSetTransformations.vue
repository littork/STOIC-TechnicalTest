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
              style="height: max-content; min-height: 116px;"
            >
              <v-tabs-slider></v-tabs-slider>
              <v-tab
                v-for="(transformType, typeIndex) in transformationTypeNames"
                v-bind:key="typeIndex"
              >{{ transformType }}</v-tab>
              <v-tab-item>
                <div class="px-4 pt-6">
                  <div
                    class="flex-horizontal pb-4"
                    v-for="(mapItem, mapItemIndex) in transformation.mapOperations"
                    v-bind:key="`${mapItemIndex}`"
                  >
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-checkbox
                          :value="mapItem.toInt"
                          @change="$set(mapItem, 'toInt', $event)"
                          v-on="on"
                          class="checkbox-padder pr-2"
                        />
                      </template>
                      <span>Convert to Integer</span>
                    </v-tooltip>
                    <v-text-field
                      label="From Key"
                      outlined
                      hide-details
                      :value="mapItem.from"
                      @change="$set(mapItem, 'from', $event)"
                    />
                    <div class="map-to-text px-4">to</div>
                    <v-text-field
                      label="To Key"
                      outlined
                      hide-details
                      :value="mapItem.to"
                      @change="$set(mapItem, 'to', $event)"
                    />
                    <div class="ml-4 flex-center" style="height: 56px;">
                      <v-btn text @click="deleteMapPiece(index, mapItemIndex)" color="red">Delete</v-btn>
                    </div>
                  </div>
                  <v-btn tile depressed block @click="newMapPiece(index)">Add New Map Element</v-btn>
                </div>
              </v-tab-item>
              <v-tab-item>
                <div class="px-4 pt-6">
                  <div
                    class="flex-horizontal pb-4"
                    v-for="(conditionItem, conditionItemIndex) in transformation.filterOperations"
                    v-bind:key="`${conditionItemIndex}`"
                  >
                    <v-text-field
                      label="Key"
                      outlined
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
                      class="px-2"
                    ></v-select>
                    <v-text-field
                      label="Value"
                      outlined
                      hide-details
                      :value="conditionItem.comparator"
                      @change="$set(conditionItem, 'comparator', $event)"
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
      <v-btn tile depressed block @click.stop="newTransformation">Add New Transformation</v-btn>
    </div>
  </div>
</template>

<script>
import Vue from "vue";

export default {
  name: "DataSetTransformations",
  data: () => ({
    transformationTypeNames: ["Map", "Or Filter"],
    transformationTypes: [],
    conditions: ["<", ">", "!=", "!==", "==", "==="]
  }),
  props: {
    value: { type: Array, default: () => [] }
  },
  computed: {
    transformations() {
      return this.value;
    }
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
    changeTransformationType(newType, index) {
      Vue.set(this.transformations[index], "type", newType);
      this.$emit("change", this.transformations);
    },
    newTransformation() {
      this.transformations.push({
        type: 0
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

.checkbox-padder {
  margin-top: 12px;
}
</style>