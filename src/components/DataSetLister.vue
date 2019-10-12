<template>
  <div>
    <div v-for="(dataSet, index) in $store.state.dataSets" v-bind:key="index">{{ dataSet.name }}</div>
  </div>
</template>

<script>
export default {
  name: "DataSetLister"
};
</script>

<style lang="scss" scoped>
</style>