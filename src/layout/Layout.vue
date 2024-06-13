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
            <f-tag-list></f-tag-list>
            <el-main
                class="fixed top-112px bottom-0 right-0 overflow-y-scroll"
                :class="isCollapse ? 'left-64px' : 'left-250px'"
            >
                <router-view v-slot="{ Component }">
                    <transition
                        :duration="330"
                        enter-active-class="animate__animated animate__fadeIn"
                        leave-active-class="animate__animated animate__fadeOut"
                    >
                        <keep-alive :max="10">
                            <component :is="Component"></component>
                        </keep-alive>
                    </transition>
                </router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<style scoped>
.el-aside {
    transition: width 0.2s;
}
</style>
