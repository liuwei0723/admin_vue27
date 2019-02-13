import Vue from 'vue'

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

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // console.log(response)
  // 对响应数据做点什么
  return response
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error);
})