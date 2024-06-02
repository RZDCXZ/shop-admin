import axios, { AxiosError } from 'axios'
import type { AxiosRequestConfig } from 'axios'
import { ElNotification } from 'element-plus'
import { getToken } from '@/utils/auth.ts'
import { showProgress, hideProgress } from '@/utils/tools.ts'
import { useUserStore } from '@/store/user.ts'
import router from '@/router'

interface BaseResult<T = any> {
    msg: string
    data: T
    errorCode?: number
}

const instance = axios.create({
    baseURL: '/api',
    timeout: 5000,
})

// 添加请求拦截器
instance.interceptors.request.use(
    function (config) {
        showProgress()
        const token = getToken()
        if (token) {
            config.headers['token'] = token
        }
        return config
    },
    function (error) {
        return Promise.reject(error)
    },
)

// 添加响应拦截器
instance.interceptors.response.use(
    function (response) {
        hideProgress()
        return response.data
    },
    async function (error: AxiosError<BaseResult>) {
        const msg = error?.response?.data.msg || '请求错误'

        if (msg === '非法token，请先登录！') {
            const { removeToken, removeUserInfo } = useUserStore()
            removeToken()
            removeUserInfo()
            await router.push('/login')
        }
        ElNotification({
            type: 'error',
            message: msg,
            duration: 2000,
        })
        hideProgress()
        return Promise.reject(error)
    },
)

const request = <T = any>(config: AxiosRequestConfig): Promise<BaseResult<T>> => {
    return instance(config)
}

export default request
