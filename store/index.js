import Cookies from 'js-cookie'
import CookieParser from 'cookieparser'
export const state = () => ({
  user: null,
})

export const getters = {
  user: (state) => state.user,
}
export const mutations = {
  setUser(state, user) {
    state.user = user
  },
}

export const actions = {
  async nuxtServerInit({ commit, dispatch }, { req }) {
    console.log('nuxtServerInit....')
    if (process.server && process.static) return
    if (!req.headers.cookie) return

    const parsed = CookieParser.parse(req.headers.cookie)
    const token = parsed.jwt

    if (!token) return

    const decoded = await this.$axios.$get('/auth', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const user = {
      email: decoded.email,
      username: decoded.username,
    }
    commit('setUser', user)
  },

  async login({ commit }, user) {
    const token = await this.$axios.$post('auth', user)
    if (!token) return false
    Cookies.set('jwt', token)
    const decoded = await this.$axios.$get('auth', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    commit('setUser', {
      email: decoded.email,
      username: decoded.username,
    })
    this.$router.push('/admin')
    return true
  },

  async logout({ commit }) {
    // localStorage.removeItem('jwt')
    Cookies.remove('jwt')
    commit('setUser', null)
    await this.$router.push('/')
  },
}
