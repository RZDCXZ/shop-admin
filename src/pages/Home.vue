<script setup lang="ts">
import { getStatistics1Api, getStatistics2Api, getStatistics3Api } from '@/api'
import type { PanelItem } from '@/api'
import { ref } from 'vue'
import CountTo from '@/layout/components/CountTo.vue'

const panels = ref<Array<PanelItem>>([])

const getStatistics = async () => {
    const result = await getStatistics1Api()
    panels.value = result.data.panels
}

getStatistics()
</script>

<template>
    <div>
        <div class="flex flex-wrap md:space-x-6">
            <template v-if="panels.length > 0">
                <el-card
                    v-for="(item, index) in panels"
                    :key="index"
                    class="col-12 mb-4 md:flex-1 md:mb-0"
                    shadow="hover"
                >
                    <template #header>
                        <div class="flex justify-between">
                            <span>{{ item.title }}</span>
                            <el-tag :type="item.uintColor" effect="plain">{{ item.unit }}</el-tag>
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
            </template>
            <template v-else>
                <el-skeleton v-for="i in 4" :key="i" class="col-12 mb-4 md:flex-1 md:mb-0" animated loading>
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
            </template>
        </div>
    </div>
</template>

<style scoped></style>
