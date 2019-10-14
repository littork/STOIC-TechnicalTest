<template>
  <div>
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="headline">Tracks</v-list-item-title>
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
              <v-btn text @click="edit(index)" small>Edit</v-btn>
              <v-btn text @click="remove(index)" small>Remove</v-btn>
            </div>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-select
              :items="simplifiedDatasets"
              filled
              label="Dataset"
              hide-details
              @change="setTrackDataset($event, index)"
            ></v-select>
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
    setTrackDataset(set, index) {
      this.$store.commit("tracks.setdata", {
        data: this.dataSets[this.simplifiedDatasets.indexOf(set)],
        index
      });
    }
  },
  computed: {
    ...mapState(["tracks", "dataSets"]),
    simplifiedDatasets() {
      return this.dataSets.map(set => set.name);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>