import Vue from 'vue';
import VueForm from 'vue-form';
import { ValidationProvider } from 'vee-validate'

Vue.use(VueForm)
Vue.component('ValidationProvider', ValidationProvider)