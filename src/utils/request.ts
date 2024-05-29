import axios, { AxiosError } from 'axios'
import type { AxiosRequestConfig } from 'axios'
import { ElNotification } from 'element-plus'
import { useCookies } from '@vueuse/integrations/useCookies'
import { TOKEN_NAME } from '@/constant/config.ts'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

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
        NProgress.start()
        const cookies = useCookies()
        const token = cookies.get(TOKEN_NAME)
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
        NProgress.done()
        return response.data
    },
    function (error: AxiosError<BaseResult>) {
        ElNotification({
            type: 'error',
            message: error?.response?.data.msg || '请求错误',
            duration: 2000,
        })
        NProgress.done()
        return Promise.reject(error)
    },
)

const request = <T = any>(config: AxiosRequestConfig): Promise<BaseResult<T>> => {
    return instance(config)
}

export default request
