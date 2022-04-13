//store/modules/auth.js

import axios from 'axios';
const state = {
    user: null,
    roles: null,
    token: null,
    permissions: null
};
const getters = {
    isAuthenticated: state => !!state.token,
    StateRoles: state => state.roles,
    StateUser: state => state.user,
    StateToken: state => state.token,
    StatePermissions: state => state.permissions
};

const actions = {
    async LogIn({commit}, User) {
        await axios.post('login', User)
            .then(response => {
                let data = response.data;

                commit('setUser', data.user);
                commit('setRoles', data.roles);
                commit('setPermissions', data.permissions);
                commit('setToken',data.token);
            });

        
    },
    async LogOut({commit}){
        await axios.post('logout');
        commit('LogOut');
    }
};

const mutations = {
    setUser(state, user){
        state.user = user
    },
    setRoles(state, roles){
        state.roles = roles
    },
    setPermissions(state,permissions){
        state.permissions = permissions
    },
    setToken(state,token){
        state.token = token
    },
    LogOut(state){
        state.user = null;
        state.roles = null;
        state.token = null;
        state.permissions = null;
    },
};

export default {
  state,
  getters,
  actions,
  mutations
};
