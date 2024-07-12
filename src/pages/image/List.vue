<script setup lang="ts">
import ImageAside from '@/components/ImageAside.vue'
import ImageMain from '@/components/ImageMain.vue'
import { computed, ref } from 'vue'

const height = computed(() => (window.innerHeight || document.body.clientHeight) - 64 - 48 - 40)

const imageAsideRef = ref<InstanceType<typeof ImageAside>>()

const imageMainRef = ref<InstanceType<typeof ImageMain>>()

const onAddCategoryClick = () => {
    imageAsideRef.value?.createDrawer()
}

const onUploadClick = () => {
    imageMainRef.value?.showDrawer()
}

const onCategoryChange = (categoryId: number) => imageMainRef.value?.loadData(categoryId)
</script>

<template>
    <el-container class="bg-white rounded" :style="{ height: height + 'px' }">
        <el-header class="flex items-center border-b">
            <el-button type="primary" size="small" @click="onAddCategoryClick">新增图片分类</el-button>
            <el-button type="warning" size="small" @click="onUploadClick">上传图片</el-button>
        </el-header>
        <el-container>
            <ImageAside ref="imageAsideRef" @change="onCategoryChange"></ImageAside>
            <ImageMain ref="imageMainRef"></ImageMain>
        </el-container>
    </el-container>
</template>

<style scoped></style>
