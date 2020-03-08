import Vue from 'vue'
import App from './App.vue'
import "@/lib/cssLoader/index"
import "@/lib/form/index"
import "@/lib/vuex/index"
import store from "@/store/index"
import router from "@/lib/router/index"
import vuetify from './lib/vuetify'
import VModal from 'vue-js-modal'
import DatetimePicker from 'vuetify-datetime-picker'
import VueQrcode from '@chenfengyuan/vue-qrcode';
import VTooltip from 'v-tooltip'
import VueSignaturePad from 'vue-signature-pad';
import VueScheduler from 'v-calendar-scheduler';
import VueVideoPlayer from 'vue-video-player'
import VueYoutube from 'vue-youtube'
import VueLoaders from 'vue-loaders';
import VueDocPreview from 'vue-doc-preview'
import Cloudinary from 'cloudinary-vue';
import OwlCarousel from 'v-owl-carousel'
 
// CSS Import
import 'v-calendar-scheduler/lib/main.css';
import 'hover.css/css/hover.css'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import 'video.js/dist/video-js.css'
import 'vue-loaders/dist/vue-loaders.css';
 
Vue.use(VueSignaturePad);
Vue.component('carousel', OwlCarousel)
Vue.use(VTooltip)
Vue.use(DatetimePicker)
Vue.use(VModal)
Vue.use(VueScheduler);
Vue.component(VueQrcode.name, VueQrcode);
Vue.use(VueVideoPlayer)
Vue.use(VueYoutube)
Vue.use(VueLoaders);
Vue.use(VueDocPreview);
Vue.use(Cloudinary, {
  configuration: {
    cloudName: "dnsrf3okp"
  }
});
// Vue.use(library) makes the Vue components <router-view> from the library interpretable during runtime
Vue.config.productionTip = false


new Vue({
  el: '#app',
  router,
  vuetify,
  store,
  render: h => h(App)
})
