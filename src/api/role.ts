import request from '@/utils/request.ts'
import { Status } from '@/constant/enum.ts'

export interface RoleListResult {
    list: Array<{
        id: number
        status: Status
        create_time: string
        update_time: string
        name: string
        desc: string
        rules: Array<{
            id: number
            pivot: {
                id: number
                role_id: number
                rule_id: number
            }
        }>
    }>
    totalCount: number
}

export interface AddRoleForm {
    name: string
    status: Status
    desc: string
}

interface AddRoleResult {
    name: string
    status: Status
    desc: string
    id: number
    create_time: string
    update_time: string
}

export const getRoleListApi = (pageNum: number = 1) =>
    request<RoleListResult>({
        url: `/admin/role/${pageNum}`,
        method: 'get',
    })

export const addRoleApi = (data: AddRoleForm) =>
    request<AddRoleResult>({
        url: '/admin/role',
        method: 'post',
        data,
    })

export const editRoleApi = (id: number, data: AddRoleForm) =>
    request<boolean>({
        url: `/admin/role/${id}`,
        method: 'post',
        data,
    })

export const deleteRoleApi = (id: number) =>
    request<boolean>({
        url: `/admin/role/${id}/delete`,
        method: 'post',
    })

export const changeRoleStatusApi = (id: number, status: Status) =>
    request<boolean>({
        url: `/admin/role/${id}/update_status`,
        method: 'post',
        data: {
            status,
        },
    })

export const setRoleApi = (id: number, rule_ids: number[]) =>
    request<boolean>({
        url: '/admin/role/set_rules',
        method: 'post',
        data: {
            id,
            rule_ids,
        },
    })
