import Vue from 'vue'
import App from './App.vue'
import "@/assets/cssLoader/index"
import "@/assets/form/index"
import "@/assets/vuex/index"
import "@/assets/sideBar/index"
import store from "@/store/index"
import router from "@/assets/router/index"
import vuetify from './plugins/vuetify';

// Vue.use(library) makes the Vue components <router-view> from the library interpretable during runtime
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  vuetify,
  store,
  render: h => h(App)
})
