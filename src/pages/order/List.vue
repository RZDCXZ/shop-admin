<script setup lang="ts">
import { getOrderListApi, OrderListResult, OrderSearchForm, refundOrderApi, deleteOrderAllApi } from '@/api/order.ts'
import ListHeader from '@/components/ListHeader.vue'
import { ref } from 'vue'
import { isMobile } from '@/utils/tools.ts'
import { ElNotification } from 'element-plus'
import Search from '@/components/Search.vue'
import SearchItem from '@/components/SearchItem.vue'
import ExportExcel from '@/pages/order/ExportExcel.vue'
import InfoModal from '@/pages/order/InfoModal.vue'
import { showPrompt, showModal } from '@/utils/tools.ts'

const pageNum = ref(1)

const limit = ref(10)

const total = ref(0)

const isLoading = ref(false)

const searchForm = ref<OrderSearchForm>({
    tab: 'all',
    no: null,
    starttime: null,
    endtime: null,
    name: null,
    phone: null,
})

const tableData = ref<OrderListResult['list']>([])

const getOrderList = async (p: number = 1) => {
    pageNum.value = p

    isLoading.value = true

    const result = await getOrderListApi(pageNum.value, searchForm.value).finally(() => (isLoading.value = false))

    tableData.value = result.data.list
    total.value = result.data.totalCount
}

const onResetClick = () => {
    searchForm.value.tab = 'all'
    searchForm.value.no = null
    searchForm.value.starttime = null
    searchForm.value.endtime = null
    searchForm.value.name = null
    searchForm.value.phone = null
    getOrderList()
}

const tabbars = ref([
    { key: 'all', name: '全部' },
    { key: 'nopay', name: '待支付' },
    { key: 'noship', name: '待发货' },
    { key: 'shiped', name: '待收货' },
    { key: 'received', name: '已收货' },
    { key: 'finish', name: '已完成' },
    { key: 'closed', name: '已关闭' },
    { key: 'refunding', name: '退款中' },
])

const tableRef = ref()

const selectedIds = ref<number[]>([])

const onSelectionchange = (e: OrderListResult['list']) => {
    selectedIds.value = e.map((o) => o.id)
}

const onDeleteAllClick = async () => {
    if (!selectedIds.value.length)
        return ElNotification({
            type: 'warning',
            message: '请先选择要删除的数据',
            duration: 2000,
        })
    await deleteOrderAllApi(selectedIds.value)
    tableRef.value?.clearSelection()
    await getOrderList()
    ElNotification({
        type: 'success',
        message: '批量删除成功',
        duration: 2000,
    })
}

const exportExcelRef = ref<InstanceType<typeof ExportExcel>>()

const onDownloadClick = () => {
    exportExcelRef.value?.open()
}

const infoModalRef = ref<InstanceType<typeof InfoModal>>()

const info = ref()

const openInfoModal = (row: OrderListResult['list'][0]) => {
    row.order_items = row.order_items.map((o) => {
        if (o.skus_type === 1 && o.goods_skus) {
            let s = []
            for (const k in o.goods_skus.skus) {
                s.push(o.goods_skus.skus[k].value)
            }
            o.sku = s.join(',')
        }
        return o
    })
    info.value = row
    infoModalRef.value?.open()
}

const onRefundClick = (id: number, agree: number) => {
    ;(agree ? showModal('是否要同意该订单退款?') : showPrompt('请输入拒绝的理由')).then(async ({ value }) => {
        let data = { agree }
        if (!agree) {
            data.disagree_reason = value
        }
        await refundOrderApi(id, data)
        await getOrderList()
        ElNotification({
            type: 'success',
            message: '操作成功',
            duration: 2000,
        })
    })
}

getOrderList()
</script>

