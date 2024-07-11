type HomeNavList = Array<{
    icon: string
    color: string
    title: string
    path: string
}>

// 存储token时的key的名称
export const TOKEN_NAME: string = 'admin_token'

// 储存标签页的key名称
export const TABS_NAME: string = 'tabList'

// unocss的响应式断点
// export const breakpoints = {
//     xxs: '0px',
//     xs: '320px',
//     sm: '480px',
//     md: '768px',
//     lg: '1024px',
//     xl: '1280px',
//     xxl: '1600px',
// }

// 首页的navbar配置
export const HomeNavList: HomeNavList = [
    {
        icon: 'user',
        color: 'text-light-blue-500',
        title: '用户',
        path: '/user/list',
    },
    {
        icon: 'shopping-cart',
        color: 'text-violet-500',
        title: '商品',
        path: '/goods/list',
    },
    {
        icon: 'tickets',
        color: 'text-fuchsia-500',
        title: '订单',
        path: '/order/list',
    },
    {
        icon: 'chat-dot-square',
        color: 'text-teal-500',
        title: '评价',
        path: '/comment/list',
    },
    {
        icon: 'picture',
        color: 'text-rose-500',
        title: '图库',
        path: '/image/list',
    },
    {
        icon: 'bell',
        color: 'text-green-500',
        title: '公告',
        path: '/notice/list',
    },
    {
        icon: 'set-up',
        color: 'text-grey-500',
        title: '配置',
        path: '/setting/base',
    },
    {
        icon: 'files',
        color: 'text-yellow-500',
        title: '优惠券',
        path: '/coupon/list',
    },
]
