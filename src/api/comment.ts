import request from '@/utils/request.ts'
import { Status } from '@/constant/enum.ts'

export interface CommentListResult {
    list: Array<{
        id: number
        order_id: number
        shop_id: number
        num: number
        price: number
        rating: number
        review: {
            data: string
            image: Array<string>
        }
        review_time: string
        create_time: string
        skus_type: number
        goods_id: number
        goods_num: number
        user_id: number
        extra: string
        status: Status
        goods_item: {
            id: number
            title: string
            category_id: number
            cover: string
            rating: number
            sale_count: number
            review_count: string
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
        }
        user: {
            id: number
            username: string
            avatar: string
            nickname: string
            phone: string
            email: string
            user_level_id: number
            create_time: string
            update_time: string
            last_login_time: string | null
            status: Status
        }
    }>
    totalCount: number
}

export const getCommentListApi = (pageNum: number, title: string | null) =>
    request<CommentListResult>({
        url: `/admin/goods_comment/${pageNum}`,
        method: 'get',
        params: {
            title,
        },
    })

export const changeCommentStatusApi = (id: number, status: Status) =>
    request<boolean>({
        url: `/admin/goods_comment/${id}/update_status`,
        method: 'post',
        data: {
            status,
        },
    })

export const reviewCommentApi = (id: number, data: string) =>
    request<boolean>({
        url: `/admin/goods_comment/review/${id}`,
        method: 'post',
        data: {
            data,
        },
    })
