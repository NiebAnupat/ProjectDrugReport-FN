export const state = () => ({
  user: null
});

export const getters = {
  user: state => state.user
};
export const mutations = {
  setUser(state, user) {
    state.user = user;
  }
};

export const actions = {

  login({ commit }, user) {
    commit("setUser", user);
    this.$router.push("/admin");
  },

  logout({ commit }) {
    commit("setUser", null);
    this.$router.push("/");
  }
};
