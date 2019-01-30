import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

//导入ElementUI及样式
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI)

//导入路由对象
import router from './router'

new Vue({
  render: h => h(App),
  router //注入到根实例
}).$mount('#app')
