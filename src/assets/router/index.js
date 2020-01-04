import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from "@/components/HelloWorld.vue";
import PageNotFound from "@/components/PageNotFound.vue"

Vue.use(Router)

const routes = [
    { path: '/', component: HelloWorld },
    { path: '/pagenotfound', component: PageNotFound }
  ]
  
const router = new Router({
    routes // short for `routes: routes`
})

export default router;

