import { useCookies } from '@vueuse/integrations/useCookies'
import { TOKEN_NAME } from '@/constant/config.ts'

const cookies = useCookies()

// 获取token
export const getToken = () => {
    return cookies.get(TOKEN_NAME)
}

// 设置token
export const setToken = (token: string) => {
    cookies.set(TOKEN_NAME, token)
}

// 清除token
export const removeToken = () => {
    cookies.remove(TOKEN_NAME)
}

export const getCookies = (key: string) => {
    return cookies.get(key)
}

export const setCookies = (key: string, value: any) => {
    cookies.set(key, value)
}
