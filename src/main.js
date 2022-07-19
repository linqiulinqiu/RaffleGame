import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import '../theme/index.css'
import "./assets/main.css"
import i18n from './locales'
import VueClipboard from "vue-clipboard2"
import AsyncComputed from 'vue-async-computed'

Vue.use(AsyncComputed)
Vue.use(VueClipboard)


Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')