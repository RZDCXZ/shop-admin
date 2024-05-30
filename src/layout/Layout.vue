<script setup lang="ts">
import FHeader from '@/layout/components/FHeader.vue'
import FMenu from '@/layout/components/FMenu.vue'
import FTagList from './components/FTagList.vue'
</script>

<template>
    <el-container>
        <el-header class="bg-blue-500 !h-64px">
            <f-header></f-header>
        </el-header>
        <el-container>
            <el-aside>
                <f-menu></f-menu>
            </el-aside>
            <el-main>
                <f-tag-list></f-tag-list>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<style scoped></style>
