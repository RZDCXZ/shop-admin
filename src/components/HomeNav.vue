<script setup lang="ts">
import { HomeNavList } from '@/constant/config.ts'
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
    <el-row :gutter="20">
        <el-col v-for="item in HomeNavList" :key="item.path" :xs="12" :span="3">
            <el-card shadow="hover" class="cursor-pointer col-5 md:col-1 mb-2 md:mb-0" @click="router.push(item.path)">
                <div class="flex flex-col items-center">
                    <el-icon :size="25" :class="item.color">
                        <component :is="item.icon"></component>
                    </el-icon>
                    <span class="text-sm mt-2">{{ item.title }}</span>
                </div>
            </el-card>
        </el-col>
    </el-row>
</template>

<style scoped></style>
