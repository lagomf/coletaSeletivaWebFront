import Vue from 'vue'
import router from './router'

import BootstrapVue from "bootstrap-vue"
import VueAlertify from 'vue-alertify';

import App from './App'

import store from './store';
import axios from 'axios';

axios.defaults.withCredentials = true
axios.defaults.baseURL = 'http://coletaSeletivaApi.test/api';
axios.defaults.headers.common = {'Accept':'application/json'}

import Default from './Layout/Wrappers/baseLayout.vue';
import Pages from './Layout/Wrappers/pagesLayout.vue';

Vue.config.productionTip = false;

Vue.use(VueAlertify);
Vue.use(BootstrapVue);

Vue.component('default-layout', Default);
Vue.component('userpages-layout', Pages);

new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App },

  created() {
    // Run before every axios request
    axios.interceptors.request.use(function (config) {
      // Do something before request is sent
      if(store.getters.StateToken){
        config.headers["Authorization"] = `Bearer ${store.getters.StateToken}`;
      }
      return config;
    }, function (error) {
      // Do something with request error
      return Promise.reject(error);
    });

    // Run after every axios request
    axios.interceptors.response.use(function (response) {
      // Any status code that lie within the range of 2xx cause this function to trigger
      // Do something with response data
      return response;
    }, function (error) {
      // Any status codes that falls outside the range of 2xx cause this function to trigger
      // Do something with response error
      switch (error.response.status) {
        // Unauthenticated: force log out
        case 401:
          //check origin request
          store.commit('LogOut');
          this.$router.push({name:"login"});
      }
      return Promise.reject(error);
    });
  }
});
