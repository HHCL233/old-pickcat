import 'regenerator-runtime/runtime'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import rich from './directives/rich'
import { initTheme } from './utils/theme'
import { loadSession } from './store'
import './styles/base.scss'

Vue.config.productionTip = false
Vue.directive('rich', rich)

initTheme()
loadSession()

new Vue({
  router: router,
  render: function (h) {
    return h(App)
  }
}).$mount('#app')
