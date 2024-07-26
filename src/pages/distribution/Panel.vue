<script setup lang="ts">
import { DistributionStatisticsResult, getDistributionStatisticsApi } from '@/api/distribution.ts'
import { ref } from 'vue'
import { PriceTag, ShoppingCart, Timer, User } from '@element-plus/icons-vue'

const loading = ref(false)

const list = ref<DistributionStatisticsResult['panels']>([])

const getData = async () => {
    loading.value = true
    const result = await getDistributionStatisticsApi().finally(() => (loading.value = false))
    list.value = result.data.panels
}

getData()
</script>

<template>
    <div v-loading="loading">
        <el-row :gutter="20">
            <el-col v-for="(item, index) in list" :key="index" :span="6" :xs="12" class="mb-4">
                <el-card shadow="never">
                    <div class="flex items-center">
                        <el-icon :size="20" :class="item.color" class="!w-40px !h-40px !rounded">
                            <User v-if="index === 0"></User>
                            <ShoppingCart v-if="index === 1"></ShoppingCart>
                            <PriceTag v-if="index === 2"></PriceTag>
                            <Timer v-if="index === 3"></Timer>
                        </el-icon>
                        <div class="ml-2">
                            <h2 class="text-lg font-bold">{{ item.value }}</h2>
                            <small class="text-xs text-gray-400">{{ item.label }}</small>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<style scoped></style>
