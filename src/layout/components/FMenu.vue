<script setup lang="ts">
import { useMenuStore } from '@/store/menu.ts'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { ref, watch } from 'vue'
import { isMobile } from '@/utils/tools.ts'

const { isCollapse, menus } = storeToRefs(useMenuStore())

const route = useRoute()

const defaultActive = ref(route.path)

watch(
    () => route.path,
    (newPath: string) => {
        defaultActive.value = newPath
    },
)

const onWindowResize = () => {
    if (isMobile() && !isCollapse.value) {
        isCollapse.value = true
    }
    if (!isMobile() && isCollapse.value) {
        isCollapse.value = false
    }
}

onWindowResize()

let timer: any

window.onresize = () => {
    if (timer) {
        clearTimeout(timer)
    }
    timer = setTimeout(() => {
        onWindowResize()
    }, 300)
}
</script>

<template>
    <el-menu
        :default-active="defaultActive"
        router
        :collapse="isCollapse"
        :collapse-transition="false"
        :unique-opened="true"
        class="wh-full overflow-x-hidden !border-0"
    >
        <template v-for="(item, index) in menus" :key="index">
            <el-sub-menu v-if="item.child && item.child.length" :key="index" :index="item.name">
                <template #title>
                    <el-icon><component :is="item.icon"></component></el-icon>
                    <span>{{ item.name }}</span>
                </template>
                <el-menu-item v-for="item2 in item.child" :key="item2.name" :index="item2.frontpath">
                    <el-icon><component :is="item2.icon"></component></el-icon>
                    <span>{{ item2.name }}</span>
                </el-menu-item>
            </el-sub-menu>
            <el-menu-item v-else :index="item.frontpath">
                <el-icon><component :is="item.icon"></component></el-icon>
                <span>{{ item.name }}</span>
            </el-menu-item>
        </template>
    </el-menu>
</template>

<style scoped>
.el-menu::-webkit-scrollbar {
    width: 0;
}
</style>
