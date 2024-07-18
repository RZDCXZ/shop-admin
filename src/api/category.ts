import request from '@/utils/request.ts'
import { Status } from '@/constant/enum.ts'

export type CategoryListResult = Array<{
    id: number
    name: string
    status: Status
    create_time: string
    update_time: string
    category_id: number
    order: number
    child?: CategoryListResult[]
}>

export const getCategoryListApi = () =>
    request({
        url: '/admin/category',
        method: 'get',
    })
