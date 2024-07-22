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

export interface AddCategoryResult {
    id: number
    name: string
    create_time: string
    update_time: string
}

export type CategoryItemResult = Array<{
    id: number
    name: string
    cover: string
    category_id: number
    goods_id: number
    order: number
    create_time: string
    update_time: string
}>

export const getCategoryListApi = () =>
    request<CategoryListResult>({
        url: '/admin/category',
        method: 'get',
    })

export const addCategoryApi = (name: string) =>
    request<AddCategoryResult>({
        url: '/admin/category',
        method: 'post',
        data: {
            name,
        },
    })

export const editCategoryApi = (id: number, name: string) =>
    request<boolean>({
        url: `/admin/category/${id}`,
        method: 'post',
        data: {
            name,
        },
    })

export const changeCategoryStatusApi = (id: number, status: Status) =>
    request<boolean>({
        url: `/admin/category/${id}/update_status`,
        method: 'post',
        data: {
            status,
        },
    })

export const deleteCategoryApi = (id: number) =>
    request<boolean>({
        url: `/admin/category/${id}/delete`,
        method: 'post',
    })

export const addCategoryItemApi = (category_id: number, goods_ids: number[]) =>
    request<string>({
        url: '/admin/app_category_item',
        method: 'post',
        data: {
            category_id,
            goods_ids,
        },
    })

export const deleteCategoryItemApi = (id: number) =>
    request<boolean>({
        url: `/admin/app_category_item/${id}/delete`,
        method: 'post',
    })

export const getCategoryItemListApi = (category_id: number) =>
    request<CategoryItemResult>({
        url: '/admin/app_category_item/list',
        method: 'get',
        params: {
            category_id,
        },
    })
