<script setup lang="ts">
import ImageAside from '@/components/ImageAside.vue'
import ImageMain from '@/components/ImageMain.vue'
import { computed, ref } from 'vue'

const height = computed(() => (window.innerHeight || document.body.clientHeight) - 64 - 48 - 40)

const imageAsideRef = ref<InstanceType<typeof ImageAside>>()

const onAddCategoryClick = () => {
    imageAsideRef.value?.createDrawer()
}
</script>

<template>
    <el-container class="bg-white rounded" :style="{ height: height + 'px' }">
        <el-header class="flex items-center border-b">
            <el-button type="primary" size="small" @click="onAddCategoryClick">新增图片分类</el-button>
        </el-header>
        <el-container>
            <ImageAside ref="imageAsideRef"></ImageAside>
            <ImageMain></ImageMain>
        </el-container>
    </el-container>
</template>

<style scoped></style>
