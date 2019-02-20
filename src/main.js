import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

//导入ElementUI及样式
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI)

// 导入富文本编辑器的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'



//导入路由对象
import router from './router'

import './utils/myAxios'
import './filter/index'

new Vue({
  render: h => h(App),
  router //注入到根实例
}).$mount('#app')