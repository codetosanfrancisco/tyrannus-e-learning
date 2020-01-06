import Vue from 'vue'
import Router from 'vue-router'
import HelloVanilla from "@/components/HelloVanilla.vue"
import PageNotFound from "@/components/PageNotFound.vue"
import UserLogin from "@/components/UserLogin/UserLogin.vue"

Vue.use(Router)

const routes = [
  { path: '/pagenotfound', component: PageNotFound },
  { path: '/users/login', component: UserLogin },
  { path: '/', component: HelloVanilla },
  ]
  
const router = new Router({
  mode: 'history',
  routes
})

export default router;

