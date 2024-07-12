import request from '@/utils/request.ts'

export interface ImageCategoryListResult {
    list: Array<{
        id: number
        name: string
        order: number
        images_count: number
    }>
    totalCount: number
}

interface AddImageCategoryResult {
    name: string
    order: string | number
    id: string
}

// 图库列表
export const getImageCategoryListApi = (pageNum: number = 1, pageSize: number = 100) =>
    request<ImageCategoryListResult>({
        url: `/admin/image_class/${pageNum}`,
        method: 'get',
        params: {
            limit: pageSize,
        },
    })

// 增加图库分类
export const addImageCategoryApi = (name: string, order: number) =>
    request<AddImageCategoryResult>({
        url: '/admin/image_class',
        method: 'post',
        data: {
            name,
            order,
        },
    })

// 修改图库分类
export const editImageCategoryApi = (categoryId: number, name: string, order: number) =>
    request<boolean>({
        url: `/admin/image_class/${categoryId}`,
        method: 'post',
        data: {
            name,
            order,
        },
    })

// 删除图库分类
export const deleteImageCategoryApi = (categoryId: number) =>
    request<boolean>({
        url: `/admin/image_class/${categoryId}/delete`,
        method: 'post',
    })
