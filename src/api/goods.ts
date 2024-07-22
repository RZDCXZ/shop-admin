import request from '@/utils/request.ts'
import { Status } from '@/constant/enum.ts'

export interface AddGoodsForm {
    title: string
    category_id: number | null
    cover: string
    desc: string
    unit: string
    stock: number
    min_stock: number
    status: Status
    stock_display: number
    min_price: number
    min_oprice: number
    content?: string
}

type AddGoodsResult = AddGoodsForm & {
    ischeck: number
    create_time: string
    update_time: string
    id: number
}

export interface GoodsListResult {
    list: Array<{
        id: number
        title: string
        category_id: number
        cover: string
        rating: number
        sale_count: number
        review_count: number
        min_price: number
        min_oprice: number
        desc: string
        unit: string
        stock: number
        min_stock: number
        ischeck: number
        status: Status
        stock_display: number
        express_id: number
        sku_type: number
        sku_value: {
            oprice: number
            pprice: number
            cprice: number
            weight: number
            volumn: number
        }
        content: string
        discount: number
        create_time: string
        update_time: string
        delete_time: string
        order: number
        category: {
            id: number
            name: string
            status: Status
            create_time: string
            update_time: string
            category_id: number
            order: number
        }
        goods_banner: Array<{
            id: number
            goods_id: number
            url: string
            create_time: string
            update_time: string
        }>
        goods_attrs: string[]
        goods_skus: number[]
        goods_skus_card: Array<{
            id: number
            goods_id: number
            name: string
            order: number
            goods_skus_card_value: string[]
        }>
    }>
    totalCount: number
    cates: Array<{
        id: number
        name: string
        status: Status
        create_time: string
        update_time: string
        category_id: number
        order: number
        level: number
    }>
}

export interface GoodsDetailResult {
    id: number
    title: string
    category_id: number
    cover: string
    rating: number
    sale_count: number
    review_count: number
    min_price: number
    min_oprice: number
    desc: string
    unit: string
    stock: number
    min_stock: string
    ischeck: number
    status: Status
    stock_display: number
    express_id: number
    sku_type: number
    sku_value: any
    content: string
    discount: number
    create_time: string
    update_time: string
    delete_time: string
    order: number
    types: Array<{
        id: number
        name: string
        order: number
        status: Status
        create_time: string
        update_time: string
        goods_type_values: Array<{
            id: number
            name: string
            order: number
            type: string
            status: Status
            default: string
            goods_type_id: number
        }>
    }>
    goodsBanner: Array<{
        id: number
        goods_id: number
        url: string
        create_time: string
        update_time: string
    }>
    goodsAttrs: string[]
    goodsSkus: any[]
    goodsSkusCard: any[]
}

export interface EditGoodsSkusForm {
    sku_type: number
    sku_value?: {
        oprice: number
        pprice: number
        cprice: number
        weight: number
        volumn: number
    }
    goodsSkus?: Array<{
        skus: Array<{
            goods_skus_card_id: number
            name: string
            value: string
            id: number
            text: string
        }>
        image: string
        pprice: number
        oprice: number
        cprice: number
        stock: number
        volumn: number
        weight: number
        code: string
        goods_id: number
    }>
}

export interface AddGoodsSkusCardForm {
    goods_id: number
    name: string
    order: number
    type: number
}

export interface AddGoodsSkusCardValueForm {
    goods_skus_card_id: number
    name: string
    order: number
    value: string
}

export interface SetGoodsSkusCardForm {
    name: string
    value: string[]
}

export const addGoodsApi = (data: AddGoodsForm) =>
    request<AddGoodsResult>({
        url: '/admin/goods',
        method: 'post',
        data,
    })

export const editGoodsApi = (id: number, data: AddGoodsForm) =>
    request<boolean>({
        url: `/admin/goods/${id}`,
        method: 'post',
        data,
    })

export const changeGoodsStatusApi = (ids: number[], status: Status) =>
    request<number>({
        url: '/admin/goods/changestatus',
        method: 'post',
        data: {
            ids,
            status,
        },
    })

export const getGoodsListApi = (
    pageNum: number = 1,
    limit: number = 10,
    tab: string = 'all',
    title: string | null = '',
    categoryId: number | null,
) =>
    request<GoodsListResult>({
        url: `/admin/goods/${pageNum}`,
        method: 'get',
        params: {
            limit,
            tab,
            title,
            categoryId,
        },
    })

export const deleteGoodsApi = (ids: number[]) =>
    request<string>({
        url: '/admin/goods/delete_all',
        method: 'post',
        data: {
            ids,
        },
    })

export const restoreGoodsApi = (ids: number[]) =>
    request<string>({
        url: '/admin/goods/restore',
        method: 'post',
        data: {
            ids,
        },
    })

export const destroyGoodsApi = (ids: number[]) =>
    request<string>({
        url: '/admin/goods/destroy',
        method: 'post',
        data: {
            ids,
        },
    })

export const checkGoodsApi = (id: number, check: number) =>
    request<boolean>({
        url: `/admin/goods/${id}/check`,
        method: 'post',
        data: {
            check,
        },
    })

export const setGoodsBannerApi = (id: number, banners: string[]) =>
    request({
        url: `/admin/goods/banners/${id}`,
        method: 'post',
        data: {
            banners,
        },
    })

export const getGoodsDetailApi = (id: number) =>
    request<GoodsDetailResult>({
        url: `/admin/goods/read/${id}`,
        method: 'get',
    })

export const editGoodsSkusApi = (id: number, data: EditGoodsSkusForm) =>
    request<number>({
        url: `/admin/goods/updateskus/${id}`,
        method: 'post',
        data,
    })

export const addGoodsSkusCardApi = (data: AddGoodsSkusCardForm) =>
    request<AddGoodsSkusCardForm & { id: number }>({
        url: '/admin/goods_skus_card',
        method: 'post',
        data,
    })

export const editGoodsSkusCardApi = (id: number, data: AddGoodsSkusCardForm) =>
    request({
        url: `/admin/goods_skus_card/${id}`,
        method: 'post',
        data,
    })

export const deleteGoodsSkusCardApi = (id: number) =>
    request<boolean>({
        url: `/admin/goods_skus_card/${id}/delete`,
        method: 'post',
    })

export const sortGoodsSkusCardApi = (sortdata: Array<{ id: number; order: number }>) =>
    request({
        url: '/admin/goods_skus_card/sort',
        method: 'post',
        data: {
            sortdata,
        },
    })

export const addGoodsSkusCardValueApi = (data: AddGoodsSkusCardValueForm) =>
    request<AddGoodsSkusCardValueForm & { id: number }>({
        url: '/admin/goods_skus_card_value',
        method: 'post',
        data,
    })

export const editGoodsSkusCardValueApi = (id: number, data: AddGoodsSkusCardValueForm) =>
    request<boolean>({
        url: `/admin/goods_skus_card_value/${id}`,
        method: 'post',
        data,
    })

export const deleteGoodsSkusCardValueApi = (id: number) =>
    request<boolean>({
        url: `/admin/goods_skus_card_value/${id}/delete`,
        method: 'post',
    })

export const setGoodsSkusCardApi = (id: number, data: SetGoodsSkusCardForm) =>
    request({
        url: `/admin/goods_skus_card/${id}/set`,
        method: 'post',
        data,
    })
