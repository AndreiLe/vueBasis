import store from '../store'

export default function (to, from, next) {
  if (store.getters.user) {
    next()
  } else {
    const loginpath = to.path
    next({ name: 'login', query: { path: loginpath, loginError: true } })
  }
}
