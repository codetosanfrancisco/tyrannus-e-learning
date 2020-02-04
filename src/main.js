import Vue from 'vue'
import App from './App.vue'
import "@/lib/cssLoader/index"
import "@/lib/form/index"
import "@/lib/vuex/index"
import "@/lib/sideBar/index"
import store from "@/store/index"
import router from "@/lib/router/index"
import vuetify from './lib/vuetify'
import VModal from 'vue-js-modal'
import DatetimePicker from 'vuetify-datetime-picker'
import VueQrcode from '@chenfengyuan/vue-qrcode';
import VTooltip from 'v-tooltip'

Vue.use(VTooltip)

Vue.component(VueQrcode.name, VueQrcode);

Vue.use(DatetimePicker)
 
Vue.use(VModal)
// Import VueScheduler
import VueScheduler from 'v-calendar-scheduler';

// Import styles
import 'v-calendar-scheduler/lib/main.css';

Vue.use(VueScheduler);

// Vue.use(library) makes the Vue components <router-view> from the library interpretable during runtime
Vue.config.productionTip = false


new Vue({
  el: '#app',
  router,
  vuetify,
  store,
  render: h => h(App)
})
