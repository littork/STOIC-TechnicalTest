<template>
  <div>
    <v-dialog v-model="dialog" persistent max-width="600px">
      <template v-slot:activator="{}">
        <v-btn tile depressed block @click="showDialog">Add Track</v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">{{ editing ? "Edit" : "Add New" }} Track</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <FormTree :nodes="trackTypeForm" v-model="trackType" />
            <FormTree
              :nodes="tracksMetadata[selectedTrackType].params"
              v-model="track"
              ref="track_formtree"
            />
          </v-container>
        </v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="blue darken-1" text @click="close">Close</v-btn>
          <v-btn color="blue darken-1" text @click="editTrack" v-if="editing">Edit</v-btn>
          <v-btn color="blue darken-1" text @click="createTrack" v-else>Create</v-btn>
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
    selectedTrackType: 0,

    editing: false,
    editIndex: 0
  }),
  components: {
    FormTree
  },
  computed: {
    trackType: {
      get() {
        return {
          trackType:
            this.tracksMetadata[this.selectedTrackType].name.globalize.en ||
            "Chords",
          id: this.tracksMetadata[this.selectedTrackType].id || "chords"
        };
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
    showDialog() {
      this.dialog = true;
      this.editing = false;

      if (this.$refs && this.$refs.track_formtree) {
        this.$refs.track_formtree.forceSyncSchema();
      }
    },
    edit(payload) {
      this.showDialog();
      this.editing = true;

      this.editIndex = payload.index;
      this.track = payload.track;
    },
    close() {
      this.dialog = false;
    },
    markTrackType() {
      this.track.type = this.trackType.trackType;
      this.track.id = this.trackType.id;
    },
    editTrack() {
      this.markTrackType();
      this.$store.commit("tracks.edit", {
        index: this.editIndex,
        track: this.track
      });
      this.close();
    },
    createTrack() {
      this.markTrackType();
      this.$store.commit("tracks.add", { track: this.track, autoname: true });

      this.close();
    }
  }
};
</script>

<style lang="scss" scoped>
</style>