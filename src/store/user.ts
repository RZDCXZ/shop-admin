import { defineStore } from 'pinia'
import { loginApi, getUserInfoApi, logoutApi } from '@/api/user.ts'
import { LoginParams } from '@/pages/Login.vue'
import { UserInfoResult } from '@/api/user.ts'
import { ref } from 'vue'
import { setToken, removeToken } from '@/utils/auth.ts'
import { useRouter } from 'vue-router'
import { ElNotification } from 'element-plus'

export const useUserStore = defineStore(
    'user',
    () => {
        const router = useRouter()

        const userInfo = ref<UserInfoResult>()

        const setUserInfo = (data: UserInfoResult) => {
            userInfo.value = data
        }

        const removeUserInfo = () => {
            userInfo.value = undefined
        }

        const login = async (data: LoginParams) => {
            const res = await loginApi(data)
            setToken(res.data.token)
        }

        const getUserInfo = async () => {
            const res = await getUserInfoApi()
            setUserInfo(res.data)
        }

        const logout = async () => {
            await logoutApi().finally(async () => {
                removeToken()
                removeUserInfo()
                await router.push('/login')
                ElNotification({
                    type: 'success',
                    message: '退出登录成功',
                    duration: 2000,
                })
            })
        }

        return {
            login,
            logout,
            userInfo,
            setUserInfo,
            removeUserInfo,
            getUserInfo,
        }
    },
    {
        persist: true,
    },
)
