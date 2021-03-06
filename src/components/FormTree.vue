<template>
  <div>
    <div v-for="(node,index) in nodes" v-bind:key="node.id" style="padding-bottom: 16px;">
      <div v-if="isType(node, 'boolean')">
        <v-checkbox
          :input-value="value[node.id]"
          @change="emitChange($event, node)"
          :label="node.name.globalize[$l.lang()]"
          hide-details
          color="blue"
          inset
        ></v-checkbox>
      </div>
      <div v-else-if="isType(node, 'integer')">
        <v-text-field
          :label="node.name.globalize[$l.lang()]"
          :value="value[node.id]"
          @change="emitChange($event, node)"
          hide-details
          filled
        ></v-text-field>
      </div>
      <div v-else-if="isType(node, 'number')">
        <v-text-field
          :label="node.name.globalize[$l.lang()]"
          :value="value[node.id]"
          @change="emitChange($event, node)"
          hide-details
          filled
        ></v-text-field>
      </div>
      <div v-else-if="isType(node, 'color') || isType(node, 'palette')">
        <div class="form-flex-container">
          <div class="form-element-label">{{ node.name.globalize[$l.lang()] }}</div>
          <v-spacer />
          <v-color-picker
            class="mx-auto color-picker"
            :value="value[node.id]"
            @input="emitChange($event, node)"
            :hide-inputs="!isType(node, 'palette')"
            hide-mode-switch
          ></v-color-picker>
        </div>
      </div>
      <div v-else-if="isType(node, 'expression')">
        <v-text-field
          :label="node.name.globalize[$l.lang()]"
          :value="value[node.id]"
          :placeholder="node.name.globalize[$l.lang()]"
          @change="emitChange($event, node)"
          hide-details
          filled
        ></v-text-field>
      </div>
      <div v-else-if="isType(node, 'category') && categoryNodeLengthSmall(node)">
        <div class="form-flex-container">
          <div class="form-element-label">{{ node.name.globalize[$l.lang()] }}</div>
          <v-spacer />
          <v-btn-toggle
            borderless
            dense
            mandatory
            :value="value[node.id]"
            @change="emitChange($event, node)"
          >
            <v-btn
              v-for="category in node.options.categories"
              v-bind:key="category.id"
              :value="category.id"
              :disabled="node.options.categories.length <= 1"
            >
              <span class="hidden-sm-and-down">{{ category.name.globalize[$l.lang()] }}</span>
            </v-btn>
          </v-btn-toggle>
        </div>
      </div>
      <div
        v-else-if="isType(node, 'dropdown') || (isType(node, 'category') && !categoryNodeLengthSmall(node))"
      >
        <v-select
          @change="emitChange($event, node)"
          :items="simplifyCategories(node.options.categories)"
          :value="value[node.id]"
          hide-details
          outlined
          :label="node.name.globalize[$l.lang()]"
        />
      </div>
      <div v-else-if="isType(node, 'object') || isType(node, 'collection')">
        <div class="form-section-label">{{ node.name.globalize[$l.lang()] }}</div>
        <FormTree
          class="internal-form"
          :value="value[node.id] || {}"
          @input="emitChange($event, node)"
          :nodes="node.options.schema"
        />
      </div>
      <h1
        v-else
      >No corresponding form element found for node at index {{index}}. Type: {{extractType(node)}}</h1>
      <h5
        v-if="node.description"
        style="padding-top: 4px;"
      >{{ node.description.globalize[$l.lang()] }}</h5>
    </div>
  </div>
</template>

<script>
export default {
  name: "FormTree",
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
  },
  methods: {
    enforceNodeSkeleton(nodes, value) {
      // Fill starting data to match that of the node schema
      nodes.forEach(node => {
        switch (this.extractType(node)) {
          case "boolean":
            value[node.id] = false;
            break;
          case "integer":
            value[node.id] = "0";
            break;
          case "number":
            value[node.id] = "0.0";
            break;
          case "color":
          case "palette":
            value[node.id] = "#ffffff";
            break;
          case "expression":
            value[node.id] = "";
            break;
          case "category":
            if (this.categoryNodeLengthSmall(node)) {
              value[node.id] = node.options.categories[0].id;
              break;
            }
          case "dropdown":
            value[node.id] =
              node.options.categories[0].name.globalize[this.$l.lang()];
            break;
          case "object":
          case "collection":
            // Propogate preemptively to ensure this works
            value[node.id] = {};
            this.enforceNodeSkeleton(node.options.schema, value[node.id]);
            break;
          default:
            throw `Invalid schema data type '${node.datatype}' for node: ${node.id}`;
            break;
        }
      });
    },
    categoryNodeLengthSmall(node) {
      return this.findNodeLength(node) <= 32;
    },
    forceSyncSchema() {
      this.enforceNodeSkeleton(this.nodes, this.value);
    },
    syncSchema() {
      // Ensure that current value is at least a skeleton of what the schema demands
      let schemaPresent = false;
      for (let key in this.value) {
        if (this.value.hasOwnProperty(key)) {
          schemaPresent = true;
          break;
        }
      }
      if (this.nodes.length && !schemaPresent) {
        this.enforceNodeSkeleton(this.nodes, this.value);
      }
    },
    findNodeLength(node) {
      // Just use a select if there are a bunch of options
      return node.options.categories.reduce(
        (acc, category) => acc + category.name.globalize[this.$l.lang()].length,
        0
      );
    },
    emitChange(event, node) {
      // We modify value directly here, which saves us from having to duplicate it
      this.value[node.id] = event || false;
      this.$emit("input", this.value);
    },
    extractType(node) {
      return node.datatype || node.control;
    },
    isType(node, type) {
      return this.extractType(node) === type;
    },
    simplifyCategories(categories) {
      return categories.map(
        category => category.name.globalize[this.$l.lang()]
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.internal-form {
  padding-left: 48px;
}

.form-section-label {
  text-align: left;
  font-size: 18px;
  font-weight: bold;

  padding-bottom: 24px;
}

.form-flex-container {
  display: flex;

  align-items: center;
  justify-content: space-between;
}

.color-picker {
  flex-grow: 1;
}
</style>