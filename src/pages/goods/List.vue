<script setup lang="ts">
import {
    addGoodsApi,
    AddGoodsForm,
    changeGoodsStatusApi,
    deleteGoodsApi,
    editGoodsApi,
    getGoodsListApi,
    GoodsListResult,
} from '@/api/goods.ts'
import ListHeader from '@/components/ListHeader.vue'
import { computed, ref } from 'vue'
import FormDrawer from '@/components/FormDrawer.vue'
import { isMobile } from '@/utils/tools.ts'
import { Status, Super } from '@/constant/enum.ts'
import { ElNotification, FormRules } from 'element-plus'
import { FormInstance } from 'element-plus/lib/components'
import ChoiceImage from '@/components/ChoiceImage.vue'

const pageNum = ref(1)

const limit = ref(10)

const total = ref(0)

const isLoading = ref(false)

const currentId = ref(0)

const drawerRef = ref<InstanceType<typeof FormDrawer>>()

const drawerTitle = computed(() => (currentId.value ? '编辑' : '添加'))

const formRef = ref<FormInstance>()

const form = ref<AddGoodsForm>({
    username: '',
    password: '',
    status: Status.disable,
    role_id: null,
    avatar: '',
})

const searchForm = ref({
    title: null,
    tab: 'all',
    category_id: null,
})

const rules: FormRules<AddGoodsForm> = {
    username: [{ required: true, message: '请输入管理员名称', trigger: 'blur' }],
    password: [{ required: true, message: '请输入登录密码', trigger: 'blur' }],
    status: [{ required: true, message: '请选择管理员状态', trigger: 'blur' }],
    role_id: [{ required: true, message: '请选择管理员角色', trigger: 'blur' }],
}

const tableData = ref<GoodsListResult['list']>([])

const roles = ref<GoodsListResult['roles']>([])

const getGoodsList = async (p: number = 1) => {
    pageNum.value = p

    isLoading.value = true

    const result = await getGoodsListApi(
        pageNum.value,
        limit.value,
        searchForm.value.tab,
        searchForm.value.title,
        searchForm.value.category_id,
    ).finally(() => (isLoading.value = false))

    tableData.value = result.data.list.map((item: any) => {
        item.isLoading = false

        return item
    })
    total.value = result.data.totalCount
    roles.value = result.data.roles
}

const onEditClick = (row: GoodsListResult['list'][0]) => {
    currentId.value = row.id

    formRef.value?.resetFields()
    form.value.username = row.username
    form.value.status = row.status
    form.value.avatar = row.avatar
    form.value.role_id = row.role_id

    drawerRef.value?.open()
}

const onAddClick = () => {
    currentId.value = 0

    formRef.value?.resetFields()
    form.value.username = ''
    form.value.status = Status.disable
    form.value.avatar = ''
    form.value.role_id = null

    drawerRef.value?.open()
}

const onDeleteConfirm = async (id: number) => {
    await deleteGoodsApi(id)
    await getGoodsList()
    ElNotification({
        type: 'success',
        message: '删除成功',
        duration: 2000,
    })
}

const onDrawerConfirm = () => {
    formRef.value?.validate(async (valid) => {
        if (!valid) return
        if (currentId.value) {
            await editGoodsApi({
                ...form.value,
                id: currentId.value,
            })
        } else {
            await addGoodsApi(form.value)
        }
        await getGoodsList(pageNum.value)
        drawerRef.value?.close()
        ElNotification({
            type: 'success',
            message: drawerTitle.value + '成功',
            duration: 2000,
        })
    })
}

const onResetClick = () => {
    searchForm.value.keyword = ''
    getGoodsList()
}

const onStatusChange = async (status: Status, row: GoodsListResult['list'][0] & { isLoading: boolean }) => {
    row.isLoading = true
    await changeGoodsStatusApi(row.id, status).finally(() => (row.isLoading = false))
    row.status = status
    ElNotification({
        type: 'success',
        message: '修改状态成功',
        duration: 2000,
    })
}

const tabbars = ref([
    { key: 'all', name: '全部' },
    { key: 'checking', name: '审核中' },
    { key: 'saling', name: '出售中' },
    { key: 'off', name: '已下架' },
    { key: 'min_stock', name: '库存预警' },
    { key: 'delete', name: '回收站' },
])

getGoodsList()
</script>

