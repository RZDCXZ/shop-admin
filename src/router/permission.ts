import router from '@/router'
import { getToken } from '@/utils/auth.ts'
import { ElNotification } from 'element-plus'
import { showProgress, hideProgress } from '@/utils/tools.ts'

router.beforeEach((to, from, next) => {
    showProgress()

    const token = getToken()

    if (!token && to.path !== '/login') {
        ElNotification({
            type: 'error',
            message: '请先登录!',
            duration: 2000,
        })
        return next('/login')
    }

    if (token && to.path === '/login') {
        ElNotification({
            type: 'warning',
            message: '请勿重复登录!',
            duration: 2000,
        })
        return next(from.path || '/')
    }

    document.title = 'shop-admin ' + (to.meta.title || '')

    next()
})

router.afterEach(() => hideProgress())
