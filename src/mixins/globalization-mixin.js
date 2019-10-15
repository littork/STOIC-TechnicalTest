import store from "@/store";

import { LOCALE_STRINGS } from "@/globalization";

export default {
  data: () => ({
    globalization: {
      lang() {
        return store.state.language;
      },
      go(v, capitalize) {
        if (capitalize) {
          const result = LOCALE_STRINGS[v][store.state.language];
          return `${result.charAt(0).toUpperCase()}${result.slice(1)}`;
        } else {
          return LOCALE_STRINGS[v][store.state.language];
        }
      }
    }
  }),
  computed: {
    $l() {
      return this.globalization;
    }
  }
};
