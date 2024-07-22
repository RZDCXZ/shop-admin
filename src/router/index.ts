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
const CategoryList = () => import('@/pages/category/List.vue')
const UserList = () => import('@/pages/user/List.vue')
const OrderList = () => import('@/pages/order/List.vue')
const CommentList = () => import('@/pages/comment/List.vue')
const ImageList = () => import('@/pages/image/List.vue')
const NoticeList = () => import('@/pages/notice/List.vue')
const CouponList = () => import('@/pages/coupon/List.vue')
const ManagerList = () => import('@/pages/manager/List.vue')
const AccessList = () => import('@/pages/access/List.vue')
const RoleList = () => import('@/pages/role/List.vue')
const SkusList = () => import('@/pages/skus/List.vue')
const LevelList = () => import('@/pages/level/List.vue')
const SettingBase = () => import('@/pages/setting/Base.vue')

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
    {
        path: '/category/list',
        name: '/category/list',
        component: CategoryList,
        meta: {
            title: '分类列表',
        },
    },
    {
        path: '/user/list',
        name: '/user/list',
        component: UserList,
        meta: {
            title: '用户列表',
        },
    },
    {
        path: '/order/list',
        name: '/order/list',
        component: OrderList,
        meta: {
            title: '订单列表',
        },
    },
    {
        path: '/comment/list',
        name: '/comment/list',
        component: CommentList,
        meta: {
            title: '评价列表',
        },
    },
    {
        path: '/image/list',
        name: '/image/list',
        component: ImageList,
        meta: {
            title: '图库列表',
        },
    },
    {
        path: '/notice/list',
        name: '/notice/list',
        component: NoticeList,
        meta: {
            title: '公告列表',
        },
    },
    {
        path: '/coupon/list',
        name: '/coupon/list',
        component: CouponList,
        meta: {
            title: '优惠券列表',
        },
    },
    {
        path: '/manager/list',
        name: '/manager/list',
        component: ManagerList,
        meta: {
            title: '管理员管理',
        },
    },
    {
        path: '/access/list',
        name: '/access/list',
        component: AccessList,
        meta: {
            title: '菜单权限管理',
        },
    },
    {
        path: '/role/list',
        name: '/role/list',
        component: RoleList,
        meta: {
            title: '角色管理',
        },
    },
    {
        path: '/skus/list',
        name: '/skus/list',
        component: SkusList,
        meta: {
            title: '商品规格管理',
        },
    },
    {
        path: '/level/list',
        name: '/level/list',
        component: LevelList,
        meta: {
            title: '会员等级',
        },
    },
    {
        path: '/setting/base',
        name: '/setting/base',
        component: SettingBase,
        meta: {
            title: '基础配置',
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
