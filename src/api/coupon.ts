import request from '@/utils/request.ts'
import { Status } from '@/constant/enum.ts'

export interface CouponListResult {
    list: Array<{
        id: number
        name: string
        type: number
        value: number
        total: number
        used: number
        min_price: number
        start_time: string
        end_time: string
        status: Status
        create_time: string
        update_time: string
        order: number
        desc: string
    }>
    totalCount: number
}

export interface AddCouponForm {
    name: string
    type: number
    value: number
    total: number
    min_price: number
    start_time: string
    end_time: string
    order: number
    desc: string
}

interface AddCouponResult {
    name: string
    type: string
    value: string
    total: string
    min_price: string
    start_time: string
    end_time: string
    order: string
    create_time: string
    update_time: string
    id: string
}

export const getCouponListApi = (pageNum: number = 1) =>
    request<CouponListResult>({
        url: `/admin/coupon/${pageNum}`,
        method: 'get',
    })

export const addCouponApi = (data: AddCouponForm) =>
    request<AddCouponResult>({
        url: '/admin/coupon',
        method: 'post',
        data,
    })

export const editCouponApi = (id: number, data: AddCouponForm) =>
    request<boolean>({
        url: `/admin/coupon/${id}`,
        method: 'post',
        data,
    })

export const deleteCouponApi = (id: number) =>
    request<boolean>({
        url: `/admin/coupon/${id}/delete`,
        method: 'post',
    })

export const changeCouponStatusApi = (id: number) =>
    request<boolean>({
        url: `/admin/coupon/${id}/update_status`,
        method: 'post',
        data: {
            status: Status.disable,
        },
    })
