import Vuex from 'vuex'

const authStore = new Vuex.Store({
    state: {
      loggedIn: false,
      user: {

      }
    },
    mutations: {
      loggedIn(state) {
          state.loggedIn = true
      },
      logOut(state) {
        state.loggedIn = false
        state.user = {}
    }
    }
  })

export default authStore;