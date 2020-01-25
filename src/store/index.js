'use strict'

import Vue from 'vue';
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    layout: 'before-auth',
    selectedDate: null,
    currentSession: {
      loggedIn: false,
      sessionId: null,
      email: null,
      role: null
    }
  },
  mutations: {
    SET_LAYOUT (state, payload) {
      state.layout = payload
    },
    SET_SELECTED_DATE(state,payload) {
      state.selectedDate = payload;
    },
    LOGIN_CURRENT_SESSION(state, payload) {
      state.currentSession = {
        loggedIn: true,
        sessionId: payload.sessionId,
        email: payload.email,
        role: payload.role
      }
    },
    LOGOUT_CURRENT_SESSION(state) {
      state.currentSession = {
        loggedIn: false,
        sessionId: null,
        email: null,
        role: null
      }
    }
  },
  getters: {
    layout (state) {
      return state.layout
    },
    selectedDate(state) {
      return state.selectedDate
    },
    currentSession(state) {
      return state.currentSession
    }
  }
})

export default store;