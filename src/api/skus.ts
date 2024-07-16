import request from '@/utils/request.ts'
import { Status } from '@/constant/enum.ts'

export interface SkusListResult {
    list: Array<{
        id: number
        name: string
        create_time: string
        update_time: string
        status: Status
        order: number
        default: string
    }>
    totalCount: number
}

export interface AddSkusForm {
    name: string
    order: number
    status: Status
    default: string
}

interface AddSkusResult {
    status: Status
    name: string
    order: number
    default: string
    create_time: string
    update_time: string
    id: number
}

export const getSkusListApi = (pageNum: number = 1) =>
    request<SkusListResult>({
        url: `/admin/skus/${pageNum}`,
        method: 'get',
    })

export const addSkusApi = (data: AddSkusForm) =>
    request<AddSkusResult>({
        url: '/admin/skus',
        method: 'post',
        data,
    })

export const editSkusApi = (id: number, data: AddSkusForm) =>
    request<boolean>({
        url: `/admin/skus/${id}`,
        method: 'post',
        data,
    })

export const changeSkusStatusApi = (id: number, status: Status) =>
    request<boolean>({
        url: `/admin/skus/${id}/update_status`,
        method: 'post',
        data: {
            status,
        },
    })

export const deleteSkusAllApi = (ids: number[]) =>
    request<boolean>({
        url: '/admin/skus/delete_all',
        method: 'post',
        data: {
            ids,
        },
    })