<template>
    <div>
        <el-tabs v-model="searchForm.tab" @tab-change="getOrderList(1)">
            <el-tab-pane
                v-for="(item, index) in tabbars"
                :key="index"
                :label="item.name"
                :name="item.key"
            ></el-tab-pane>
        </el-tabs>
        <el-card shadow="hover" class="!border-0">
            <Search :model="searchForm" @search="getOrderList(1)" @reset="onResetClick">
                <SearchItem label="订单编号">
                    <el-input v-model="searchForm.no" clearable placeholder="请输入订单编号搜索"></el-input>
                </SearchItem>
                <template #show>
                    <SearchItem label="收货人">
                        <el-input v-model="searchForm.name" clearable placeholder="请输入收货人搜索"></el-input>
                    </SearchItem>
                    <SearchItem label="手机号">
                        <el-input v-model="searchForm.phone" clearable placeholder="请输入手机号搜索"></el-input>
                    </SearchItem>
                    <SearchItem label="开始时间">
                        <el-date-picker
                            v-model="searchForm.starttime"
                            type="date"
                            clearable
                            placeholder="请选择开始时间"
                            value-format="YYYY-MM-DD"
                        ></el-date-picker>
                    </SearchItem>
                    <SearchItem label="结束时间">
                        <el-date-picker
                            v-model="searchForm.endtime"
                            type="date"
                            clearable
                            placeholder="请选择结束时间"
                            value-format="YYYY-MM-DD"
                        ></el-date-picker>
                    </SearchItem>
                </template>
            </Search>
            <ListHeader layout="refresh,download" @download="onDownloadClick" @refresh="getOrderList(1)">
                <el-button v-if="!isMobile()" type="danger" size="small" @click="onDeleteAllClick">批量删除</el-button>
            </ListHeader>
            <el-table
                ref="tableRef"
                v-loading="isLoading"
                :data="tableData"
                stripe
                @selection-change="onSelectionchange"
            >
                <el-table-column v-if="!isMobile()" type="selection" width="55"></el-table-column>
                <el-table-column label="商品">
                    <template #default="{ row }">
                        <div>
                            <div v-if="!isMobile()" class="flex text-sm">
                                <div class="flex-1">
                                    <p>订单号:</p>
                                    <small>{{ row.no }}</small>
                                </div>
                                <div>
                                    <p>下单时间:</p>
                                    <small>{{ row.create_time }}</small>
                                </div>
                            </div>
                            <div v-for="(item, index) in row.order_items" :key="index" class="flex py-2">
                                <el-image
                                    :src="item.goods_item?.cover || ''"
                                    fit="cover"
                                    lazy
                                    class="!w-30px !h-30px"
                                ></el-image>
                                <p class="text-blue-500 ml-2">{{ item.goods_item?.title || '商品已被删除' }}</p>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    v-if="!isMobile()"
                    prop="total_price"
                    width="120"
                    align="center"
                    label="实际付款"
                ></el-table-column>
                <el-table-column v-if="!isMobile()" label="买家" width="120" align="center">
                    <template #default="{ row }">
                        <p>{{ row.user.nickname || row.user.username }}</p>
                        <small>(用户ID: {{ row.user.id }})</small>
                    </template>
                </el-table-column>
                <el-table-column v-if="!isMobile()" align="center" label="交易状态" width="170">
                    <template #default="{ row }">
                        <div>
                            付款状态:
                            <el-tag v-if="row.payment_method === 'wechat'" type="success" size="small">微信支付</el-tag>
                            <el-tag v-else-if="row.payment_method === 'alipay'" type="primary" size="small"
                                >支付宝支付</el-tag
                            >
                            <el-tag v-else type="info" size="small">未支付</el-tag>
                        </div>
                        <div>
                            发货状态:
                            <el-tag :type="row.ship_data ? 'success' : 'info'" size="small">{{
                                row.ship_data ? '已发货' : '未发货'
                            }}</el-tag>
                        </div>
                        <div>
                            收货状态:
                            <el-tag :type="row.ship_status === 'received' ? 'success' : 'info'" size="small">{{
                                row.ship_status === 'received' ? '已收货' : '未收货'
                            }}</el-tag>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template #default="{ row }">
                        <el-button type="primary" size="small" text @click="openInfoModal(row)">订单详情</el-button>
                        <el-button v-if="searchForm.tab === 'noship'" type="primary" size="small" text
                            >订单发货</el-button
                        >
                        <el-button
                            v-if="searchForm.tab === 'refunding'"
                            type="primary"
                            size="small"
                            text
                            @click="onRefundClick(row.id, 1)"
                            >同意退款</el-button
                        >
                        <el-button
                            v-if="searchForm.tab === 'refunding'"
                            type="primary"
                            size="small"
                            text
                            @click="onRefundClick(row.id, 0)"
                            >拒绝退款</el-button
                        >
                    </template>
                </el-table-column>
            </el-table>
            <div class="flex-center mt-5">
                <el-pagination
                    :small="isMobile()"
                    layout="prev,pager,next"
                    background
                    :total="total"
                    :current-page="pageNum"
                    :page-size="limit"
                    @current-change="getOrderList"
                />
            </div>
        </el-card>
        <ExportExcel ref="exportExcelRef" :tabs="tabbars"></ExportExcel>
        <InfoModal ref="infoModalRef" :info="info"></InfoModal>
    </div>
</template>

<style scoped></style>
