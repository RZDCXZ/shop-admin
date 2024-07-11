<script setup lang="ts">
import { getStatistics1Api, getStatistics2Api } from '@/api'
import type { PanelItem, Statistics2Result } from '@/api'
import { ref } from 'vue'
import CountTo from '@/layout/components/CountTo.vue'
import HomeNav from '@/components/HomeNav.vue'
import IndexChart from '@/components/IndexChart.vue'
import IndexCard from '@/components/IndexCard.vue'

const panels = ref<Array<PanelItem>>([])

const getStatistics = async () => {
    const result = await getStatistics1Api()
    panels.value = result.data.panels
}

const goods = ref<Statistics2Result['goods']>([])

const order = ref<Statistics2Result['order']>([])

const getStatistics2 = async () => {
    const result = await getStatistics2Api()
    goods.value = result.data.goods
    order.value = result.data.order
}

getStatistics()

getStatistics2()
</script>

<template>
    <div>
        <el-row :gutter="20">
            <template v-if="panels.length > 0">
                <el-col v-for="(item, index) in panels" :key="index" :xs="24" :span="6" class="mb-4 md:mb-0">
                    <el-card shadow="hover">
                        <template #header>
                            <div class="flex justify-between">
                                <span>{{ item.title }}</span>
                                <el-tag :type="item.unitColor" effect="plain">{{ item.unit }}</el-tag>
                            </div>
                        </template>
                        <span class="text-3xl font-bold text-gray-500"><count-to :value="item.value"></count-to></span>
                        <template #footer>
                            <div class="flex justify-between text-gray-500">
                                <span>{{ item.subTitle }}</span>
                                <span>{{ item.subValue }}</span>
                            </div>
                        </template>
                    </el-card>
                </el-col>
            </template>
            <template v-else>
                <el-col v-for="i in 4" :key="i" :xs="24" :span="6" class="mb-4 md:mb-0">
                    <el-skeleton animated loading>
                        <template #template>
                            <el-card shadow="hover">
                                <template #header>
                                    <div class="flex justify-between">
                                        <el-skeleton-item variant="text" style="width: 40%"></el-skeleton-item>
                                        <el-skeleton-item variant="text" style="width: 20%"></el-skeleton-item>
                                    </div>
                                </template>
                                <el-skeleton-item variant="h3" style="width: 60%"></el-skeleton-item>
                                <template #footer>
                                    <div class="flex justify-between">
                                        <el-skeleton-item variant="text" style="width: 40%"></el-skeleton-item>
                                        <el-skeleton-item variant="text" style="width: 20%"></el-skeleton-item>
                                    </div>
                                </template>
                            </el-card>
                        </template>
                    </el-skeleton>
                </el-col>
            </template>
        </el-row>
        <HomeNav class="my-6"></HomeNav>
        <el-row :gutter="20">
            <el-col :xs="24" :span="12" class="mb-6 md:mb-0">
                <IndexChart></IndexChart>
            </el-col>
            <el-col :xs="24" :span="12">
                <IndexCard title="店铺及商品提示" tip="店铺及商品提示" :data="goods"></IndexCard>
                <IndexCard title="交易提示" tip="需要立即处理的交易订单" :data="order"></IndexCard>
            </el-col>
        </el-row>
    </div>
</template>

<style scoped></style>
