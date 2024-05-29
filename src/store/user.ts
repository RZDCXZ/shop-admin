import { defineStore } from 'pinia'
import { loginApi, getUserInfoApi } from '@/api/user.ts'
import { LoginParams } from '@/pages/Login.vue'
import { UserInfoResult } from '@/api/user.ts'
import { useCookies } from '@vueuse/integrations/useCookies'
import { ref } from 'vue'
import { TOKEN_NAME } from '@/constant/config.ts'

export const useUserStore = defineStore('user', () => {
  const cookies = useCookies()

  const userInfo = ref<UserInfoResult>()

  const login = async (data: LoginParams) => {
    const res = await loginApi(data)
    cookies.set(TOKEN_NAME, res.data.token)
  }

  const getUserInfo = async () => {
    const res = await getUserInfoApi()
    userInfo.value = res.data
  }

  return {
    login,
    userInfo,
    getUserInfo,
  }
})
