<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
    <el-result icon="warning" title="404 页面走丢了~">
        <template #extra>
            <el-button type="primary" @click="router.push('/')">回到首页</el-button>
        </template>
    </el-result>
</template>

<style scoped></style>
