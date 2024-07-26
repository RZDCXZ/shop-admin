<script setup lang="ts">
import { isMobile } from '@/utils/tools.ts'
import { ref, computed } from 'vue'
import { useDateFormat } from '@vueuse/core'
import ShipInfoModal from '@/pages/order/ShipInfoModal.vue'

const props = defineProps<{
    info: any
}>()

const ship_time = computed(() => {
    if (props.info.ship_data) {
        const s = useDateFormat(props.info.ship_data.express_time, 'YYYY-MM-DD HH:mm:ss')
        return s.value
    }
    return ''
})

const refund_status = computed(() => {
    const opt: any = {
        pending: '未退款',
        applied: '已申请,等待审核',
        processing: '退款中',
        success: '退款成功',
        failed: '退款失败',
    }
    return props.info.refund_status ? opt[props.info.refund_status] : []
})

const dialogVisible = ref(false)

const open = () => {
    dialogVisible.value = true
}

const close = () => {
    dialogVisible.value = false
}

const shipInfoModalRef = ref<InstanceType<typeof ShipInfoModal>>()

const openShipInfoModal = (id: number) => {
    shipInfoModalRef.value?.open(id)
}

defineExpose({
    open,
    close,
})
</script>

<template>
    <div>
        <el-drawer v-model="dialogVisible" title="订单详情" :size="isMobile() ? '80%' : '45%'">
            <el-card shadow="never" class="mb-3">
                <template #header>
                    <b class="text-sm">订单详情</b>
                </template>
                <el-form label-width="120px">
                    <el-form-item label="订单号"> {{ info.no }} </el-form-item>
                    <el-form-item label="付款方式"> {{ info.payment_method }} </el-form-item>
                    <el-form-item label="付款时间"> {{ info.paid_time }} </el-form-item>
                    <el-form-item label="创建时间"> {{ info.create_time }} </el-form-item>
                </el-form>
            </el-card>
            <el-card v-if="info.ship_data" shadow="never" class="mb-3">
                <template #header>
                    <b class="text-sm">发货信息</b>
                </template>
                <el-form label-width="120px">
                    <el-form-item label="物流公司"> {{ info.ship_data.express_company }} </el-form-item>
                    <el-form-item label="运单号">
                        {{ info.ship_data.express_no }}
                        <el-button text type="primary" size="small" class="ml-3" @click="openShipInfoModal(info.id)"
                            >查看物流</el-button
                        >
                    </el-form-item>
                    <el-form-item label="发货时间"> {{ ship_time }} </el-form-item>
                </el-form>
            </el-card>
            <el-card shadow="never" class="mb-3">
                <template #header>
                    <b class="text-sm">商品信息</b>
                </template>
                <div v-for="(item, index) in info.order_items" :key="index" class="flex mb-2">
                    <el-image :src="item.gooods_item?.cover || ''" class="!w-60px !h-60px" fit="cover" lazy></el-image>
                    <div class="ml-2 text-sm">
                        <p>{{ item.gooods_item?.title || '商品已被删除' }}</p>
                        <p v-if="item.sku" class="mt-1">
                            <el-tag type="info" size="small">{{ item.sku }}</el-tag>
                        </p>
                        <p>
                            <b class="text-rose-500 mr-2">￥{{ item.price }}</b>
                            <span class="text-xs text-gray-500">{{ item.num }}</span>
                        </p>
                    </div>
                </div>
                <el-form label-width="120px">
                    <el-form-item label="成交价">
                        <span class="text-rose-500 font-bold">￥{{ info.total_price }}</span>
                    </el-form-item>
                </el-form>
            </el-card>
            <el-card v-if="info.address" shadow="never">
                <template #header>
                    <b class="text-sm">收货信息</b>
                </template>
                <el-form label-width="120px">
                    <el-form-item label="收货人"> {{ info.address.user }} </el-form-item>
                    <el-form-item label="联系方式"> {{ info.address.phone }} </el-form-item>
                    <el-form-item label="收货地址">
                        {{ info.address.province + info.address.city + info.address.districet + info.address.address }}
                    </el-form-item>
                </el-form>
            </el-card>
            <el-card v-if="info.refund_status !== 'pending'" shadow="never">
                <template #header>
                    <b class="text-sm">退款信息</b>
                    <el-button class="float-right" text disabled>{{ refund_status }}</el-button>
                </template>
                <el-form label-width="120px">
                    <el-form-item label="退款理由"> {{ info.extra.refund_reason }} </el-form-item>
                </el-form>
            </el-card>
        </el-drawer>
        <ShipInfoModal ref="shipInfoModalRef"></ShipInfoModal>
    </div>
</template>

<style scoped></style>
