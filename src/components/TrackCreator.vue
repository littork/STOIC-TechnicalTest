<template>
  <div>
    <v-dialog v-model="dialog" persistent max-width="600px">
      <template v-slot:activator="{ on }">
        <v-btn tile depressed block v-on="on">Add Track</v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">Add New Track</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <FormTree :nodes="trackTypeForm" v-model="trackType" />
            <FormTree :nodes="tracksMetadata[selectedTrackType].params" v-model="track" />
          </v-container>
        </v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="blue darken-1" text @click="dialog = false">Close</v-btn>
          <v-btn color="blue darken-1" text @click="createTrack">Create</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import FormTree from "@/components/FormTree";

import * as tracksMetadataJSON from "@/circos.tracks.json";

export default {
  name: "TrackCreator",
  data: () => ({
    dialog: false,
    track: {},
    selectedTrackType: 0
  }),
  components: {
    FormTree
  },
  computed: {
    trackType: {
      get() {
        return { trackType: "Chords" };
      },
      set(v) {
        this.track = {};
        // TODO This NEEDS to be redone before globalization is added
        this.selectedTrackType = this.tracksMetadata.findIndex(
          track => track.name.globalize.en === v.trackType
        );
      }
    },
    tracksMetadata() {
      return tracksMetadataJSON.default;
    },
    trackTypeForm() {
      return [
        {
          id: "trackType",
          name: {
            globalize: {
              en: "Track Type"
            }
          },
          datatype: "dropdown",
          options: {
            categories: this.tracksMetadata.map(track => ({
              id: track.id,
              name: track.name
            }))
          }
        }
      ];
    }
  },
  methods: {
    createTrack() {
      console.log("Would be creating track");
      console.log(this.track);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>