import { defineStore } from 'pinia'
import { loginApi, getUserInfoApi, logoutApi } from '@/api/user.ts'
import { LoginParams } from '@/pages/Login.vue'
import { UserInfoResult } from '@/api/user.ts'
import { ref } from 'vue'
import { setToken, removeToken } from '@/utils/auth.ts'
import { useRouter } from 'vue-router'
import { useMenuStore } from '@/store/menu.ts'

export const useUserStore = defineStore(
    'user',
    () => {
        const { setMenus } = useMenuStore()

        const router = useRouter()

        const userInfo = ref<UserInfoResult | null>(null)

        const ruleNames = ref<string[]>([])

        const setRuleNames = (data: string[]) => {
            ruleNames.value = data
        }

        const setUserInfo = (data: UserInfoResult) => {
            userInfo.value = data
        }

        const removeUserInfo = () => {
            userInfo.value = null
        }

        const login = async (data: LoginParams) => {
            const res = await loginApi(data)
            setToken(res.data.token)
        }

        const getUserInfo = async () => {
            const res = await getUserInfoApi()
            setUserInfo(res.data)
            setMenus(res.data.menus)
            setRuleNames(res.data.roleNames)
        }

        const logout = async () => {
            await logoutApi().finally(async () => {
                removeToken()
                removeUserInfo()
                await router.push('/login')
            })
        }

        return {
            login,
            logout,
            userInfo,
            ruleNames,
            setUserInfo,
            removeToken,
            removeUserInfo,
            getUserInfo,
        }
    },
    {
        persist: true,
    },
)
