<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user.ts'
import { storeToRefs } from 'pinia'
import { addRoutes } from '@/router'

const router = useRouter()

const userStore = useUserStore()

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
</style>
