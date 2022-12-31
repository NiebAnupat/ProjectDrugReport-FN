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

  async nuxtClientInit({ commit, dispatch }) {
    console.log("nuxtClientInit....");
    if (process.server && process.static) return;
    // if (!process.client) return;

    const token = JSON.parse(localStorage.getItem('jwt'));

    if (!token) return;

    const decoded = await this.$axios.$get("/auth",{
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const user = {
      email: decoded.email,
      username: decoded.username
    };
    commit("setUser", user);


  },


  async login({ commit }, user) {
    const token = await this.$axios.$post('auth', user)
    if (!token) return false;
    localStorage.setItem('jwt', JSON.stringify(token));
    const decoded = await this.$axios.$get("auth", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    commit("setUser", {
      email: decoded.email,
      username: decoded.username
    });
    this.$router.push("/admin");
    return true;
  },

  async logout({ commit }) {
    localStorage.removeItem('jwt');
    commit("setUser", null);
    await this.$router.push("/");
  }
};
