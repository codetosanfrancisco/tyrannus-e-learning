import Vue from 'vue'
import App from './App.vue'
import "@/assets/cssLoader/index"
import "@/assets/form/index"
import router from "@/assets/router/index"

// Vue.use(library) makes the Vue components <router-view> from the library interpretable during runtime
Vue.config.productionTip = false

new Vue({
  el: '#app', router, render: h => h(App)
})
