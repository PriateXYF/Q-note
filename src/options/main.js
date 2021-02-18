import Vue from 'vue'
import App from './App.vue'
import router from '../router/options'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI, {
  size: 'small',
  zIndex: 3000
});

Vue.prototype.to = function (path) {
  this.$router.push(path)
}


new Vue({
  el: '#app',
  router,
  render: h => h(App),
})