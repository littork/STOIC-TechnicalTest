<template>
  <div class="outlined-panel top-shift">
    <v-expansion-panels accordion>
      <v-expansion-panel v-for="(node, index) in nodes" v-bind:key="`${index}`">
        <v-expansion-panel-header>
          <span>{{ node.name.globalize[$l.lang()] }}</span>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <div v-if="isType(node, 'string') || isType(node, 'identifier')">
            <v-text-field
              :label="$l.go('FROM', true)"
              :value="value[node.id].from"
              @input="emitChange($event, node, 'from')"
              hide-details
              outlined
            ></v-text-field>
            <div class="py-2">{{$l.go("TO")}}</div>
            <v-text-field
              :label="$l.go('TO', true)"
              readonly
              hide-details
              filled
              :value="value[node.id].to"
              @input="emitChange($event, node, 'to')"
            ></v-text-field>
          </div>
          <div v-else-if="isType(node, 'number')">
            <v-text-field
              :label="$l.go('FROM', true)"
              :value="value[node.id].from"
              hide-details
              filled
              @input="emitChange($event, node, 'from')"
            ></v-text-field>
            <div class="py-2">{{$l.go("TO")}}</div>
            <v-text-field
              :label="$l.go('TO', true)"
              readonly
              filled
              hide-details
              :value="value[node.id].to"
              @input="emitChange($event, node, 'to')"
            ></v-text-field>
          </div>

          <div v-else-if="isType(node, 'object')">
            <!-- <v-divider /> -->
            <MapTree
              :value="value[node.id] || {}"
              @input="emitChange($event, node)"
              :nodes="node.options.schema"
            />
          </div>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
import Vue from "vue";

export default {
  name: "MapTree",
  props: {
    nodes: {
      type: Array,
      required: false
    },
    value: Object
  },
  watch: {
    nodes() {
      this.syncSchema();
    }
  },
  created() {
    this.syncSchema();
    //console.log(this.value);
  },
  methods: {
    syncSkeleton(nodes, value) {
      // Fill starting data to match that of the node schema
      nodes.forEach(node => {
        if (!value[node.id]) {
          Vue.set(value, node.id, {});
        }

        switch (this.extractType(node)) {
          case "identifier":
          case "string":
          case "number":
            Vue.set(value[node.id], "from", "");
            Vue.set(value[node.id], "to", node.id);
            break;
          case "object":
            // Propogate preemptively to ensure this works
            this.syncSkeleton(node.options.schema, value[node.id]);
            break;
          default:
            throw `Invalid schema data type '${node.datatype}' for node: ${node.id}`;
            break;
        }
      });
    },
    syncSchema() {
      let schemaPresent = false;
      for (let key in this.value) {
        if (this.value.hasOwnProperty(key)) {
          schemaPresent = true;
          break;
        }
      }
      if (this.nodes.length && !schemaPresent) {
        this.syncSkeleton(this.nodes, this.value);
      }
    },
    emitChange(event, node, fromTo) {
      // We modify value directly here, which saves us from having to duplicate it
      if (fromTo) {
        this.value[node.id][fromTo] = event || false;
      } else {
        this.value[node.id] = event || false;
      }

      this.$emit("input", this.value);
    },
    extractType(node) {
      return node.datatype || node.control;
    },
    isType(node, type) {
      return this.extractType(node) === type;
    }
  }
};
</script>

<style lang="scss" scoped>
</style>