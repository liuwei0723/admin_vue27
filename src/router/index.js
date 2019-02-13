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
import Rights from '../components/rights/Rights.vue'
import Roles from '../components/roles/Roles.vue'

//创建路由对象,导出去
const router = new VueRouter({
    routes: [{
            path: '/',
            redirect: '/login'
        },
        {
            path: '/login',
            meta: {
                unRequiresAuth: true
            },
            component: Login
        },
        {
            path: '/layout',
            name: 'layout',
            component: Layout,
            children: [{
                    path: '',
                    component: Welcome
                },
                {
                    path: 'users',
                    component: Users
                },
                {
                    path: 'rights',
                    component: Rights
                },
                {
                    path: 'roles',
                    component: Roles
                },
            ]
        },


    ]
})

//导航守卫
router.beforeEach((to, from, next) => {
    //判断本地是否有token,如果有代表登录,如果没有就跳转到login页面
    // if(to.fullPath !== '/login'){
    //     if(localStorage.getItem('mytoken')){
    //         next()
    //     }else{
    //         return router.push({path:'/login'})
    //     }
    // }

    // next()
    if (to.meta.unRequiresAuth) { //不需要权限验证
        next()
    } else {
        //需要权限验证
        if (localStorage.getItem('mytoken')) {
            next()
        } else {
            return router.push({
                path: '/login'
            })
        }
    }
})

//es6导出
export default router