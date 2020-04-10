import Vue from 'vue'
import Router from 'vue-router'
import PageNotFound from "@/components/PageNotFound.vue"
import UserLogin from "@/components/UserLogin/UserLogin.vue"
import NewSession from "@/components/Session/NewSession"
import EditSession from "@/components/Session/EditSession"
import Sessions from "@/components/Session/Sessions"
import LiveTest from "@/components/Live/LiveTest"
import Standard from "@/components/Layouts/Standard"
// import Waiting from "@/components/Live/Waiting"
import Admin from "@/components/Users/Admin"
import Students from "@/components/Users/Students"
import Lecturers from "@/components/Users/Lecturers"
import store from "@/store/index";
import authStore from "@/lib/vuex/store/authStore"
import Cookies from "js-cookie"

Vue.use(Router)

const routes = [
  { path: '/', component: UserLogin, name: "UserLogin",  },
  {
    path: '/session', component: Standard, name: "Session",children: [
      {
        path: ':id/edit',
        component: EditSession,
        name: 'EditSession'
      },
      {
        path: 'all',
        component: Sessions,
        name: "Sessions",
      },
      {
        path: 'new',
        component: NewSession,
        name: "NewSession",
        beforeEnter: async function(to, from, next) {
          if(authStore.state.user.role.includes('admin') || authStore.state.user.role.includes('lecturer')) {
            next()
          }else {
            next(`/session/all`)
          }
        }
      },
    ],
    beforeEnter: async function(to, from, next) {
      if(Cookies.get('user')) {
        await authStore.commit('loggedIn', JSON.parse(Cookies.get('user')));
        next()
      }else {
        next(`/`)
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
        next(`/`)
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
        return next('/');
      }
      if(authStore.state.session.sessionId) {
        next()
      }else {
        window.console.log(to, store.getters.currentRoomActive, store.getters.currentSession)
        next(`/session/all`)
      }
    }
  },
  // {
  //   path: '/waiting/:id',
  //   component: Waiting,
  //   name: "Waiting",
  //   meta: { layout: "auth" },
  //   beforeEnter: async function(to, from, next) {
  //     if(Cookies.get('user')) {
  //       await authStore.commit('loggedIn', JSON.parse(Cookies.get('user')));
  //       next()
  //     }else {
  //       next(`/`)
  //     }
  //   }
  // },
  { path: "*", component: PageNotFound }
]
  
const router = new Router({
  mode: 'history',
  routes
})

export default router;

