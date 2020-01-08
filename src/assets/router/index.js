import Vue from 'vue'
import Router from 'vue-router'
import HelloVanilla from "@/components/HelloVanilla.vue"
import PageNotFound from "@/components/PageNotFound.vue"
import UserLogin from "@/components/UserLogin/UserLogin.vue"
import Dashboard from "@/components/Dashboard/Dashboard"
import CreateSession from "@/components/Session/CreateSession"
import AllSession from "@/components/Session/AllSession"

Vue.use(Router)

const routes = [
  { path: '/pagenotfound', component: PageNotFound },
  { path: '/user/login', component: UserLogin },
  { path: '/', component: HelloVanilla },
  { path: '/dashboard', component: Dashboard },
  { path: '/session/new', component: CreateSession },
  { path: '/sessions', component: AllSession }
]
  
const router = new Router({
  mode: 'history',
  routes
})

export default router;

