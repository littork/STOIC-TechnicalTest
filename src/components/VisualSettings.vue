<template>
  <v-card>
    <v-toolbar flat>
      <v-spacer />
      <v-toolbar-title>{{ $l.go("CIRCOS_SETTINGS") }}</v-toolbar-title>
      <v-spacer />
    </v-toolbar>
    <v-divider></v-divider>
    <v-tabs
      vertical
      background-color="blue darken-1"
      slider-color="blue darken-4"
      dark
      ref="visual_tabs"
    >
      <v-tab>
        <v-icon left>mdi-grid</v-icon>
        <v-spacer />
        {{ $l.go("TAB_DATASETS") }}
      </v-tab>
      <v-tab>
        <v-icon left>mdi-wrench</v-icon>
        <v-spacer />
        {{ $l.go("TAB_LAYOUT") }}
      </v-tab>
      <v-tab>
        <v-icon left>mdi-layers-triple</v-icon>
        <v-spacer />
        {{ $l.go("TAB_TRACKS") }}
      </v-tab>
      <v-tab>
        <v-icon left>mdi-export-variant</v-icon>
        <v-spacer />
        {{ $l.go("TAB_EXPORT") }}
      </v-tab>
      <v-btn @click.stop="openGitHub()" class="flex-horizontal mt-6 mx-2">
        <v-icon left>mdi-github-circle</v-icon>
        <v-spacer />GitHub
      </v-btn>
      <LanguageSelector class="px-4 custom-language-selector" />

      <v-tab-item class="tab-item-wrapper">
        <DataSetTab class="data-set-tab" />
      </v-tab-item>
      <v-tab-item class="tab-item-wrapper">
        <LayoutConfigurationTab />
      </v-tab-item>
      <v-tab-item class="tab-item-wrapper">
        <TrackConfigurationTab />
      </v-tab-item>
      <v-tab-item class="tab-item-wrapper">
        <ExportTab />
      </v-tab-item>
    </v-tabs>
  </v-card>
</template>

<script>
import DataSetTab from "@/components/DataSetTab";
import LayoutConfigurationTab from "@/components/LayoutConfigurationTab";
import TrackConfigurationTab from "@/components/TrackConfigurationTab";
import ExportTab from "@/components/ExportTab";
import LanguageSelector from "@/components/LanguageSelector";

export default {
  name: "VisualSettings",
  components: {
    DataSetTab,
    LayoutConfigurationTab,
    TrackConfigurationTab,
    ExportTab,
    LanguageSelector
  },
  methods: {
    openGitHub() {
      window.open("https://github.com/littork/STOIC-TechnicalTest", "_blank");
    }
  }
};
</script>

<style lang="scss" scoped>
.tab-item-wrapper {
  height: calc(100vh - 65px);

  overflow: auto;
}

.custom-language-selector {
  width: 131.8333px;
  position: fixed;
  bottom: -12px;
}
</style>