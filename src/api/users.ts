import request from '@/utils/request.ts'
import { Status } from '@/constant/enum.ts'

export interface UserListResult {
    list: Array<{
        id: number
        username: string
        avatar: string
        nickname: string
        phone: string
        email: string
        user_level_id: number
        create_time: string
        update_time: string
        last_login_time: string
        status: Status
        user_level: {
            id: number
            name: string
        }
    }>
    totalCount: number
    user_level: Array<{
        id: number
        name: string
    }>
}

export interface AddUserForm {
    username: string
    password: string
    status: Status
    nickname: string
    phone: string
    email: string
    avatar: string
    user_level_id: number | null
}

export const getUserListApi = (
    pageNum: number,
    params: { limit: number; keyword: string; user_level_id: number | null },
) =>
    request<UserListResult>({
        url: `/admin/user/${pageNum}`,
        method: 'get',
        params,
    })

export const addUserApi = (data: AddUserForm) =>
    request<AddUserForm & { create_time: string; update_time: string; id: number }>({
        url: '/admin/user',
        method: 'post',
        data,
    })

export const editUserApi = (id: number, data: AddUserForm) =>
    request<boolean>({
        url: `/admin/user/${id}`,
        method: 'post',
        data,
    })

export const changeUserStatusApi = (id: number, status: Status) =>
    request<boolean>({
        url: `/admin/user/${id}/update_status`,
        method: 'post',
        data: {
            status,
        },
    })

export const deleteUserApi = (id: number) =>
    request<boolean>({
        url: `/admin/user/${id}/delete`,
        method: 'post',
    })
