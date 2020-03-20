import Vue from 'vue'
import Router from 'vue-router'
import HelloVanilla from "@/components/HelloVanilla.vue"
import PageNotFound from "@/components/PageNotFound.vue"
import UserLogin from "@/components/UserLogin/UserLogin.vue"
import UserSignUp from "@/components/UserSignUp/UserSignUp.vue"
import NewSession from "@/components/Session/NewSession"
import Sessions from "@/components/Session/Sessions"
import Session from "@/components/Session/Session"
import LiveTest from "@/components/Live/LiveTest"
import Standard from "@/components/Layouts/Standard"
import Waiting from "@/components/Live/Waiting"
import Admin from "@/components/Users/Admin"
import Students from "@/components/Users/Students"
import Lecturers from "@/components/Users/Lecturers"
import store from "@/store/index";
import authStore from "@/lib/vuex/store/authStore"
import Cookies from "js-cookie"

Vue.use(Router)

const routes = [
  { path: '/pagenotfound', component: PageNotFound},
  { path: '/user/login', component: UserLogin, name: "UserLogin",  },
  { path: '/user/signup', component: UserSignUp, name: "UserSignUp",  },
  { path: '/', component: HelloVanilla, name: "HelloVanilla",  },
  {
    path: '/session', component: Standard, name: "Session",children: [
      {
        path: 'all',
        component: Sessions,
        name: "Sessions",
      },
      {
        path: 'new',
        component: NewSession,
        name: "NewSession",
      },
      {
        path: ':id',
        component: Session,
        name: 'Session'
      }
    ],
    beforeEnter: async function(to, from, next) {
      if(Cookies.get('user')) {
        await authStore.commit('loggedIn', JSON.parse(Cookies.get('user')));
        next()
      }else {
        next(`/user/login`)
      }
    }
  },
  {
    path: '/users', component: Standard, name: "Session",children: [
      { path: 'admin', component: Admin, name: "Admin",  },
      { path: 'students', component: Students, name: "Students",  },
      { path: 'lecturers', component: Lecturers, name: "Lecturers",  }
    ],
    beforeEnter: async function(to, from, next) {
      if(Cookies.get('user')) {
        await authStore.commit('loggedIn', JSON.parse(Cookies.get('user')));
        next()
      }else {
        next(`/user/login`)
      }
    }
  },
  {
    path: '/live/:id',
    component: LiveTest,
    name: "Live",
    meta: { layout: "auth" },
    beforeEnter: (to, from, next) => {
      if(!Cookies.get('user')) {
        return next('/user/login');
      }
      if(authStore.state.session.sessionId) {
        next()
      }else {
        window.console.log(to, store.getters.currentRoomActive, store.getters.currentSession)
        next(`/session/all`)
      }
    }
  },
  {
    path: '/waiting/:id',
    component: Waiting,
    name: "Waiting",
    meta: { layout: "auth" },
    beforeEnter: async function(to, from, next) {
      if(Cookies.get('user')) {
        await authStore.commit('loggedIn', JSON.parse(Cookies.get('user')));
        next()
      }else {
        next(`/user/login`)
      }
    }
  }
]
  
const router = new Router({
  mode: 'history',
  routes
})

export default router;

