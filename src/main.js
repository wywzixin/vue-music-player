// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'assets/js/amfe-flexible.js'
import VueLazyload from 'vue-lazyload'
import store from './store'
Vue.config.productionTip = false

Vue.use(VueLazyload, {
  error: require('./assets/img/error.jpg'),
  loading: require('./assets/img/loading.gif')
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App),
  // components: { App },
  store,
  template: '<App/>'
})
