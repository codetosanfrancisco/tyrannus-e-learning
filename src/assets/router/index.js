import Vue from 'vue'
import Router from 'vue-router'
import HelloVanilla from "@/components/HelloVanilla.vue"
import PageNotFound from "@/components/PageNotFound.vue"
import UserLogin from "@/components/UserLogin/UserLogin.vue"
import Dashboard from "@/components/Dashboard/Dashboard"

Vue.use(Router)

const routes = [
  { path: '/pagenotfound', component: PageNotFound },
  { path: '/users/login', component: UserLogin },
  { path: '/', component: HelloVanilla },
  { path: '/dashboard', component: Dashboard }
]
  
const router = new Router({
  mode: 'history',
  routes
})

export default router;

