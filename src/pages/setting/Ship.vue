<script setup lang="ts">
import { getSysconfigApi, editSysconfigApi } from '@/api/sysconfig.ts'
import { ref } from 'vue'
import { ElNotification } from 'element-plus'

const loading = ref(false)

const form = ref({
    ship: '',
})

const getData = async () => {
    loading.value = true
    const result = await getSysconfigApi().finally(() => (loading.value = false))
    form.value.ship = result.data.ship
}

const onSubmit = async () => {
    loading.value = true
    await editSysconfigApi(form.value.ship).finally(() => (loading.value = false))
    ElNotification({
        type: 'success',
        message: '修改成功',
        duration: 2000,
    })
    await getData()
}

getData()
</script>

<template>
    <div v-loading="loading" class="bg-white p-4 rounded">
        <el-form :model="form">
            <el-form-item label="物流查询key">
                <div>
                    <el-input v-model="form.ship" placeholder="物流查询key"></el-input>
                    <small class="text-gray-500 flex mt-1">用于查询物流信息,接口申请(仅供参考)</small>
                </div>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<style scoped></style>
