<script setup lang="ts">
import { Aim, ArrowDown, CoffeeCup, Fold, FullScreen, Refresh, VideoCamera } from '@element-plus/icons-vue'
import { useUserStore } from '@/store/user.ts'
import { ElMessageBox, ElNotification, FormRules } from 'element-plus'
import { useFullscreen } from '@vueuse/core'
import { refreshWindow } from '@/utils/tools.ts'
import { reactive, ref } from 'vue'
import { updatePwdApi } from '@/api/user.ts'
import { FormInstance } from 'element-plus/lib/components'
import FormDrawer from '@/components/FormDrawer.vue'

export interface UpdatePwdParams {
    password: string
    oldpassword: string
    repassword: string
}

const { userInfo, logout } = useUserStore()

const { toggle, isFullscreen } = useFullscreen()

const handleLogout = () => {
    ElMessageBox.confirm('确认要退出登录吗?', '退出登录', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(() => {
        logout()
        ElNotification({
            type: 'success',
            message: '退出登录成功',
            duration: 2000,
        })
    })
}

const updatePwdFormRef = ref<FormInstance>()

const updatePwdForm = reactive<UpdatePwdParams>({
    password: '',
    oldpassword: '',
    repassword: '',
})

const updatePwdRules: FormRules<UpdatePwdParams> = {
    password: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
    oldpassword: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
    repassword: [{ required: true, message: '请输入确认密码', trigger: 'blur' }],
}

const updatePwd = () => {
    updatePwdFormRef.value?.validate(async (valid) => {
        if (valid) {
            formDrawerRef.value?.showLoading()
            await updatePwdApi(updatePwdForm).finally(() => formDrawerRef.value?.hideLoading())
            ElNotification({
                type: 'success',
                message: '重置密码成功',
                duration: 2000,
            })
            await logout()
        }
    })
}

const formDrawerRef = ref<InstanceType<typeof FormDrawer>>()
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
                <span class="el-dropdown-link text-light-50">
                    {{ userInfo?.username }}
                    <el-icon class="el-icon--right">
                        <arrow-down />
                    </el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item @click="formDrawerRef?.open">修改密码</el-dropdown-item>
                        <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
        <form-drawer ref="formDrawerRef" title="重置密码" @submit="updatePwd" @cancel="updatePwdFormRef?.resetFields">
            <el-form ref="updatePwdFormRef" :model="updatePwdForm" :rules="updatePwdRules" label-width="90">
                <el-form-item label="旧密码:" prop="oldpassword">
                    <el-input v-model="updatePwdForm.oldpassword" placeholder="请输入旧密码"></el-input>
                </el-form-item>
                <el-form-item label="新密码:" prop="password">
                    <el-input v-model="updatePwdForm.password" placeholder="请输入新密码"></el-input>
                </el-form-item>
                <el-form-item label="确认密码:" prop="repassword">
                    <el-input v-model="updatePwdForm.repassword" placeholder="请输入确认密码"></el-input>
                </el-form-item>
            </el-form>
        </form-drawer>
    </div>
</template>

<style scoped></style>
