'use strict'

import Vue from 'vue';
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    layout: 'before-auth',
    selectedDate: null
  },
  mutations: {
    SET_LAYOUT (state, payload) {
      state.layout = payload
    },
    SET_SELECTED_DATE(state,payload) {
      state.selectedDate = payload;
    }
  },
  getters: {
    layout (state) {
      return state.layout
    },
    selectedDate(state) {
      return state.selectedDate
    }
  }
})

export default store;