import Vue from 'vue'
import App from './App.vue'
import router from '@/router'
import axiosInterface from '@common/api/interface' //引入axios封装
import i18n from '@common/i18n/i18n'
import '@/icons' //图标
/*import '@assets/css/common.scss' //公共css*/

Vue.config.productionTip = false
Vue.prototype.$axios = axiosInterface;

new Vue({
  router,
  i18n,
  render: h => h(App)
}).$mount('#app')
