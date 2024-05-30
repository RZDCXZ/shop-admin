<script setup lang="ts">
import { Aim, ArrowDown, CoffeeCup, Fold, FullScreen, Refresh, VideoCamera } from '@element-plus/icons-vue'
import { useUserStore } from '@/store/user.ts'
import { ElMessageBox } from 'element-plus'
import { useFullscreen } from '@vueuse/core'
import { refreshWindow } from '@/utils/tools.ts'

const { userInfo, logout } = useUserStore()

const { toggle, isFullscreen } = useFullscreen()

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
    <div class="h-full flex items-center text-light-50 px-8">
        <el-icon size="22">
            <CoffeeCup />
        </el-icon>
        <span class="text-xl ml-2">商城后台管理系统</span>
        <el-tooltip effect="dark" content="收起菜单" placement="bottom">
            <el-icon class="ml-16 cursor-pointer">
                <Fold />
            </el-icon>
        </el-tooltip>
        <el-tooltip effect="dark" content="刷新" placement="bottom">
            <el-icon class="ml-8 cursor-pointer" @click="refreshWindow">
                <Refresh />
            </el-icon>
        </el-tooltip>
        <div class="ml-auto flex items-center">
            <el-icon>
                <VideoCamera />
            </el-icon>
            <el-tooltip effect="dark" :content="isFullscreen ? '退出全屏' : '全屏'" placement="bottom">
                <el-icon class="mx-8 cursor-pointer" @click="toggle">
                    <component :is="isFullscreen ? Aim : FullScreen"></component>
                </el-icon>
            </el-tooltip>
            <el-avatar class="mr-4" :src="userInfo?.avatar" />
            <el-dropdown>
                <span class="el-dropdown-link">
                    {{ userInfo?.username }}
                    <el-icon class="el-icon--right">
                        <arrow-down />
                    </el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item>修改密码</el-dropdown-item>
                        <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>

<style scoped></style>
