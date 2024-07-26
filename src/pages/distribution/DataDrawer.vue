<script setup lang="ts">
import { computed, ref } from 'vue'
import { isMobile } from '@/utils/tools.ts'
import {
    DistributionAgentForm,
    DistributionAgentResult,
    getDistributionListApi,
    getDistributionAgentApi,
    DistributionListResult,
} from '@/api/distribution.ts'

const props = withDefaults(
    defineProps<{
        type: string
    }>(),
    {
        type: 'user',
    },
)

const drawerTitle = computed(() => (props.type === 'user' ? '推广人列表' : '推广订单列表'))

const pageNum = ref(1)

const limit = ref(10)

const total = ref(0)

const isLoading = ref(false)

const searchForm = ref<DistributionAgentForm>({
    type: 'all',
    starttime: null,
    endtime: null,
    level: 0,
    user_id: 0,
})

const tableData = ref<DistributionAgentResult['list'] | DistributionListResult['list']>([])

const getDistributionList = async (p: number = 1) => {
    pageNum.value = p

    isLoading.value = true

    if (props.type === 'user') {
        const result = await getDistributionAgentApi(pageNum.value, searchForm.value).finally(
            () => (isLoading.value = false),
        )

        tableData.value = result.data.list
        total.value = result.data.totalCount
    } else {
        const result = await getDistributionListApi(pageNum.value, {
            type: searchForm.value.type,
            starttime: searchForm.value.starttime,
            endtime: searchForm.value.endtime,
        }).finally(() => (isLoading.value = false))
        tableData.value = result.data.list
        total.value = result.data.totalCount
    }
}

const onResetClick = () => {
    searchForm.value.type = 'all'
    searchForm.value.starttime = null
    searchForm.value.endtime = null
    searchForm.value.level = 0
    getDistributionList(1)
}

const dialogVisible = ref(false)

const open = async (id: number) => {
    searchForm.value.user_id = id
    await getDistributionList(1)
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
        <el-drawer v-model="dialogVisible" :title="drawerTitle" :size="isMobile() ? '80%' : '45%'">
            <el-card shadow="never" class="!border-0">
                <el-form :model="searchForm">
                    <el-form-item label="时间选择">
                        <el-radio-group v-model="searchForm.type">
                            <el-radio-button label="all">全部</el-radio-button>
                            <el-radio-button label="today">今天</el-radio-button>
                            <el-radio-button label="yesterday">昨天</el-radio-button>
                            <el-radio-button label="last7days">最近7天</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="开始时间">
                        <el-date-picker
                            v-model="searchForm.starttime"
                            type="date"
                            clearable
                            placeholder="请选择开始时间"
                            value-format="YYYY-MM-DD"
                        ></el-date-picker>
                    </el-form-item>
                    <el-form-item label="结束时间">
                        <el-date-picker
                            v-model="searchForm.endtime"
                            type="date"
                            clearable
                            placeholder="请选择结束时间"
                            value-format="YYYY-MM-DD"
                        ></el-date-picker>
                    </el-form-item>
                    <el-form-item label="用户类型">
                        <el-radio-group v-model="searchForm.level">
                            <el-radio-button :label="0">全部</el-radio-button>
                            <el-radio-button :label="1">一级推广</el-radio-button>
                            <el-radio-button :label="2">二级推广</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="getDistributionList(1)">搜索</el-button>
                        <el-button @click="onResetClick">重置</el-button>
                    </el-form-item>
                </el-form>
                <el-table v-loading="isLoading" :data="tableData" stripe>
                    <template v-if="type === 'user'">
                        <el-table-column label="ID" prop="id" align="center"></el-table-column>
                        <el-table-column label="头像">
                            <template #default="{ row }">
                                <el-avatar :size="40" :src="row.avatar"></el-avatar>
                            </template>
                        </el-table-column>
                        <el-table-column v-if="!isMobile()" prop="username" label="用户信息"></el-table-column>
                        <el-table-column prop="share_num" label="推广用户数量" align="center"></el-table-column>
                        <el-table-column prop="share_order_num" label="推广订单数量" align="center"></el-table-column>
                        <el-table-column prop="create_time" label="绑定时间" align="center"></el-table-column>
                    </template>
                    <template v-else>
                        <el-table-column label="订单号">
                            <template #default="{ row }">
                                {{ row.order.no }}
                            </template>
                        </el-table-column>
                        <el-table-column label="用户名|昵称|手机">
                            <template #default="{ row }">
                                <div v-if="!row.order.user">该用户已删除</div>
                                <div v-else>
                                    {{ row.order.user.username }}|{{ row.order.user.nickname }}|{{
                                        row.order.user.phone
                                    }}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="时间" prop="create_time"></el-table-column>
                        <el-table-column label="返佣金额" prop="commission"></el-table-column>
                    </template>
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
        </el-drawer>
    </div>
</template>

<style scoped></style>
