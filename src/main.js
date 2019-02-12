import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

//导入ElementUI及样式
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI)

//导入路由对象
import router from './router'

//在vue原型上挂一个$axios
import axios from 'axios'
axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/"
Vue.prototype.$axios = axios

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  if(localStorage.getItem('mytoken')){
    config.headers.Authorization = localStorage.getItem('mytoken')
  }  

  // 在发送请求之前做些什么
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
})

new Vue({
  render: h => h(App),
  router //注入到根实例
}).$mount('#app')