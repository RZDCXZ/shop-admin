<script setup lang="ts">
import { useUserStore } from '@/store/user.ts'
import { ElMessageBox } from 'element-plus'

const { logout } = useUserStore()

const handleLogout = () => {
    ElMessageBox.confirm('确认要退出登录吗?', '退出登录', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(() => {
        logout()
    })
}
</script>

<template>
    <div>Home page <el-button @click="handleLogout">退出登录</el-button></div>
</template>

<style scoped></style>
