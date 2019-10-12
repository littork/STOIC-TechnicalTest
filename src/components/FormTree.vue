<template>
  <div>
    <div v-for="(node,index) in nodes" v-bind:key="node.id">
      <div v-if="isType(node, 'boolean')">
        <v-checkbox
          v-model="value[node.id]"
          @change="emitChange($event, node)"
          :label="node.name.globalize.en"
          color="red"
          inset
        ></v-checkbox>
      </div>
      <div v-else-if="isType(node, 'integer')">
        <v-text-field
          :label="node.name.globalize.en"
          v-model="value[node.id]"
          @change="emitChange($event, node)"
          filled
        ></v-text-field>
      </div>
      <div v-else-if="isType(node, 'number')">
        <v-text-field
          :label="node.name.globalize.en"
          v-model="value[node.id]"
          @change="emitChange($event, node)"
          filled
        ></v-text-field>
      </div>
      <div v-else-if="isType(node, 'color') || isType(node, 'palette')">
        <div class="form-flex-container color-container">
          <div class="form-element-label">{{ node.name.globalize.en }}</div>
          <v-spacer />
          <v-color-picker
            class="mx-auto color-pickercolor-picker"
            v-model="value[node.id]"
            @input="emitChange($event, node)"
            hide-inputs
            hide-mode-switch
          ></v-color-picker>
        </div>
      </div>
      <div v-else-if="isType(node, 'expression')">
        <v-text-field
          :label="node.name.globalize.en"
          v-model="value[node.id]"
          @change="emitChange($event, node)"
          filled
        ></v-text-field>
      </div>
      <div v-else-if="isType(node, 'category') && findNodeLength(node) <= 32">
        why is passthrough failing?
        <div class="form-flex-container mb-6">
          <div class="form-element-label">{{ node.name.globalize.en }}</div>
          <v-spacer />
          <v-btn-toggle
            borderless
            dense
            mandatory
            v-model="value[node.id]"
            @change="emitChange($event, node)"
          >
            <v-btn
              v-for="category in node.options.categories"
              v-bind:key="category.id"
              :value="category.id"
              :disabled="node.options.categories.length <= 1"
            >
              <span class="hidden-sm-and-down">{{ category.name.globalize.en }}</span>
            </v-btn>
          </v-btn-toggle>
        </div>
      </div>
      <div
        v-else-if="isType(node, 'dropdown') || (isType(node, 'category') && findNodeLength(node) > 32)"
      >
        <v-select
          @change="emitChange($event, node)"
          :items="simplifyCategories(node.options.categories)"
          :value="value[node.id]"
          outlined
          :label="node.name.globalize.en"
        />
      </div>
      <div v-else-if="isType(node, 'object') || isType(node, 'collection')">
        <div class="form-section-label">{{ node.name.globalize.en }}</div>
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
  methods: {
    findNodeLength(node) {
      // Just use a select if there are a bunch of options
      return node.options.categories.reduce(
        (acc, category) => acc + category.name.globalize.en.length,
        0
      );
    },
    emitChange(event, node) {
      // TODO: How can this be made more efficient?
      let newValue = JSON.parse(JSON.stringify(this.value));

      newValue[node.id] = event || false;

      this.$emit("input", newValue);
    },
    extractType(node) {
      return node.datatype || node.control;
    },
    isType(node, type) {
      return this.extractType(node) === type;
    },
    simplifyCategories(categories) {
      return categories.map(category => category.name.globalize.en);
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

.color-container {
  margin-bottom: 32px;
}

.color-picker {
  flex-grow: 1;
}
</style>