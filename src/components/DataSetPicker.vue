<template>
  <div>
    <input
      ref="input"
      type="file"
      accept=".json, .csv, .txt"
      class="hidden"
      @change="referenceFiles"
    />
    <div v-if="fileSelected">Loaded file</div>
    <div v-else>
      <Button @click="$refs.input.click()">Upload Data Set</Button>
    </div>
  </div>
</template>

<script>
import Button from "@/components/primitive/Button";

export default {
  name: "DataSetPicker",
  components: {
    Button
  },
  data: () => ({
    files: [],
    fileReader: null
  }),
  computed: {
    fileSelected() {
      return this.$store.state.dataSet.length;
    }
  },
  methods: {
    readFiles() {
      this.fileReader.readAsDataURL(this.files[0]);
    },
    referenceFiles() {
      this.files = this.$refs.input.files;

      this.readFiles();
    }
  },
  created() {
    this.fileReader = new FileReader();
    this.fileReader.onload = file => {
      this.$store.dispatch("processDataset", {
        dataSet: file.target.result,
        fileType: this.files[0].name.substring(
          this.files[0].name.lastIndexOf(".") + 1
        )
      });
    };
  }
};
</script>

<style lang="scss" scoped>
</style>