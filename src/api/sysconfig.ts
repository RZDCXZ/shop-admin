import request from '@/utils/request.ts'

export interface SysconfigResult {
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

export interface SysconfigEditForm {
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
}

export const getSysconfigApi = () =>
    request<SysconfigResult>({
        url: '/admin/sysconfig',
        method: 'get',
    })

export const editSysconfigApi = (data: any) =>
    request<boolean>({
        url: '/admin/sysconfig',
        method: 'post',
        data,
    })

export const uploadAction = import.meta.env.VITE_APP_BASE_API + '/admin/sysconfig/upload'
