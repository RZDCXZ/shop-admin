<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMenuStore } from '@/store/menu.ts'
import { storeToRefs } from 'pinia'
import { addRoutes } from '@/router'

const router = useRouter()

const userStore = useMenuStore()

const { menus } = storeToRefs(userStore)

onMounted(() => {
    addRoutes(menus.value)
    router.replace(router.options.history.location)
})
</script>

<template>
    <router-view></router-view>
</template>

<style>
#nprogress .bar {
    height: 3px !important;
    background: #f4f4f4 !important;
}

*::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 6px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 1px;
}

*::-webkit-scrollbar-thumb {
    /*滚动条里面深色条*/
    border-radius: 10px;
    box-shadow: inset 0 0 5px rgba(236, 236, 236, 0.1);
    background: #ccc;
}

*::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    box-shadow: inset 0 0 5px rgba(236, 236, 236, 0.1);
    border-radius: 10px;
    background: #ededed;
}
</style>
