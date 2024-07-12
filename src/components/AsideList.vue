<script setup lang="ts">
import { Close, Edit } from '@element-plus/icons-vue'

withDefaults(
    defineProps<{
        active?: boolean
    }>(),
    {
        active: false,
    },
)

const emits = defineEmits(['edit', 'delete'])
</script>

<template>
    <div
        class="flex items-center p-3 text-sm text-gray-600 cursor-pointer border-b border-gray-100 hover:bg-blue-50"
        :class="{ 'bg-blue-50': active }"
    >
        <span class="truncate"><slot></slot></span>
        <el-button class="ml-auto !px-1" text type="primary" size="small" @click="emits('edit')">
            <el-icon :size="12"><Edit></Edit></el-icon>
        </el-button>
        <el-popconfirm
            title="确定删除该分类吗?"
            confirm-button-text="确定"
            cancel-button-text="取消"
            @confirm="emits('delete')"
        >
            <template #reference>
                <el-button class="!px-1" text type="primary" size="small">
                    <el-icon :size="12"><Close></Close></el-icon>
                </el-button>
            </template>
        </el-popconfirm>
    </div>
</template>

<style scoped></style>
