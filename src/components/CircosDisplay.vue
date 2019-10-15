<template>
  <div>
    <div id="chart" v-show="layoutData.length"></div>
    <h3 v-show="!layoutData.length" class="instruction">{{ $l.go("SELECT_LAYOUT_DATASET") }}</h3>
  </div>
</template>

<script>
import Circos from "circos";

import { mapState } from "vuex";

export default {
  name: "CircosDisplay",
  data: () => ({
    circosInstance: null
  }),
  computed: mapState(["layoutConfiguration", "layoutData", "tracks"]),
  watch: {
    layoutConfiguration: {
      deep: true,
      handler(config) {
        this.circosInstance.layout(this.layoutData, config);
        this.circosInstance.render();
      }
    },
    layoutData: {
      deep: true,
      handler(data) {
        this.circosInstance.layout(data, this.layoutConfiguration);
        this.circosInstance.render();
      }
    },
    tracks: {
      deep: true,
      handler(newTracks, oldTracks) {
        // TODO: Delta track changes
        newTracks.forEach(track => {
          if (!track.data) {
            return;
          }

          switch (track.id) {
            case "chords":
              this.circosInstance.chords(track.id, track.data.data, track);
              break;
            case "heatmap":
              this.circosInstance.heatmap(track.id, track.data.data, track);
              break;
            case "highlight":
              this.circosInstance.highlight(track.id, track.data.data, track);
              break;
            case "histogram":
              this.circosInstance.histogram(track.id, track.data.data, track);
              break;
            case "line":
              this.circosInstance.line(track.id, track.data.data, track);
              break;
            case "scatter":
              this.circosInstance.scatter(track.id, track.data.data, track);
              break;
            case "stack":
              this.circosInstance.stack(track.id, track.data.data, track);
              break;
            case "text":
              this.circosInstance.chords(track.id, track.data.data, track);
              break;
            default:
              throw `Invalid track id: ${track.id}`;
              break;
          }
          this.circosInstance.render();
        });
      }
    }
  },
  mounted() {
    this.circosInstance = new Circos({
      container: "#chart"
    });

    this.circosInstance.layout(this.layoutData, this.layoutConfiguration);
    this.circosInstance.render();
  }
};
</script>

<style lang="scss" scoped>
.instruction {
  width: 100%;
  height: 100vh;

  display: flex;

  justify-content: center;
  align-items: center;
}
</style>