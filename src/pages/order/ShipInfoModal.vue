<script setup lang="ts">
import { ref } from 'vue'
import { isMobile } from '@/utils/tools.ts'
import { getOrderShipInfoApi, OrderShipInfoResult } from '@/api/order.ts'
import { ElNotification } from 'element-plus'

const dialogVisible = ref(false)

const info = ref<OrderShipInfoResult['result']>()

const open = async (id: number) => {
    const result = await getOrderShipInfoApi(id)
    if (result.data.status !== 0) {
        return ElNotification({
            type: 'error',
            message: result.data.msg,
            duration: 2000,
        })
    }
    info.value = result.data.result
    dialogVisible.value = true
}

const close = () => {
    dialogVisible.value = false
}

defineExpose({
    open,
    close,
})
</script>

<template>
    <div>
        <el-drawer v-model="dialogVisible" title="物流信息" :size="isMobile() ? '80%' : '35%'">
            <el-card shadow="never" class="!border-0 mb-3">
                <div class="flex items-center">
                    <el-image :src="info.logo" fit="fill" lazy class="!w-60px !h-60px !rounded !border"></el-image>
                    <div class="ml-3">
                        <p>物流公司: {{ info.typename }}</p>
                        <p>物流单号: {{ info.number }}</p>
                    </div>
                </div>
            </el-card>
            <el-card shadow="never" class="!border-0 !border-t">
                <el-timeline>
                    <el-timeline-item
                        v-for="(item, index) in info.list"
                        :key="index"
                        :timestamp="item.time"
                        placement="top"
                        >{{ item.status }}</el-timeline-item
                    >
                </el-timeline>
            </el-card>
        </el-drawer>
    </div>
</template>

<style scoped></style>
