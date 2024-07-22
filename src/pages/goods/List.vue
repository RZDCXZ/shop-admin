<script setup lang="ts">
import {
    addGoodsApi,
    AddGoodsForm,
    changeGoodsStatusApi,
    deleteGoodsApi,
    editGoodsApi,
    getGoodsListApi,
    GoodsListResult,
    checkGoodsApi,
    restoreGoodsApi,
    destroyGoodsApi,
} from '@/api/goods.ts'
import { CategoryListResult, getCategoryListApi } from '@/api/category.ts'
import ListHeader from '@/components/ListHeader.vue'
import { computed, ref } from 'vue'
import FormDrawer from '@/components/FormDrawer.vue'
import { isMobile } from '@/utils/tools.ts'
import { Status } from '@/constant/enum.ts'
import { ElNotification, FormRules } from 'element-plus'
import { FormInstance } from 'element-plus/lib/components'
import Search from '@/components/Search.vue'
import SearchItem from '@/components/SearchItem.vue'
import Banners from '@/pages/goods/Banners.vue'
import Content from '@/pages/goods/Content.vue'
import Skus from './Skus.vue'

const pageNum = ref(1)

const limit = ref(10)

const total = ref(0)

const isLoading = ref(false)

const currentId = ref(0)

const drawerRef = ref<InstanceType<typeof FormDrawer>>()

const drawerTitle = computed(() => (currentId.value ? '编辑' : '添加'))

const formRef = ref<FormInstance>()

const form = ref<AddGoodsForm>({
    title: '',
    category_id: null,
    cover: '',
    desc: '',
    unit: '',
    stock: 0,
    min_stock: 0,
    status: Status.enable,
    stock_display: 1,
    min_oprice: 0,
    min_price: 0,
})

const searchForm = ref({
    title: null,
    tab: 'all',
    category_id: null,
})

const rules: FormRules<AddGoodsForm> = {
    title: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
    category_id: [{ required: true, message: '请选择商品分类', trigger: 'blur' }],
    cover: [{ required: true, message: '请选择商封面', trigger: 'blur' }],
    desc: [{ required: true, message: '请输入商品描述', trigger: 'blur' }],
    unit: [{ required: true, message: '请输入商品单位', trigger: 'blur' }],
    stock: [{ required: true, message: '请输入商品总库存', trigger: 'blur' }],
    min_stock: [{ required: true, message: '请输入商品库存预警', trigger: 'blur' }],
    status: [{ required: true, message: '请选择商品状态', trigger: 'blur' }],
    stock_display: [{ required: true, message: '请输入商品库存显示', trigger: 'blur' }],
    min_price: [{ required: true, message: '请输入商品最低销售价', trigger: 'blur' }],
    min_oprice: [{ required: true, message: '请输入商品最低原价', trigger: 'blur' }],
}

const tableData = ref<GoodsListResult['list']>([])

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

    tableData.value = result.data.list
    total.value = result.data.totalCount
}

const onEditClick = (row: GoodsListResult['list'][0]) => {
    currentId.value = row.id

    formRef.value?.resetFields()
    form.value.title = row.title
    form.value.status = row.status
    form.value.category_id = row.category_id
    form.value.cover = row.cover
    form.value.desc = row.desc
    form.value.unit = row.unit
    form.value.stock = row.stock
    form.value.min_stock = row.min_stock
    form.value.stock_display = row.stock_display
    form.value.min_oprice = row.min_oprice
    form.value.min_price = row.min_price

    drawerRef.value?.open()
}

const onAddClick = () => {
    currentId.value = 0

    formRef.value?.resetFields()
    form.value.title = ''
    form.value.status = Status.enable
    form.value.category_id = null
    form.value.cover = ''
    form.value.desc = ''
    form.value.unit = ''
    form.value.stock = 0
    form.value.min_stock = 0
    form.value.stock_display = 0
    form.value.min_oprice = 0
    form.value.min_price = 0

    drawerRef.value?.open()
}

const onDeleteConfirm = async (id: number) => {
    await deleteGoodsApi([id])
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
            await editGoodsApi(currentId.value, form.value)
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
    searchForm.value.title = null
    searchForm.value.tab = 'all'
    searchForm.value.category_id = null
    getGoodsList()
}

