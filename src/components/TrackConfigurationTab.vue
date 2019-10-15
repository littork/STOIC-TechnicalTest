<template>
  <div>
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="headline">{{ $l.go("TAB_TRACKS") }}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-divider></v-divider>
    <div>
      <!-- <FormTree :nodes="trackMetadata" v-model="tracks" /> -->
      <v-expansion-panels accordion>
        <v-expansion-panel
          v-for="(track, index) in tracks"
          v-bind:key="`${track.name}-${index}-${track.type}`"
        >
          <v-expansion-panel-header>
            {{ track.name }}
            <v-spacer />
            <div class="flex-right">
              <div class="mr-6 flex-center" style="width: 96px;">
                <v-chip label outlined>{{ track.type }}</v-chip>
              </div>
              <v-btn text @click="edit(index)" small>{{ $l.go("EDIT") }}</v-btn>
              <v-btn text @click="remove(index)" small>{{ $l.go("REMOVE") }}</v-btn>
            </div>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-select
              :items="simplifiedDatasets(track)"
              filled
              label="Dataset"
              hide-details
              :value="track.data ? track.data.name : ''"
              @change="setTrackDataset($event, index)"
            ></v-select>
            <v-btn
              tile
              depressed
              block
              class="mt-4"
              @click.stop="refreshTrackDataset(track)"
            >Refresh</v-btn>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
    <v-divider v-if="tracks.length" />
    <TrackCreator ref="track_creator" />
  </div>
</template>

<script>
import TrackCreator from "@/components/TrackCreator.vue";

import { mapState } from "vuex";

export default {
  name: "TrackConfigurationTab",
  components: {
    TrackCreator
  },
  methods: {
    remove(index) {
      this.$store.commit("tracks.remove", index);
    },
    edit(index) {
      this.$refs.track_creator.edit({ index, track: this.tracks[index] });
    },
    refreshTrackDataset(track) {
      track.data = undefined;
    },
    setTrackDataset(set, index) {
      this.$store.commit("tracks.set_data", {
        data: this.dataSets[
          this.simplifiedDatasets(this.tracks[index]).indexOf(set)
        ],
        index
      });
    },
    narrowedDatasets(track) {
      return this.$store.getters.validDataSets.filter(
        set => set.transformations[1].mapTrackType === track.type
      );
    },
    simplifiedDatasets(track) {
      return this.narrowedDatasets(track).map(set => set.name);
    }
  },
  computed: {
    ...mapState(["tracks", "dataSets"])
  }
};
</script>

<style lang="scss" scoped>
</style>