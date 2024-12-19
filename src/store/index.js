// src/store/index.js
import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    token: localStorage.getItem('token') || ''
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user
    },
    SET_TOKEN(state, token) {
      state.token = token
      localStorage.setItem('token', token)
    },
    LOGOUT(state) {
      state.user = null
      state.token = ''
      localStorage.removeItem('token')
    }
  },
  actions: {
    login({ commit }, credentials) {
      return axios.post('/api/login', credentials).then(response => {
        commit('SET_USER', response.data.user)
        commit('SET_TOKEN', response.data.token)
      })
    },
    logout({ commit }) {
      commit('LOGOUT')
    },
    getUser({ commit }) {
      return axios.get('/api/user', {
        headers: {
          Authorization: `Bearer ${this.state.token}`
        }
      }).then(response => {
        commit('SET_USER', response.data)
      })
    }
  }
})
