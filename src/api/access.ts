import request from '@/utils/request.ts'
import { Status } from '@/constant/enum.ts'

export interface AccessListResult {
    list: Array<{
        id: number
        rule_id: number
        status: Status
        create_time: string
        update_time: string
        name: string
        desc: string
        frontPath: string
        condition: string
        menu: number
        order: number
        icon: string
        method: 'GET' | 'POST' | 'PUT' | 'DELETE'
        child?: AccessListResult['list']
    }>
    rules: AccessListResult['list']
}

export interface AddAccessForm {
    rule_id: number
    menu: number
    name: string
    condition: string
    method: 'GET' | 'POST' | 'PUT' | 'DELETE'
    status: Status
    order: number
    icon: string
    frontPath: string
}

export const getAccessListApi = () =>
    request<AccessListResult>({
        url: '/admin/rule/1',
        method: 'get',
    })

export const addAccessApi = (data: AddAccessForm) =>
    request<Omit<AccessListResult['list'], 'child'>>({
        url: '/admin/rule',
        method: 'post',
        data,
    })

export const editAccessApi = (id: number, data: AddAccessForm) =>
    request<boolean>({
        url: `/admin/rule/${id}`,
        method: 'post',
        data,
    })

export const deleteAccessApi = (id: number) =>
    request<boolean>({
        url: `/admin/rule/${id}/delete`,
        method: 'post',
    })

export const changeAccessStatusApi = (id: number, status: Status) =>
    request<boolean>({
        url: `/admin/rule/${id}/update_status`,
        method: 'post',
        data: {
            status,
        },
    })
