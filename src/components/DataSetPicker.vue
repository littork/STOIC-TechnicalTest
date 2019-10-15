<template>
  <div>
    <v-dialog v-model="dialog" persistent max-width="600px">
      <template v-slot:activator="{ on }">
        <v-btn tile depressed block v-on="on">{{ $l.go("UPLOAD_DATA_SET") }}</v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">{{ $l.go("UPLOAD_DATA_SETS") }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-file-input
              v-model="files"
              counter
              :label="$l.go('DATASET_INPUT')"
              multiple
              :placeholder="$l.go('SELECT_DATA_SETS')"
              prepend-icon="mdi-paperclip"
              outlined
              :show-size="1000"
            >
              <template v-slot:selection="{ index, text }">
                <v-chip color="#1177cc" dark label small>{{ text }}</v-chip>
              </template>
            </v-file-input>
            <!-- <v-btn depressed outlined @click="addDemoDataSets">{{ $l.go("ADD_DEMO_DATA_SETS") }}</v-btn> -->
          </v-container>
        </v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="blue darken-1" text @click="dialog = false">{{ $l.go("CLOSE") }}</v-btn>
          <v-btn color="blue darken-1" text @click="uploadFiles">{{ $l.go("UPLOAD") }}</v-btn>
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
import * as d3 from "d3";

export default {
  name: "DataSetPicker",
  data: () => ({
    files: [],
    dialog: false
  }),
  methods: {
    async addDemoDataSets() {
      [
        "cytobands.csv",
        "days-off.csv",
        "electrical-consumption.csv",
        "es.csv",
        "fusion-genes.csv",
        "ips.csv",
        "segdup.csv",
        "snp.density.1mb.txt",
        "snp.density.250kb.txt",
        "snp.density.txt"
      ].forEach(v => {
        this.$store.dispatch("addDataset", {
          dataSet: `../../data/${v}`,
          name: v,
          fileType: v.substring(v.lastIndexOf(".") + 1)
        });
      });

      ["GRCh37.json", "months.json"].forEach(v => {
        this.$store.dispatch("addDataset", {
          dataSet: require(`../../data/${v}`),
          name: v,
          fileType: v.substring(v.lastIndexOf(".") + 1),
          preParsed: true
        });
      });

      this.dialog = false;
    },
    async readFiles() {
      let filePromises = [];

      this.files.forEach((file, index) => {
        filePromises.push(
          new Promise((resolve, reject) => {
            let fileReader = new FileReader();
            fileReader.addEventListener("load", async loadedFile => {
              let formattedResult = loadedFile.target.result;

              try {
                await this.$store.dispatch("addDataset", {
                  dataSet: formattedResult,
                  name: file.name,
                  fileType: file.name.substring(file.name.lastIndexOf(".") + 1)
                });
              } catch (e) {
                reject();
              }
              resolve();
            });
            fileReader.readAsDataURL(file);
          })
        );
      });

      await Promise.all(filePromises);

      this.$store.commit("dataset.deduplicate");

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