<script setup lang="ts">
import AsideList from '@/components/AsideList.vue'
import { getImageCategoryListApi, ImageCategoryListResult } from '@/api/image_class.ts'
import { ref } from 'vue'

const activeId = ref(0)

const currentPage = ref(1)

const limit = ref(10)

const categoryTotal = ref(0)

const imageCategoryList = ref<ImageCategoryListResult['list']>([])

const onImageCategoryClick = (category: ImageCategoryListResult['list'][0]) => {
    activeId.value = category.id
}

const getImageList = async (pageNum: number) => {
    currentPage.value = pageNum

    const result = await getImageCategoryListApi(currentPage.value, limit.value)

    imageCategoryList.value = result.data.list

    categoryTotal.value = result.data.totalCount

    const item = result.data.list[0]
    // 默认选中第一个
    if (item) {
        activeId.value = item.id
    }
}

getImageList(1)
</script>

<template>
    <el-aside class="border-r relative">
        <div class="absolute top-0 left-0 right-0 bottom-50px overflow-y-scroll">
            <AsideList
                v-for="(item, index) in imageCategoryList"
                :key="index"
                :active="activeId === item.id"
                @click="onImageCategoryClick(item)"
                >{{ item.name }}</AsideList
            >
        </div>
        <div class="h-50px flex-center absolute left-0 right-0 bottom-0 border-t">
            <el-pagination
                layout="prev, next"
                background
                :total="categoryTotal"
                :current-page="currentPage"
                :page-size="limit"
                @current-change="getImageList"
            />
        </div>
    </el-aside>
</template>

<style scoped></style>
