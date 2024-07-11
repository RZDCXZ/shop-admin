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

interface CategoryImageListResult {
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

// 获取指定分类下的图片列表
export const getImageListByCategoryApi = (categoryId: number, pageNum: number = 1, pageSize: number = 10) =>
    request<CategoryImageListResult>({
        url: `/admin/image_class/${categoryId}/image/${pageNum}`,
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
export const editImageCategoryApi = (categoryId: string, name: string, order: number) =>
    request<boolean>({
        url: `/admin/image_class/${categoryId}`,
        method: 'post',
        data: {
            name,
            order,
        },
    })

// 删除图库分类
export const deleteImageCategoryApi = (categoryId: string) =>
    request<boolean>({
        url: `/admin/image_class/${categoryId}/delete`,
        method: 'post',
    })
