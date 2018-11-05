import firebase from 'firebase'
import _ from 'lodash'

class Ad {
  constructor (title, description, promo = false, imageSrc = '', id = null) {
    this.title = title
    this.description = description
    this.imageSrc = imageSrc
    this.promo = promo
    this.id = id
  }
}

export default {
  state: {
    ads: [],
    userAds: []
  },
  mutations: {
    createAd (state, payload) {
      state.ads.push(payload)
      state.userAds.push(payload.id)
    },
    loadUserAds (state, payload) {
      state.userAds = payload
    },
    loadAds (state, payload) {
      state.ads = payload
    },
    updateAd (state, { title, description, id }) {
      const ad = state.ads.find(a => {
        return a.id === id
      })

      ad.title = title
      ad.description = description
    },
    deleteAd (state, { adId }) {
      const userAdIndex = state.userAds.indexOf(adId)
      state.userAds.splice(userAdIndex, 1)
      const adIndex = state.ads.findIndex(ad => ad.id === adId)
      state.ads.splice(adIndex, 1)
    }
  },
  actions: {
    async createOrder ({ commit }) {
      return 1
    },
    async createAd ({ commit, getters }, payload) {
      commit('clearError')
      commit('setLoading', true)

      const image = payload.image

      try {
        const newAd = new Ad(payload.title, payload.description, payload.promo)

        const adsPath = `ads/`
        const firebaseResult = await firebase.database().ref(adsPath).push(newAd)

        const imageExt = image.name.slice(image.name.lastIndexOf('.'))
        const imgPath = `${adsPath}${firebaseResult.key}${imageExt}`
        await firebase.storage().ref(imgPath).put(image)
        const imageSrc = await firebase.storage().ref(imgPath).getDownloadURL()

        await firebase.database().ref(adsPath).child(firebaseResult.key).update({ imageSrc })

        const userPath = `user-ads/${getters.user.id}`
        await firebase.database().ref(userPath).push(firebaseResult.key)

        commit('setLoading', false)
        commit('createAd', { ...newAd, id: firebaseResult.key, imageSrc })
      } catch (error) {
        commit('setError', error.message)
        commit('setLoading', false)
        throw error
      }
    },
    async fetchUserAds ({ commit, getters }) {
      commit('clearError')
      commit('setLoading', true)

      try {
        const resultUserAds = []
        const userPath = `user-ads/${getters.user.id}`
        const firebaseUserResult = await firebase.database().ref(userPath).once('value')
        const userAds = firebaseUserResult.val()

        if (userAds !== null) {
          Object.keys(userAds).forEach(key => {
            const userAdsKey = userAds[key]
            resultUserAds.push(userAdsKey)
          })
        }
        commit('loadUserAds', resultUserAds)
        commit('setLoading', false)
      } catch (e) {
        commit('setError', e.message)
        commit('setLoading', false)
        throw e
      }
    },
    async fetchAds ({ commit, getters }) {
      commit('clearError')
      commit('setLoading', true)

      try {
        const resultAds = []
        const adsPath = `ads/`
        const firebaseResult = await firebase.database().ref(adsPath).once('value')
        const ads = firebaseResult.val()

        if (ads !== null) {
          Object.keys(ads).forEach(key => {
            const ad = ads[key]
            const newAd = new Ad(ad.title, ad.description, ad.promo, ad.imageSrc, key)
            resultAds.push(newAd)
          })
        }

        commit('loadAds', resultAds)
        commit('setLoading', false)
      } catch (error) {
        commit('setError', error.message)
        commit('setLoading', false)
        throw error
      }
    },
    async updateAd ({ state, commit, getters }, { title, description, id }) {
      commit('clearError')
      commit('setLoading', true)

      if (_.isUndefined(id) || !state.userAds.includes(id)) {
        const errorMessage = 'Id error!'
        commit('setError', errorMessage)
        commit('setLoading', false)
        throw errorMessage
      }

      try {
        const adsPath = `ads/`
        await firebase.database().ref(adsPath).child(id).update({
          title,
          description
        })
        commit('updateAd', {
          title,
          description,
          id
        })
        commit('setLoading', false)
      } catch (error) {
        commit('setError', error.message)
        commit('setLoading', false)
        throw error
      }
    },
    async deleteAd ({ commit, getters }, { adId }) {
      commit('clearError')

      try {
        await firebase.database().ref(`/ads/`).child(adId).remove()
        commit('deleteAd', { adId })
      } catch (e) {
        commit('setError', e.message)
        throw e
      }
    }
  },
  getters: {
    ads (state) {
      return state.ads
    },
    promoAds (state) {
      return state.ads.filter(ad => {
        return !!ad.promo
      })
    },
    myAds (state) {
      return state.ads.filter(ad => {
        return state.userAds.includes(ad.id)
      })
    },
    adById (state) {
      return adId => {
        const ad = state.ads.find((ad) => {
          const result = (ad.id === adId)
          return result
        })
        return ad
      }
    },
    isMyAdById (state) {
      return adId => {
        return state.userAds.includes(adId)
      }
    }
  }
}
