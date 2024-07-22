<script setup lang="ts">
import ListHeader from '@/components/ListHeader.vue'
import {
    getCategoryListApi,
    addCategoryApi,
    editCategoryApi,
    deleteCategoryApi,
    deleteCategoryItemApi,
    addCategoryItemApi,
    changeCategoryStatusApi,
    getCategoryItemListApi,
    CategoryListResult,
} from '@/api/category.ts'
import { computed, ref } from 'vue'
import { Status } from '@/constant/enum.ts'
import FormDrawer from '@/components/FormDrawer.vue'
import { ElNotification } from 'element-plus'
import { FormInstance } from 'element-plus/lib/components'
import { isMobile } from '@/utils/tools.ts'
import GoodsDrawer from '@/pages/category/components/GoodsDrawer.vue'

const isLoading = ref(false)

const drawerRef = ref<InstanceType<typeof FormDrawer>>()

const formRef = ref<FormInstance>()

const currentId = ref(0)

const drawerTitle = computed(() => (currentId.value ? '编辑' : '新增'))

const form = ref({
    name: '',
})

const rules = ref({
    name: [{ required: true, message: '分类名称不能为空', trigger: 'blur' }],
})

const tableData = ref<CategoryListResult>([])

const getCategoryList = async () => {
    isLoading.value = true
    const result = await getCategoryListApi().finally(() => (isLoading.value = false))
    tableData.value = result.data
}

const onAddClick = () => {
    formRef.value?.resetFields()
    currentId.value = 0
    form.value.name = ''
    drawerRef.value?.open()
}

const onEditClick = (row: CategoryListResult[0]) => {
    formRef.value?.resetFields()
    currentId.value = row.id
    form.value.name = row.name
    drawerRef.value?.open()
}

const onDeleteClick = async (id: number) => {
    await deleteCategoryApi(id)
    await getCategoryList()
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
            await editCategoryApi(currentId.value, form.value.name)
        } else {
            await addCategoryApi(form.value.name)
        }
        await getCategoryList()
        drawerRef.value?.close()
        ElNotification({
            type: 'success',
            message: drawerTitle.value + '成功',
            duration: 2000,
        })
    })
}

const onStatusChange = async (status: Status, row: CategoryListResult[0]) => {
    await changeCategoryStatusApi(row.id, status)
    row.status = status
    ElNotification({
        type: 'success',
        message: '修改状态成功',
        duration: 2000,
    })
}

const goodsDrawerRef = ref<InstanceType<typeof GoodsDrawer>>()

const openGoodsDrawer = (data: CategoryListResult[0]) => {
    goodsDrawerRef.value?.open(data.id)
}

getCategoryList()
</script>

<template>
    <div>
        <el-card shadow="never" class="!border-0">
            <ListHeader @refresh="getCategoryList" @add="onAddClick"></ListHeader>
            <el-tree
                v-loading="isLoading"
                node-key="id"
                :data="tableData"
                :props="{ label: 'name', children: 'child' }"
            >
                <template #default="{ data }">
                    <div class="flex flex-1 items-center text-14px">
                        <span>{{ data.name }}</span>
                        <div class="ml-auto" @click.stop="() => {}">
                            <el-button
                                v-if="!isMobile()"
                                text
                                type="success"
                                size="small"
                                @click="openGoodsDrawer(data)"
                                >推荐商品</el-button
                            >
                            <el-switch
                                :model-value="data.status"
                                :active-value="Status.enable"
                                :inactive-value="Status.disable"
                                @change="onStatusChange($event, data)"
                            ></el-switch>
                            <el-button v-if="!isMobile()" text type="primary" size="small" @click="onEditClick(data)"
                                >修改</el-button
                            >
                            <el-popconfirm
                                title="确定删除吗?"
                                confirm-button-text="确定"
                                cancel-button-text="取消"
                                @confirm="onDeleteClick(data.id)"
                            >
                                <template #reference>
                                    <el-button type="danger" size="small" text>删除</el-button>
                                </template>
                            </el-popconfirm>
                        </div>
                    </div>
                </template>
            </el-tree>
        </el-card>
        <FormDrawer ref="drawerRef" :title="drawerTitle" @submit="onDrawerConfirm">
            <el-form ref="formRef" :model="form" :rules="rules">
                <el-form-item label="分类名称" prop="name">
                    <el-input v-model="form.name" placeholder="请输入名称"></el-input>
                </el-form-item>
            </el-form>
        </FormDrawer>
        <GoodsDrawer ref="goodsDrawerRef"></GoodsDrawer>
    </div>
</template>

<style scoped></style>
