import request from '@/utils/request.ts'
import { Status } from '@/constant/enum.ts'

export interface LevelListResult {
    list: Array<{
        id: number
        name: string
        level: number
        status: Status
        discount: number
        max_price: number
        max_times: number
    }>
    totalCount: number
}

export interface AddLevelForm {
    name: string
    level: number
    status: Status
    discount: number
    max_price: number
    max_times: number
}

export const getLevelListApi = (pageNum: number) =>
    request<LevelListResult>({
        url: `/admin/user_level/${pageNum}`,
        method: 'get',
    })

export const addLevelApi = (data: AddLevelForm) =>
    request<AddLevelForm & { id: number }>({
        url: '/admin/user_level',
        method: 'post',
        data,
    })

export const editLevelApi = (id: number, data: AddLevelForm) =>
    request<boolean>({
        url: `/admin/user_level/${id}`,
        method: 'post',
        data,
    })

export const changeLevelStatusApi = (id: number, status: Status) =>
    request<boolean>({
        url: `/admin/user_level/${id}/update_status`,
        method: 'post',
        data: {
            status,
        },
    })

export const deleteLevelApi = (id: number) =>
    request<boolean>({
        url: `/admin/user_level/${id}/delete`,
        method: 'post',
    })
