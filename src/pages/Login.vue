<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElNotification, FormRules } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import { FormInstance } from 'element-plus/lib/components'
import { useUserStore } from '@/store/user.ts'
import { useRouter } from 'vue-router'

export interface LoginParams {
  username: string
  password: string
}

const isLoading = ref(false)

const loginForm = reactive<LoginParams>({
  username: '',
  password: '',
})

const loginFormRules: FormRules<LoginParams> = {
  username: [
    { required: true, message: '用户名不能为空', trigger: 'blur' },
    {
      min: 4,
      max: 12,
      message: '长度为4-12个字符',
      trigger: 'blur',
    },
  ],
  password: [
    { required: true, message: '密码不能为空', trigger: 'blur' },
    {
      min: 5,
      max: 16,
      message: '长度为5-16个字符',
      trigger: 'blur',
    },
  ],
}

const loginFormRef = ref<FormInstance>()

const { login, getUserInfo } = useUserStore()

const router = useRouter()

const onLogin = () => {
  loginFormRef.value?.validate(async (valid) => {
    if (valid) {
      isLoading.value = true
      await login(loginForm).finally(() => (isLoading.value = false))
      await getUserInfo()
      await router.push('/')
      ElNotification({
        type: 'success',
        message: '登录成功',
      })
    }
  })
}
</script>

<template>
  <div class="row w-screen h-screen">
    <div class="col-12 md:col-8 bg-blue-500 flex-center flex-col text-light-50">
      <div class="font-bold text-2xl md:text-5xl px-4">欢迎光临</div>
      <div class="text-sm md:text-xl text-gray-50 mt-4 px-4">
        商城后台管理系统，技术栈：vue3+typescript+vite+unocss+element-plus
      </div>
    </div>
    <div class="col-12 md:col-4 flex-col bg-light-500 flex-center">
      <div class="text-xl md:text-2xl font-bold">欢迎回来</div>
      <div class="flex-center space-x-4">
        <div class="w-16 h-1px bg-gray-300"></div>
        <div class="text-14px md:text-16px text-gray-500 my-4">账号密码登录</div>
        <div class="w-16 h-1px bg-gray-300"></div>
      </div>
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" class="w-250px">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" :prefix-icon="User" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            :prefix-icon="Lock"
            type="password"
            show-password
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" round class="w-full" :loading="isLoading" @click="onLogin">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style scoped></style>
