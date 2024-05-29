import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import 'vue-router'

declare module 'vue-router' {
    interface RouteMeta {
        title: string
    }
}

// 引入页面组件
const Home = () => import('@/pages/Home.vue')
const NotFound = () => import('@/pages/NotFound.vue')
const Login = () => import('@/pages/Login.vue')

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'home',
        component: Home,
        meta: {
            title: '后台首页',
        },
    },
    {
        path: '/login',
        name: 'login',
        component: Login,
        meta: {
            title: '登录页',
        },
    },
    // 将匹配所有内容并将其放在 `$route.params.pathMatch` 下
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
]

const router = createRouter({
    routes,
    history: createWebHashHistory(),
})

export default router
