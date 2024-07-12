import request from '@/utils/request.ts'

export interface CategoryImageListResult {
    list: Array<{
        id: number
        url: string
        name: string
        path: string
        create_time: string
        update_time: string
        image_class_id: number
    }>
    totalCount: number
}

// 获取指定分类下的图片列表
export const getImageListByCategoryApi = (categoryId: number, pageNum: number = 1, pageSize: number = 10) =>
    request<CategoryImageListResult>({
        url: `/admin/image_class/${categoryId}/image/${pageNum}`,
        method: 'get',
        params: {
            limit: pageSize,
        },
    })

export const editImageNameApi = (id: number, name: string) =>
    request<boolean>({
        url: `/admin/image/${id}`,
        method: 'post',
        data: {
            name,
        },
    })

export const deleteImageApi = (ids: Array<number>) =>
    request<boolean>({
        url: '/admin/image/delete_all',
        method: 'post',
        data: {
            ids,
        },
    })

export const uploadImageAction = '/api/admin/image/upload'
