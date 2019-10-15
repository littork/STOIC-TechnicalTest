<template>
  <div>
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="headline">{{ $l.go("EXPORT") }}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-divider />
    <div class="ma-4" style="border: 1px solid rgba(0, 0, 0, 0.12)">
      <v-btn
        tile
        depressed
        block
        @click.stop="exportAll()"
        :loading="exporting"
      >{{ $l.go("EXPORT") }}</v-btn>
      <v-divider />
      <v-btn
        tile
        depressed
        block
        @click.stop="importAll()"
        :loading="importing"
      >{{ $l.go("IMPORT") }}</v-btn>
    </div>
    <div class="ma-4" style="border: 1px solid rgba(0, 0, 0, 0.12)">
      <v-btn tile depressed block @click.stop="captureImage()">{{ $l.go("CAPTURE_IMAGE") }}</v-btn>
    </div>
    <a id="download" class="hidden"></a>
    <input id="import-input" type="file" accept=".json" class="hidden" @change="importChanged" />
  </div>
</template>

<script>
import html2canvas from "html2canvas";

export default {
  name: "ExportTab",
  data: () => ({
    exporting: false,
    importing: false
  }),
  methods: {
    async captureImage() {
      let captureCanvas = await html2canvas(document.getElementById("chart"));

      let downloadElement = document.getElementById("download");
      downloadElement.setAttribute(
        "href",
        captureCanvas
          .toDataURL("image/png")
          .replace("image/png", "image/octet-stream")
      );
      downloadElement.setAttribute("download", "chart.png");
      downloadElement.click();
    },
    async exportAll() {
      this.exporting = true;

      let storeJSON = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(this.$store.state)
      )}`;
      let downloadElement = document.getElementById("download");

      downloadElement.setAttribute("href", storeJSON);
      downloadElement.setAttribute("download", "export.json");
      downloadElement.click();

      this.exporting = false;
    },
    async importAll() {
      let importElement = document.getElementById("import-input");
      importElement.click();
    },
    async importChanged(change) {
      this.importing = true;

      if (!change.target || !change.target.files.length) {
        this.importing = false;
        return;
      }

      let fileReader = new FileReader();
      fileReader.addEventListener("load", async loadedFile => {
        let formattedResult;
        try {
          formattedResult = JSON.parse(loadedFile.target.result);
        } catch (error) {
          console.error(error);
          alert(`Failed to import state: ${error}`);
          this.importing = false;
          return;
        }

        this.$store.replaceState(formattedResult);
        this.importing = false;
      });
      fileReader.readAsText(change.target.files[0]);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>