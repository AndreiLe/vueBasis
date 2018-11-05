import Vue from 'vue'
import Vuex from 'vuex'
import adsStoreModul from '../components/ads/adsStoreModul'
import userStoreModul from '../components/user/userStoreModul'
import commonStoreModul from './commonStoreModul'
import orderStoreModul from '../components/user/orderStoreModul'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    adsStoreModul,
    userStoreModul,
    commonStoreModul,
    orderStoreModul
  },
  state: {

  },
  mutations: {

  },
  actions: {

  }
})