<template>
    <div>
        <el-tabs v-model="searchForm.tab" @tab-change="getGoodsList(1)">
            <el-tab-pane
                v-for="(item, index) in tabbars"
                :key="index"
                :label="item.name"
                :name="item.key"
            ></el-tab-pane>
        </el-tabs>
        <el-card shadow="hover" class="!border-0">
            <el-form :model="searchForm" class="mb-3 md:flex" size="small" inline>
                <el-form-item prop="title" label="关键词:">
                    <el-input v-model="searchForm.title" clearable placeholder="请输入商品名称搜索"></el-input>
                </el-form-item>
                <el-form-item class="ml-auto">
                    <el-button type="primary" @click="getGoodsList(1)">搜索</el-button>
                    <el-button @click="onResetClick">重置</el-button>
                </el-form-item>
            </el-form>
            <ListHeader @add="onAddClick" @refresh="getGoodsList(1)"></ListHeader>
            <el-table v-loading="isLoading" :data="tableData" stripe>
                <el-table-column label="商品">
                    <template #default="{ row }">
                        <div class="flex">
                            <el-image
                                :src="row.cover"
                                fit="cover"
                                :lazy="true"
                                class="w-50px h-50px mr-3 rounded"
                            ></el-image>
                            <div class="flex-1">
                                <p>{{ row.title }}</p>
                                <div>
                                    <span class="text-rose-500">￥{{ row.min_price }}</span>
                                    <el-divider direction="vertical"></el-divider>
                                    <span class="text-gray-500 text-xs">￥{{ row.min_oprice }}</span>
                                </div>
                                <p class="text-gray-400 text-xs mb-1">分类:{{ row.category?.name || '未分类' }}</p>
                                <p class="text-gray-400 text-xs">创建时间:{{ row.create_time }}</p>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    v-if="!isMobile()"
                    prop="sale_count"
                    width="100"
                    align="center"
                    label="实际销量"
                ></el-table-column>
                <el-table-column prop="status" label="商品状态" width="100">
                    <template #default="{ row }">
                        <el-tag :type="row.status ? 'success' : 'danger'" size="small">
                            {{ row.status ? '上架' : '仓库' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                    v-if="searchForm.tab !== 'delete'"
                    prop="ischeck"
                    align="center"
                    label="审核状态"
                    width="120"
                >
                    <template #default="{ row }">
                        <div v-if="row.ischeck === 0" class="flex flex-col">
                            <el-button type="success" size="small" plain>审核通过</el-button>
                            <el-button class="!ml-0 mt-2" type="danger" size="small" plain>审核拒绝</el-button>
                        </div>
                        <span v-else>{{ row.ischeck === 1 ? '通过' : '拒绝' }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    v-if="!isMobile()"
                    prop="stock"
                    label="总库存"
                    align="center"
                    width="100"
                ></el-table-column>
                <el-table-column label="操作" align="center">
                    <template #default="{ row }">
                        <div v-if="searchForm.tab !== 'delete'">
                            <el-button class="!px-1" type="primary" size="small" text @click="onEditClick(row)"
                                >编辑</el-button
                            >
                            <el-button class="!px-1" type="primary" size="small" text>商品规格</el-button>
                            <el-button class="!px-1" type="primary" size="small" text>设置轮播图</el-button>
                            <el-button class="!px-1" type="primary" size="small" text>商品详情</el-button>
                            <el-popconfirm
                                title="确定删除吗?"
                                confirm-button-text="确定"
                                cancel-button-text="取消"
                                @confirm="onDeleteConfirm(row.id)"
                            >
                                <template #reference>
                                    <el-button class="!px-1" type="danger" size="small" text>删除</el-button>
                                </template>
                            </el-popconfirm>
                        </div>
                        <span v-else>暂无操作</span>
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
                    @current-change="getGoodsList"
                />
            </div>
        </el-card>
        <FormDrawer ref="drawerRef" :title="drawerTitle" @submit="onDrawerConfirm">
            <el-form ref="formRef" :model="form" :rules="rules">
                <el-form-item prop="username" label="管理员名称">
                    <el-input v-model="form.username" placeholder="请输入管理员名称"></el-input>
                </el-form-item>
                <el-form-item prop="password" label="密码">
                    <el-input v-model="form.password" placeholder="请输入密码"></el-input>
                </el-form-item>
                <el-form-item prop="avatar" label="头像">
                    <ChoiceImage v-model="form.avatar"></ChoiceImage>
                </el-form-item>
                <el-form-item prop="role_id" label="所属角色">
                    <el-select v-model="form.role_id" placeholder="选择所属角色">
                        <el-option v-for="item in roles" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="status" label="状态">
                    <el-switch
                        v-model="form.status"
                        :active-value="Status.enable"
                        :inactive-value="Status.disable"
                        placeholder="请输入密码"
                    ></el-switch>
                </el-form-item>
            </el-form>
        </FormDrawer>
    </div>
</template>

<style scoped></style>
