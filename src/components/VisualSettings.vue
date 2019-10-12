<template>
  <v-card>
    <v-toolbar flat>
      <v-spacer />
      <v-toolbar-title>Circos Settings</v-toolbar-title>
      <v-spacer />
    </v-toolbar>
    <v-divider></v-divider>
    <v-tabs vertical background-color="blue darken-1" slider-color="blue darken-4" dark>
      <v-tab>
        <v-icon left>mdi-grid</v-icon>Datasets
      </v-tab>
      <v-tab>
        <v-icon left>mdi-wrench</v-icon>Layout
      </v-tab>
      <v-tab>
        <v-icon left>mdi-layers-triple</v-icon>Tracks
      </v-tab>

      <v-tab-item class="tab-item-wrapper">
        <DataSetTab class="data-set-tab" />
      </v-tab-item>
      <v-tab-item class="tab-item-wrapper">
        <LayoutConfigurationTab />
      </v-tab-item>
      <v-tab-item class="tab-item-wrapper">
        <TrackConfigurationTab />
      </v-tab-item>
    </v-tabs>
  </v-card>
</template>

<script>
import DataSetTab from "@/components/DataSetTab";
import LayoutConfigurationTab from "@/components/LayoutConfigurationTab";
import TrackConfigurationTab from "@/components/TrackConfigurationTab";

export default {
  name: "VisualSettings",
  components: {
    DataSetTab,
    LayoutConfigurationTab,
    TrackConfigurationTab
  }
};
</script>

<style lang="scss" scoped>
.tab-item-wrapper {
  /* vuetify sets the v-tabs__container height to 48px */
  height: calc(100vh - 65px);

  overflow: auto;
}
</style>