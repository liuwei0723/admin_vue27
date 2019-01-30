//导入vue
import Vue from 'vue'
//导入vue-router
import VueRouter from 'vue-router'

//集成VueRouter中间件
Vue.use(VueRouter)

//导入组件
import Login from '../components/account/Login.vue'
import Layout from '../components/layout/Layout.vue'
import Users from '../components/users/Users.vue'
import Welcome from '../components/welcome/Welcome.vue'

//创建路由对象,导出去
const router = new VueRouter({
    routes:[
        {path:'/',redirect:'/login'},
        {path:'/login',component:Login},
        {path:'/layout',name:'layout',component:Layout,children:[
            {path:'',component:Welcome},
            {path:'users',component:Users},
        ]},
        

    ]
})

//es6导出
export default router