import firebase from 'firebase'

class Order {
  constructor (name, phone, adId, done = false, id = null) {
    this.name = name
    this.phone = phone
    this.done = done
    this.id = id
  }
}

export default{
  state: {
    orders: []
  },
  mutations: {
    loadOrders (state, payload) {
      state.orders = payload
    }
  },
  actions: {
    async createOrder ({ commit, getters }, { name, phone, adId }) {
      const ownerId = getters.user.id
      const order = new Order(name, phone, adId)
      commit('clearError')

      try {
        await firebase.database().ref(`/user-orders/${ownerId}`).push(order)
      } catch (e) {
        commit('setError', e.message)
        throw e
      }
    },
    async fetchOrders ({ commit, getters }) {
      commit('setLoading', true)
      commit('clearError')
      const ownerId = getters.user.id

      const resultOrders = []

      try {
        const fbValue = await firebase.database().ref(`/user-orders/${ownerId}`).once('value')
        const orders = fbValue.val()

        Object.keys(orders).forEach(key => {
          const o = orders[key]
          resultOrders.push(new Order(o.name, o.phone, o.adId, o.done, key))
        })

        commit('loadOrders', resultOrders)
        commit('setLoading', false)
      } catch (e) {
        commit('setLoading', false)
        commit('setError', e.message)
        throw e
      }
    },
    async markOrderDone ({ commit, getters }, payload) {
      commit('clearError')
      const ownerId = getters.user.id

      try {
        await firebase.database().ref(`/user-orders/${ownerId}`)
          .child(payload).update({ done: true })
      } catch (e) {
        commit('setError', e.message)
        throw e
      }
    }
  },
  getters: {
    doneOrders (state) {
      return state.orders.filter(o => o.done)
    },
    undoneOrders (state) {
      return state.orders.filter(o => !o.done)
    },
    orders (state, getters) {
      return getters.undoneOrders.concat(getters.doneOrders)
    }
  }
}
