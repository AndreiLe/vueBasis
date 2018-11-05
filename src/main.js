import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vuetify from 'vuetify'
import BuyAdModalComponent from '@/components/ads/BuyAdModal'
import DeleteAdModalComponent from '@/components/ads/DeleteAdModal'
import 'vuetify/dist/vuetify.css'
import '@mdi/font/css/materialdesignicons.css'
import firebase from 'firebase'
import _ from 'lodash'
import colors from 'vuetify/es5/util/colors'

Vue.config.productionTip = false
Vue.use(Vuetify, {
  iconfont: 'mdi',
  theme: {
    primary: colors.red.darken1,
    secondary: colors.red.lighten4,
    accent: colors.indigo.base
  }
})
Vue.component('app-buy-modal', BuyAdModalComponent)
Vue.component('app-delete-modal', DeleteAdModalComponent)

new Vue({
  router,
  store,
  created () {
    const config = {
      apiKey: 'AIzaSyAeCZR5E1KkvZ6spO7p92EwkkJnpOC11lg',
      authDomain: 'vuebasic-66bc6.firebaseapp.com',
      databaseURL: 'https://vuebasic-66bc6.firebaseio.com',
      projectId: 'vuebasic-66bc6',
      storageBucket: 'vuebasic-66bc6.appspot.com',
      messagingSenderId: '309243844158'
    }
    const app = firebase.initializeApp(config)

    firebase.auth().onAuthStateChanged(user => {
      this.$store.dispatch('fetchAds')
      if (!_.isUndefined(user) && !_.isUndefined(user.uid)) {
        this.$store.dispatch('autoLoginUser', user)
          .then((e) => {
            this.$store.dispatch('fetchUserAds')
              .then(() => {
                this.$router.push(this.$route.query['path'])
              })
          })
      }
    })
  },
  render: h => h(App)
}).$mount('#app')
