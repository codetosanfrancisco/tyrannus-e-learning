import Vuex from 'vuex'

const authStore = new Vuex.Store({
    state: {
      loggedIn: false,
      user: null
    },
    mutations: {
      loggedIn(state, user) {
          state.loggedIn = true
          state.user = user;
      },
      logOut(state) {
        state.loggedIn = false
        state.user = {}
    }
    }
  })

export default authStore;