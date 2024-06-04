<script setup lang="ts">
import FHeader from '@/layout/components/FHeader.vue'
import FMenu from '@/layout/components/FMenu.vue'
import FTagList from './components/FTagList.vue'
import { useUserStore } from '@/store/user.ts'
import { storeToRefs } from 'pinia'

const { isCollapse } = storeToRefs(useUserStore())
</script>

<template>
    <el-container>
        <el-header class="bg-blue-500 !h-64px">
            <f-header></f-header>
        </el-header>
        <el-container>
            <el-aside class="fixed top-64px bottom-0" :width="isCollapse ? '64px' : '250px'">
                <f-menu></f-menu>
            </el-aside>
            <el-main
                class="fixed top-64px bottom-0 right-0 overflow-y-scroll"
                :class="isCollapse ? 'left-64px' : 'left-250px'"
            >
                <f-tag-list></f-tag-list>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<style scoped>
.el-aside {
    transition: width 0.2s;
}
</style>
