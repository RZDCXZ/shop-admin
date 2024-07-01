<script setup lang="ts">
import { HomeNavList } from '@/constant/config.ts'
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
    <div class="my-5 flex flex-wrap justify-around">
        <el-card
            v-for="item in HomeNavList"
            :key="item.path"
            class="cursor-pointer col-5 md:col-1 mb-2 md:mb-0"
            shadow="hover"
            @click="router.push(item.path)"
        >
            <div class="flex flex-col items-center">
                <el-icon :size="25" :class="item.color">
                    <component :is="item.icon"></component>
                </el-icon>
                <span class="text-sm mt-2">{{ item.title }}</span>
            </div>
        </el-card>
    </div>
</template>

<style scoped></style>
