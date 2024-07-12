import request from '@/utils/request.ts'

export interface NoticeListResult {
    list: Array<{
        id: number
        title: string
        content: string
        order: number
        create_time: string
        update_time: string
    }>
    totalCount: number
}

export interface AddNoticeResult {
    title: string
    content: string
    create_time: string
    update_time: string
    id: number
}

export const getNoticeListApi = (pageNum: number) =>
    request<NoticeListResult>({
        url: `/admin/notice/${pageNum}`,
        method: 'get',
    })

export const addNoticeApi = (title: string, content: string) =>
    request<AddNoticeResult>({
        url: '/admin/notice',
        method: 'post',
        data: {
            title,
            content,
        },
    })

export const editNoticeApi = (id: number, title: string, content: string) =>
    request<boolean>({
        url: `/admin/notice/${id}`,
        method: 'post',
        data: {
            title,
            content,
        },
    })

export const deleteNoticeApi = (id: number) =>
    request<boolean>({
        url: `/admin/notice/${id}/delete`,
        method: 'post',
    })
