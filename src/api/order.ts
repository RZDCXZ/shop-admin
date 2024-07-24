import request from '@/utils/request.ts'

export interface OrderSearchForm {
    tab: string
    no: string
    starttime: string
    endtime: string
    name: string
    phone: string
}

export interface OrderListResult {
    list: Array<{
        id: number
        no: string
        user_id: number
        address: {
            id: number
            user_id: number
            province: string
            city: string
            districet: string
            address: string
            zip: number
            name: string
            phone: string
            last_used_time: string
            create_time: string
            update_time: string
        }
        total_price: string
        remark: string
        paid_time: string
        payment_method: string
        payment_no: string
        refund_status: string
        refund_no: string
        closed: number
        ship_status: string
        ship_data: string
        extra: string
        create_time: string
        update_time: string
        reviewed: number
        coupon_user_id: number
        order_items: Array<{
            id: number
            order_id: number
            shop_id: number
            goods_id: number
            num: number
            price: string
            skus_type: number
            gooods_item: {
                id: number
                title: string
                cover: string
                sku_type: number
            }
            goods_skus: {
                id: number
                skus: Array<{
                    id: number
                    goods_skus_card_id: number
                    name: string
                    value: string
                    order: number
                    text: string
                    color: string
                    image: string
                }>
            }
        }>
        user: {
            id: number
            nickname: string
            username: string
            avatar: string
        }
    }>
    totalCount: number
}

export interface ExpressCompanyListResult {
    list: Array<{
        id: number
        name: string
        code: string
        order: number
        create_time: string
        update_time: string
    }>
    totalCount: number
}

export interface OrderShipInfoResult {
    status: number
    msg: string
    result: {
        number: string
        type: string
        typename: string
        logo: string
        list: Array<{
            time: string
            status: string
        }>
        deliverystatus: number
        issign: number
    }
}

export const getOrderListApi = (pageNum: number, params: OrderSearchForm) =>
    request<OrderListResult>({
        url: `/admin/order/${pageNum}`,
        method: 'get',
        params,
    })

export const deleteOrderAllApi = (ids: number[]) =>
    request<boolean>({
        url: '/admin/order/delete_all',
        method: 'post',
        data: {
            ids,
        },
    })

export const shipOrderApi = (id: number, data: { express_company: string; express_no: string }) =>
    request<boolean>({
        url: `/admin/order/${id}/ship`,
        method: 'post',
        data,
    })

export const refundOrderApi = (id: number, data: { agree: number; disagree_reason?: string }) =>
    request<boolean>({
        url: `/admin/order/${id}/handle_refund`,
        method: 'post',
        data,
    })

export const exportOrderApi = (params: { tab: string; starttime: string; endtime: string }) =>
    request({
        url: `/admin/order/excelexport`,
        method: 'post',
        params,
    })

export const getExpressCompanyListApi = (pageNum: number) =>
    request<ExpressCompanyListResult>({
        url: `/admin/express_company/${pageNum}`,
        method: 'get',
    })

export const getOrderShipInfoApi = (id: number) =>
    request<OrderShipInfoResult>({
        url: `/admin/order/${id}/get_ship_info`,
        method: 'get',
    })
