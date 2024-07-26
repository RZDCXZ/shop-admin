import request from '@/utils/request.ts'
import { Status } from '@/constant/enum.ts'

export interface DistributionStatisticsResult {
    panels: Array<{
        color: string
        label: string
        value: number
    }>
}

export interface DistributionAgentForm {
    keyword?: string | null
    type: string | null
    starttime: string | null
    endtime: string | null
    level?: number | null
    user_id?: number | null
}

export interface DistributionAgentResult {
    list: Array<{
        id: number
        username: string
        avatar: string
        nickname: string
        phone: string
        email: string
        create_time: string
        status: Status
        share_num: number
        share_order_num: number
        order_price: string
        commission: string
        cash_out_price: string
        cash_out_time: string
        no_cash_out_price: string
        p1: string
        p2: string
        user_info: {
            id: number
            user_id: number
            sex: string
            birthday: string
            name: string
            phone: string
        }
    }>
    totalCount: number
}

export interface DistributionListResult {
    list: Array<{
        id: number
        user_id: number
        level: number
        order_id: number
        commission: string
        status: Status
        create_time: string
        update_time: string
        order: {
            id: number
            no: string
        }
        user: {
            id: number
            username: string
            password: string
            phone: number
        }
    }>
    totalCount: number
}

export interface DistributionConfigResult {
    id: number
    open_reg: number
    reg_method: string
    password_min: number
    password_encrypt: string | number[]
    upload_method: string
    upload_config: {
        Bucket: string
        http: string
        ACCESS_KEY: string
        SECRET_KEY: string
    }
    api_safe: number
    api_secret: string
    close_order_minute: number
    auto_received_day: number
    after_sale_day: number
    alipay: {
        app_id: string
        ali_public_key: string
        private_key: string
    }
    wxpay: {
        app_id: string
        miniapp_id: string
        secret: string
        appid: string
        mch_id: string
        key: string
        cert_client: string
        cert_key: string
    }
    ship: string
}

export interface EditDistributionConfigForm {
    distribution_open: number
    store_first_rebate: number
    store_second_rebate: number
    spread_banners: string[]
    is_self_brokerage: number
    settlement_days: number
    brokerage_method: string
}

export const getDistributionStatisticsApi = () =>
    request<DistributionStatisticsResult>({
        url: '/admin/agent/statistics',
        method: 'get',
    })

export const getDistributionAgentApi = (pageNum: number, params: DistributionAgentForm) =>
    request<DistributionAgentResult>({
        url: `/admin/agent/${pageNum}`,
        method: 'get',
        params,
    })

export const getDistributionListApi = (
    pageNum: number,
    params: { type: string | null; starttime: string | null; endtime: string | null },
) =>
    request<DistributionListResult>({
        url: `/admin/user_bill/${pageNum}`,
        method: 'get',
        params,
    })

export const getDistributionConfigApi = () =>
    request<DistributionConfigResult>({
        url: '/admin/distribution_setting/get',
        method: 'get',
    })

export const editDistributionConfigApi = (data: EditDistributionConfigForm) =>
    request<number>({
        url: '/admin/distribution_setting/set',
        method: 'post',
        data,
    })
