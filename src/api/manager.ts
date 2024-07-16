import request from '@/utils/request.ts'
import { Super, Status } from '@/constant/enum.ts'

export interface ManagerListResult {
    list: Array<{
        id: number
        status: Status
        create_time: string
        update_time: string
        username: string
        avatar: string
        role_id: number
        super: Super
        role: {
            id: number
            name: string
        }
    }>
    totalCount: number
    roles: Array<{
        id: number
        name: string
    }>
}

export interface AddManagerResult {
    username: string
    role_id: string
    status: Status
    avatar: string
    super: Super
    create_time: string
    update_time: string
    id: string
}

export interface AddManagerForm {
    username: string
    password: string
    role_id: number | null
    status: Status
    avatar: string
}

export const getManagerListApi = (pageNum: number = 1, limit: number = 10, keyword: string = '') =>
    request<ManagerListResult>({
        url: `/admin/manager/${pageNum}`,
        method: 'get',
        params: {
            limit,
            keyword: keyword || null,
        },
    })

export const addManagerApi = (data: AddManagerForm) =>
    request<AddManagerResult>({
        url: '/admin/manager',
        method: 'post',
        data,
    })

export const editManagerApi = (data: AddManagerForm & { id: number }) =>
    request<boolean>({
        url: `/admin/manager/${data.id}`,
        method: 'post',
        data,
    })

export const deleteManagerApi = (id: number) =>
    request<boolean>({
        url: `/admin/manager/${id}/delete`,
        method: 'post',
    })

export const changeManagerStatusApi = (id: number, status: Status) =>
    request<boolean>({
        url: `/admin/manager/${id}/update_status`,
        method: 'post',
        data: {
            status,
        },
    })
