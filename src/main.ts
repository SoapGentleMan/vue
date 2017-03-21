import './global.css'

import Vue from 'vue'
import router from './router'
import App from './app.tsx.vue'

new Vue({
  el: '#app',
  router,
  render: h => {
    return h(App)
  }
});
