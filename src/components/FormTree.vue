<template>
  <div>
    <div v-for="node in nodes" v-bind:key="node.id">
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
      <div v-else-if="isType(node, 'color')">
        <div class="form-flex-container mb-7">
          <div class="form-element-label">{{ node.name.globalize.en }}</div>
          <v-spacer />
          <v-color-picker
            class="mx-auto color-picker"
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
      <div v-else-if="isType(node, 'category')">
        <div class="form-flex-container mb-6">
          <div class="form-element-label">{{ node.name.globalize.en }}</div>
          <v-spacer />
          <v-btn-toggle borderless v-model="value[node.id]" @change="emitChange($event, node)">
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
      <div v-else-if="isType(node, 'object')">
        <div class="form-section-label">{{ node.name.globalize.en }}</div>
        <FormTree
          class="internal-form"
          v-model="value[node.id]"
          @input="emitChange($event, node)"
          :nodes="node.options.schema"
        />
      </div>
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