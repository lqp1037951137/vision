// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import axios from 'axios'
import './assets/css/global.less'
import './assets/font/iconfont.css'
import SocketService from '@/utils/socket_service';

SocketService.Instance.connect()
Vue.prototype.$socket = SocketService.Instance

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/'
Vue.prototype.$http = axios
Vue.prototype.$echarts = window.echarts
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
})
