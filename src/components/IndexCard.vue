<script setup lang="ts">
defineProps<{
    title: string
    tip: string
    data: Array<{ label: string; value: number }>
}>()
</script>

<template>
    <div class="mb-6">
        <el-card shadow="never">
            <template #header>
                <div class="flex justify-between items-center">
                    <span class="text-sm">{{ title }}</span>
                    <el-tag type="danger" effect="plain">{{ tip }}</el-tag>
                </div>
            </template>
            <el-row :gutter="20">
                <el-col v-for="(item, index) in data" :key="index" :span="6">
                    <el-card shadow="hover">
                        <div class="flex flex-col items-center">
                            <span class="text-xl mb-2">{{ item.value }}</span>
                            <span class="text-sm text-gray-500">{{ item.label }}</span>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>

<style scoped></style>
