import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import 'vue-router'
import type { Menus } from '@/api/user.ts'

declare module 'vue-router' {
    interface RouteMeta {
        title: string
    }
}

// 引入页面组件
const Home = () => import('@/pages/Home.vue')
const NotFound = () => import('@/pages/NotFound.vue')
const Login = () => import('@/pages/Login.vue')
const Layout = () => import('@/layout/Layout.vue')
const GoodsList = () => import('@/pages/goods/List.vue')

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'index',
        component: Layout,
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

const asyncRoutes: RouteRecordRaw[] = [
    {
        path: '/',
        name: '/',
        component: Home,
        meta: {
            title: '后台首页',
        },
    },
    {
        path: '/goods/list',
        name: '/goods/list',
        component: GoodsList,
        meta: {
            title: '商品列表',
        },
    },
]

const router = createRouter({
    routes,
    history: createWebHashHistory(),
})

export default router

// 动态注册路由
export const addRoutes = (menus: Menus[]) => {
    const findAndAddRouteByMenus = (arr: Menus[]) => {
        arr.forEach((e) => {
            const item = asyncRoutes.find((o) => o.path === e.frontpath)
            if (item && !router.hasRoute(item.name as string)) {
                router.addRoute('index', item)
            }
            if (e.child && e.child.length) {
                findAndAddRouteByMenus(e.child)
            }
        })
    }

    findAndAddRouteByMenus(menus)
}
