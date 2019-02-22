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

// 集成百度地图
import BaiduMap from 'vue-baidu-map'
Vue.use(BaiduMap, {
  // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
  ak: 'Sd2ZilSLMnz9yjesdPrrVl63onT8vQ56'
})

new Vue({
  render: h => h(App),
  router //注入到根实例
}).$mount('#app')