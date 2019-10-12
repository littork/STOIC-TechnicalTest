<template>
  <div>
    <v-dialog v-model="dialog" persistent max-width="600px">
      <template v-slot:activator="{ on }">
        <v-btn block v-on="on">Upload Data Set</v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">Upload Data Set</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-file-input
              v-model="files"
              color="deep-purple accent-4"
              counter
              label="Dataset input"
              multiple
              placeholder="Select your data sets"
              prepend-icon="mdi-paperclip"
              outlined
              :show-size="1000"
            >
              <template v-slot:selection="{ index, text }">
                <v-chip color="deep-purple accent-4" dark label small>{{ text }}</v-chip>
              </template>
            </v-file-input>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="blue darken-1" text @click="dialog = false">Close</v-btn>
          <v-btn color="blue darken-1" text @click="uploadFiles">Upload</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- <input
      ref="input"
      type="file"
      accept=".json, .csv, .txt"
      class="hidden"
      @change="referenceFiles"
    />
    <v-btn block @click="$refs.input.click()">Upload Data Set</v-btn>-->
  </div>
</template>

<script>
export default {
  name: "DataSetPicker",
  data: () => ({
    files: [],
    dialog: false
  }),
  methods: {
    readFiles() {
      this.files.forEach((file, index) => {
        let fileReader = new FileReader();
        fileReader.addEventListener("load", loadedFile => {
          let formattedResult = loadedFile.target.result;

          this.$store.dispatch("addDataset", {
            dataSet: formattedResult,
            name: file.name,
            fileType: file.name.substring(file.name.lastIndexOf(".") + 1)
          });
        });
        fileReader.readAsDataURL(file);
      });
      this.files = [];
    },
    referenceFiles() {
      this.readFiles();
    },
    uploadFiles() {
      this.referenceFiles();
      this.dialog = false;
    }
  }
};
</script>

<style lang="scss" scoped>
</style>