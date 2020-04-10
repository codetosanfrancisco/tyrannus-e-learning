import Vuex from 'vuex'

const authStore = new Vuex.Store({
    state: {
      loggedIn: false,
      user: null,
      session: {
        email: null,
        role: null,
        sessionId: null,
        name: null
      }
    },
    mutations: {
      loggedIn(state, user) {
          state.loggedIn = true
          state.user = user;
      },
      logOut(state) {
        state.loggedIn = false
        state.user = {}
      },
      logInSession(state, obj){
        state.session = obj;
      }
    }
  })

export default authStore;