<script setup lang="ts">
import { Refresh } from '@element-plus/icons-vue'

const emits = defineEmits(['add', 'refresh'])
</script>

<template>
    <div class="flex items-center justify-between mb-4">
        <el-button type="primary" size="small" @click="emits('add')">新增</el-button>
        <el-tooltip effect="dark" content="刷新数据" placement="top">
            <el-button text @click="emits('refresh')">
                <el-icon :size="20">
                    <Refresh></Refresh>
                </el-icon>
            </el-button>
        </el-tooltip>
    </div>
</template>

<style scoped></style>