const onStatusChange = async (status: Status) => {
    if (!selectedIds.value.length)
        return ElNotification({
            type: 'warning',
            message: '请先选择要操作的数据',
            duration: 2000,
        })
    await changeGoodsStatusApi(selectedIds.value, status)
    tableRef.value?.clearSelection()
    await getGoodsList()
    ElNotification({
        type: 'success',
        message: '修改状态成功',
        duration: 2000,
    })
}

const onCheckChange = async (id: number, ischeck: number) => {
    await checkGoodsApi(id, ischeck)
    await getGoodsList(pageNum.value)
    ElNotification({
        type: 'success',
        message: '操作成功',
        duration: 2000,
    })
}

const onRestoreGoodsClick = async () => {
    if (!selectedIds.value.length)
        return ElNotification({
            type: 'warning',
            message: '请先选择要删除的数据',
            duration: 2000,
        })
    isLoading.value = true
    await restoreGoodsApi(selectedIds.value).finally(() => (isLoading.value = false))
    if (selectedIds.value) {
        tableRef.value.clearSelection()
    }
    await getGoodsList(pageNum.value)
    ElNotification({
        type: 'success',
        message: '恢复成功',
        duration: 2000,
    })
}

const onDestroyGoodsClick = async () => {
    if (!selectedIds.value.length)
        return ElNotification({
            type: 'warning',
            message: '请先选择要删除的数据',
            duration: 2000,
        })
    isLoading.value = true
    await destroyGoodsApi(selectedIds.value).finally(() => (isLoading.value = false))
    if (selectedIds.value) {
        tableRef.value.clearSelection()
    }
    await getGoodsList(pageNum.value)
    ElNotification({
        type: 'success',
        message: '彻底删除成功',
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

const categoryList = ref<CategoryListResult>([])

const getCategoryList = async () => {
    const result = await getCategoryListApi()
    categoryList.value = result.data
}

const tableRef = ref()

const selectedIds = ref<number[]>([])

const onSelectionchange = (e: GoodsListResult['list']) => {
    selectedIds.value = e.map((o) => o.id)
}

const onDeleteAllClick = async () => {
    if (!selectedIds.value.length)
        return ElNotification({
            type: 'warning',
            message: '请先选择要删除的数据',
            duration: 2000,
        })
    await deleteGoodsApi(selectedIds.value)
    tableRef.value?.clearSelection()
    await getGoodsList()
    ElNotification({
        type: 'success',
        message: '批量删除成功',
        duration: 2000,
    })
}

const bannersRef = ref<InstanceType<typeof Banners>>()

const onSetGoodsBannersClick = (row: GoodsListResult['list'][0]) => {
    bannersRef.value?.open(row)
}

const contentRef = ref<InstanceType<typeof Content>>()

const onSetGoodsContentClick = (row: GoodsListResult['list'][0]) => {
    contentRef.value?.open(row)
}

const skusRef = ref<InstanceType<typeof Skus>>()

const onSetGoodsSkusClick = (row: GoodsListResult['list'][0]) => {
    skusRef.value?.open(row)
}

getCategoryList()
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
            <Search :model="searchForm" @search="getGoodsList(1)" @reset="onResetClick">
                <SearchItem label="关键词">
                    <el-input v-model="searchForm.title" clearable placeholder="请输入商品名称搜索"></el-input>
                </SearchItem>
                <template #show>
                    <SearchItem label="商品分类:">
                        <el-select
                            v-model="searchForm.category_id"
                            class="!w-38"
                            clearable
                            placeholder="请选择商品分类搜索"
                        >
                            <el-option
                                v-for="item in categoryList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                            ></el-option>
                        </el-select>
                    </SearchItem>
                </template>
            </Search>
            <ListHeader layout="add,refresh" @add="onAddClick" @refresh="getGoodsList(1)">
                <el-button
                    v-if="(searchForm.tab === 'all' || searchForm.tab === 'off') && !isMobile()"
                    size="small"
                    @click="onStatusChange(Status.enable)"
                    >上架</el-button
                >
                <el-button
                    v-if="(searchForm.tab === 'all' || searchForm.tab === 'saling') && !isMobile()"
                    size="small"
                    @click="onStatusChange(Status.disable)"
                    >下架</el-button
                >
                <el-button
                    v-if="searchForm.tab !== 'delete' && !isMobile()"
                    type="danger"
                    size="small"
                    @click="onDeleteAllClick"
                    >批量删除</el-button
                >
                <el-button
                    v-if="searchForm.tab === 'delete' && !isMobile()"
                    type="warning"
                    size="small"
                    @click="onRestoreGoodsClick"
                    >批量恢复</el-button
                >
                <el-button
                    v-if="searchForm.tab === 'delete' && !isMobile()"
                    type="danger"
                    size="small"
                    @click="onDestroyGoodsClick"
                    >彻底删除</el-button
                >
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
                <el-table-column v-if="!isMobile()" prop="status" label="商品状态" width="100">
                    <template #default="{ row }">
                        <el-tag :type="row.status ? 'success' : 'danger'" size="small">
                            {{ row.status ? '上架' : '仓库' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                    v-if="searchForm.tab !== 'delete' && !isMobile()"
                    prop="ischeck"
                    align="center"
                    label="审核状态"
                    width="120"
                >
                    <template #default="{ row }">
                        <div v-if="row.ischeck === 0" class="flex flex-col">
                            <el-button type="success" size="small" plain @click="onCheckChange(row.id, 1)"
                                >审核通过</el-button
                            >
                            <el-button
                                class="!ml-0 mt-2"
                                type="danger"
                                size="small"
                                plain
                                @click="onCheckChange(row.id, 2)"
                                >审核拒绝</el-button
                            >
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
                <el-table-column v-if="!isMobile()" label="操作" align="center">
                    <template #default="{ row }">
                        <div v-if="searchForm.tab !== 'delete'">
                            <el-button class="!px-1" type="primary" size="small" text @click="onEditClick(row)"
                                >编辑</el-button
                            >
                            <el-button
                                class="!px-1"
                                :type="
                                    (row.sku_type === 0 && !row.sku_value) ||
                                    (row.sku_type === 1 && !row.goods_skus.length)
                                        ? 'danger'
                                        : 'primary'
                                "
                                size="small"
                                text
                                @click="onSetGoodsSkusClick(row)"
                                >商品规格</el-button
                            >
                            <el-button
                                class="!px-1"
                                :type="row.goods_banner.length === 0 ? 'danger' : 'primary'"
                                size="small"
                                text
                                @click="onSetGoodsBannersClick(row)"
                                >设置轮播图</el-button
                            >
                            <el-button
                                class="!px-1"
                                :type="row.content ? 'primary' : 'danger'"
                                size="small"
                                text
                                @click="onSetGoodsContentClick(row)"
                                >商品详情</el-button
                            >
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
            <el-form ref="formRef" :model="form" :rules="rules" label-width="120">
                <el-form-item prop="title" label="商品名称">
                    <el-input v-model="form.title" placeholder="请输入商品名称,不能超过80个字符"></el-input>
                </el-form-item>
                <el-form-item prop="cover" label="封面">
                    <el-input v-model="form.cover" placeholder="请输入封面链接"></el-input>
                </el-form-item>
                <el-form-item prop="category_id" label="商品分类">
                    <el-select v-model="form.category_id" placeholder="选择商品分类">
                        <el-option
                            v-for="item in categoryList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="desc" label="商品描述">
                    <el-input v-model="form.desc" type="textarea" :rows="3" placeholder="请输入商品描述"></el-input>
                </el-form-item>
                <el-form-item prop="unit" label="单位">
                    <el-input v-model="form.unit" placeholder="请输入商品单位"></el-input>
                </el-form-item>
                <el-form-item prop="stock" label="总库存">
                    <el-input v-model="form.stock" class="!w-1/3" type="number">
                        <template #append>件</template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="min_stock" label="库存预警">
                    <el-input v-model="form.min_stock" class="!w-1/3" type="number">
                        <template #append>件</template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="min_price" label="最低销售价">
                    <el-input v-model="form.min_price" class="!w-1/3" type="number">
                        <template #append>元</template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="min_oprice" label="最低原价">
                    <el-input v-model="form.min_oprice" class="!w-1/3" type="number">
                        <template #append>元</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="库存显示" prop="stock_display">
                    <el-radio-group v-model="form.stock_display">
                        <el-radio :value="0">隐藏</el-radio>
                        <el-radio :value="1">显示</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="是否上架" prop="status">
                    <el-radio-group v-model="form.status">
                        <el-radio :value="0">放入放库</el-radio>
                        <el-radio :value="1">立即上架</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
        </FormDrawer>
        <Banners ref="bannersRef" @reload-data="getGoodsList(pageNum)"></Banners>
        <Content ref="contentRef" @reload-data="getGoodsList(pageNum)"></Content>
        <Skus ref="skusRef" @reload-data="getGoodsList(pageNum)"></Skus>
    </div>
</template>

<style scoped></style>
