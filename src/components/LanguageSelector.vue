<template>
  <v-select :items="languageNames" v-model="language" />
</template>

<script>
import { LANGUAGES } from "@/globalization.js";

export default {
  name: "LanguageSelector",
  computed: {
    language: {
      get() {
        return LANGUAGES[
          LANGUAGES.findIndex(l => l.id === this.$store.state.language)
        ].name;
      },
      set(v) {
        this.$store.commit(
          "language.set",
          LANGUAGES[LANGUAGES.findIndex(l => l.name === v)].id
        );
      }
    },
    languageNames() {
      return LANGUAGES.map(v => v.name);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>