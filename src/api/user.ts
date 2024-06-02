import request from '@/utils/request.ts'
import type { LoginParams } from '@/pages/Login.vue'
import type { UpdatePwdParams } from '@/layout/components/FHeader.vue'
import { Super } from '@/constant/enum.ts'

interface LoginResult {
    token: string
}

interface Menus {
    id: number
    rule_id: number
    status: number
    create_time: string
    update_time: string
    name: string
    desc: string
    frontpath: string | null
    condition: string | null
    menu: number
    order: number
    icon: string
    method: string
    child?: Menus[]
}

export interface UserInfoResult {
    id: number
    username: string
    avatar: string
    super: Super
    role: {
        id: number
        name: string
    }
    roleNames: string[]
    menus: Menus
}

export const loginApi = (data: LoginParams) =>
    request<LoginResult>({
        url: '/admin/login',
        method: 'post',
        data,
    })

export const getUserInfoApi = () =>
    request<UserInfoResult>({
        url: '/admin/getinfo',
        method: 'post',
    })

export const logoutApi = () =>
    request<string>({
        url: '/admin/logout',
        method: 'post',
    })

export const updatePwdApi = (data: UpdatePwdParams) =>
    request<boolean>({
        url: '/admin/updatepassword',
        method: 'post',
        data,
    })
