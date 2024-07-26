<script setup lang="ts">
import Panel from './Panel.vue'
import { isMobile } from '@/utils/tools.ts'
import { ref } from 'vue'
import { DistributionAgentForm, DistributionAgentResult, getDistributionAgentApi } from '@/api/distribution.ts'
import SearchItem from '@/components/SearchItem.vue'
import Search from '@/components/Search.vue'
import DataDrawer from '@/pages/distribution/DataDrawer.vue'

const pageNum = ref(1)

const limit = ref(10)

const total = ref(0)

const isLoading = ref(false)

const searchForm = ref<DistributionAgentForm>({
    keyword: null,
    type: 'all',
    starttime: null,
    endtime: null,
})

const tableData = ref<DistributionAgentResult['list']>([])

const getDistributionList = async (p: number = 1) => {
    pageNum.value = p

    isLoading.value = true

    const result = await getDistributionAgentApi(pageNum.value, searchForm.value).finally(
        () => (isLoading.value = false),
    )

    tableData.value = result.data.list
    total.value = result.data.totalCount
}

const onResetClick = () => {
    searchForm.value.keyword = null
    searchForm.value.type = 'all'
    searchForm.value.starttime = null
    searchForm.value.endtime = null
    getDistributionList()
}

const dataDrawerRef = ref<InstanceType<typeof DataDrawer>>()

const orderDataDrawerRef = ref<InstanceType<typeof DataDrawer>>()

const openDataDrawer = (id: number, type: string) => {
    ;(type === 'user' ? dataDrawerRef : orderDataDrawerRef).value?.open(id)
}

getDistributionList()
</script>

<template>
    <div>
        <Panel></Panel>
        <el-card shadow="never" class="!border-0">
            <Search :model="searchForm" @search="getDistributionList(1)" @reset="onResetClick">
                <SearchItem label="时间选择">
                    <el-radio-group v-model="searchForm.type">
                        <el-radio-button label="all">全部</el-radio-button>
                        <el-radio-button label="today">今天</el-radio-button>
                        <el-radio-button label="yesterday">昨天</el-radio-button>
                        <el-radio-button label="last7days">最近7天</el-radio-button>
                    </el-radio-group>
                </SearchItem>
                <template #show>
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
                    <SearchItem label="关键词">
                        <el-input v-model="searchForm.keyword" placeholder="关键词" clearable></el-input>
                    </SearchItem>
                </template>
            </Search>
            <el-table v-loading="isLoading" :data="tableData" stripe>
                <el-table-column label="ID" prop="id" align="center"></el-table-column>
                <el-table-column label="头像">
                    <template #default="{ row }">
                        <el-avatar :size="40" :src="row.avatar"></el-avatar>
                    </template>
                </el-table-column>
                <el-table-column v-if="!isMobile()" label="用户信息">
                    <template #default="{ row }">
                        <div class="text-xs">
                            <p>用户: {{ row.username }}</p>
                            <p>昵称: {{ row.nickname }}</p>
                            <p>姓名: {{ row.user_info.username }}</p>
                            <p>电话: {{ row.phone }}</p>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="share_num" label="推广用户数量" align="center"></el-table-column>
                <el-table-column prop="share_order_num" label="订单数量" align="center"></el-table-column>
                <el-table-column prop="order_price" label="订单金额" align="center"></el-table-column>
                <el-table-column prop="commission" label="账户佣金" align="center"></el-table-column>
                <el-table-column prop="cash_out_price" label="已提现金额" align="center"></el-table-column>
                <el-table-column prop="cash_out_time" label="提现次数" align="center"></el-table-column>
                <el-table-column prop="no_cash_out_price" label="未提现金额" align="center"></el-table-column>
                <el-table-column label="操作" align="center">
                    <template #default="{ row }">
                        <el-button type="primary" text size="small" @click="openDataDrawer(row.id, 'user')"
                            >推广人</el-button
                        >
                        <el-button type="primary" text size="small" @click="openDataDrawer(row.id, 'order')"
                            >推广订单</el-button
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
                    @current-change="getDistributionList"
                />
            </div>
        </el-card>
        <DataDrawer ref="dataDrawerRef"></DataDrawer>
        <DataDrawer ref="orderDataDrawerRef" type="order"></DataDrawer>
    </div>
</template>

<style scoped></style>
