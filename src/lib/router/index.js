import Vue from 'vue'
import Router from 'vue-router'
import HelloVanilla from "@/components/HelloVanilla.vue"
import PageNotFound from "@/components/PageNotFound.vue"
import UserLogin from "@/components/UserLogin/UserLogin.vue"
import Dashboard from "@/components/Dashboard/Dashboard"
import DashboardRoot from "@/components/Dashboard/DashboardRoot"
import NewSession from "@/components/Session/NewSession"
import Sessions from "@/components/Session/Sessions"
import SessionRoot from "@/components/Session/SessionRoot"
import Live from "@/components/Live/Live"
import Waiting from "@/components/Live/Waiting"

Vue.use(Router)

const routes = [
  { path: '/pagenotfound', component: PageNotFound, meta: { layout: "auth" }},
  { path: '/user/login', component: UserLogin, name: "UserLogin", meta: { layout: "auth" } },
  { path: '/', component: HelloVanilla, name: "HelloVanilla", meta: { layout: "auth" } },
  {
    path: '/dashboard', component: DashboardRoot, children: [
      {
        path: '/',
        component: Dashboard,
        name: "Dashboard",
        meta: { layout: "standard" }
      }
    ]
  },
  {
    path: '/session', component: SessionRoot, name: "Session",children: [
      {
        path: 'all',
        component: Sessions,
        name: "Sessions",
        meta: { layout: "standard" }
      },
      {
        path: 'new',
        component: NewSession,
        name: "NewSession",
        meta: { layout: "standard" }
      }
    ]
  },
  {
    path: '/live/:id',
    component: Live,
    name: "Live",
    meta: { layout: "auth" }
  },
  {
    path: '/waiting/:id',
    component: Waiting,
    name: "Waiting",
    meta: { layout: "auth" }
  }
]
  
const router = new Router({
  mode: 'history',
  routes
})

export default router;

