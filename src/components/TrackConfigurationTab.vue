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
      <div v-for="(track, index) in tracks" v-bind:key="`${track.name}-${index}-${track.type}`">
        <v-banner single-line>
          {{ track.name }}
          <template v-slot:actions>
            <v-chip outlined class="mx-auto">{{ track.type }}</v-chip>
            <v-btn text @click="edit(index)">Edit</v-btn>
            <v-btn text @click="remove(index)">Remove</v-btn>
          </template>
        </v-banner>
      </div>
    </div>
    <TrackCreator ref="track_creator" />
  </div>
</template>

<script>
import TrackCreator from "@/components/TrackCreator.vue";

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
    }
  },
  computed: {
    tracks() {
      return this.$store.state.tracks;
    }
  }
};
</script>

<style lang="scss" scoped>
</style>