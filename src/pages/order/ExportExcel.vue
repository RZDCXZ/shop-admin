<script setup lang="ts">
import { isMobile } from '@/utils/tools.ts'
import { ref } from 'vue'
import { exportOrderApi } from '@/api/order.ts'
import { ElNotification } from 'element-plus'

defineProps<{
    tabs: Array<{ key: string; name: string }>
}>()

const dialogVisible = ref(false)

const form = ref({
    tab: 'all',
    time: '',
})

const open = () => {
    dialogVisible.value = true
}

const close = () => {
    dialogVisible.value = false
}

const loading = ref(false)

const onSubmit = async () => {
    if (!form.value.tab)
        return ElNotification({
            type: 'warning',
            message: '订单类型不能为空',
            duration: 2000,
        })
    loading.value = true
    let starttime = null
    let endtime = null
    if (form.value.time && Array.isArray(form.value.time)) {
        starttime = form.value.time[0]
        endtime = form.value.time[1]
    }
    const result = await exportOrderApi({ tab: form.value.tab, starttime, endtime }).finally(
        () => (loading.value = false),
    )
    let url = window.URL.createObjectURL(new Blob([result as any]))
    let link = document.createElement('a')
    link.style.display = 'none'
    link.href = url
    let filename = new Date().getTime() + '.xlsx'
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    close()
}

defineExpose({
    open,
    close,
})
</script>

<template>
    <div>
        <el-drawer v-model="dialogVisible" :size="isMobile() ? '80%' : '45%'" title="导出订单">
            <el-form :model="form">
                <el-form-item label="订单类型">
                    <el-select v-model="form.tab" placeholder="请选择">
                        <el-option
                            v-for="item in tabs"
                            :key="item.key"
                            :label="item.name"
                            :value="item.key"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="时间范围">
                    <el-date-picker
                        v-model="form.time"
                        type="daterange"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        range-separator="至"
                        value-format="YYYY-MM-DD"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" :loading="loading" @click="onSubmit">导出</el-button>
                </el-form-item>
            </el-form>
        </el-drawer>
    </div>
</template>

<style scoped></style>
