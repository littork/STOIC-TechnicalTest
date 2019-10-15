import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";

Vue.config.productionTip = false;

import globalizationMixin from "@/mixins/globalization-mixin";
Vue.mixin(globalizationMixin);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
