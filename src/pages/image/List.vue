<script setup lang="ts">
import ImageAside from '@/components/ImageAside.vue'
import ImageMain from '@/components/ImageMain.vue'
import { computed } from 'vue'

const height = computed(() => (window.innerHeight || document.body.clientHeight) - 64 - 48 - 40)
</script>

<template>
    <el-container class="bg-white rounded" :style="{ height: height + 'px' }">
        <el-header class="flex items-center border-b">header</el-header>
        <el-container>
            <ImageAside></ImageAside>
            <ImageMain></ImageMain>
        </el-container>
    </el-container>
</template>

<style scoped></style>
