<script setup lang="ts">
import { computed, ref } from 'vue'
import {
    getSkusListApi,
    deleteSkusAllApi,
    SkusListResult,
    addSkusApi,
    editSkusApi,
    AddSkusForm,
    changeSkusStatusApi,
} from '@/api/skus.ts'
import { ElNotification, FormRules } from 'element-plus'
import { isMobile } from '@/utils/tools.ts'
import FormDrawer from '@/components/FormDrawer.vue'
import { FormInstance } from 'element-plus/lib/components'
import ListHeader from '@/components/ListHeader.vue'
import { Status } from '@/constant/enum.ts'
import TagInput from '@/components/TagInput.vue'

const currentPage = ref(1)

const total = ref(0)

const isLoading = ref(false)

const currentId = ref(0)

const drawerTitle = computed(() => (currentId.value ? '编辑' : '新增'))

const drawerRef = ref<InstanceType<typeof FormDrawer>>()

const form = ref<AddSkusForm>({
    name: '',
    status: Status.enable,
    default: '',
    order: 0,
})

const formRef = ref<FormInstance>()

const rules = ref<FormRules<AddSkusForm>>({
    name: [{ required: true, message: '规格名称不能为空', trigger: 'blur' }],
    status: [{ required: true, message: '请选择规格状态', trigger: 'blur' }],
    default: [{ required: true, message: '规格值不能为空', trigger: 'blur' }],
    order: [{ required: true, message: '排序不能为空', trigger: 'blur' }],
})

const tableData = ref<SkusListResult['list']>([])

const getSkusList = async (pageNum: number = 1) => {
    isLoading.value = true
    currentPage.value = pageNum
    const result = await getSkusListApi(currentPage.value).finally(() => (isLoading.value = false))
    tableData.value = result.data.list
    total.value = result.data.totalCount
}

const onDrawerConfirm = () => {
    formRef.value?.validate(async (valid) => {
        if (!valid) return
        drawerRef.value?.showLoading()

        if (currentId.value) {
            await editSkusApi(currentId.value, form.value).finally(() => drawerRef.value?.hideLoading())
        } else {
            await addSkusApi(form.value).finally(() => drawerRef.value?.hideLoading())
        }

        await getSkusList(1)

        ElNotification({
            type: 'success',
            message: drawerTitle.value + '成功',
            duration: 2000,
        })

        drawerRef.value?.close()
    })
}

const onDeleteClick = async (id: number) => {
    await deleteSkusAllApi([id])
    await getSkusList(currentPage.value)
    ElNotification({
        type: 'success',
        message: '删除成功',
        duration: 2000,
    })
}

const onAddClick = () => {
    formRef.value?.resetFields()
    currentId.value = 0
    form.value.name = ''
    form.value.status = Status.enable
    form.value.default = ''
    form.value.order = 0
    drawerRef.value?.open()
}

const onEditClick = (row: SkusListResult['list'][0]) => {
    currentId.value = row.id
    formRef.value?.resetFields()
    form.value.name = row.name
    form.value.status = row.status
    form.value.default = row.default
    form.value.order = row.order
    drawerRef.value?.open()
}

const tableRef = ref()

const onStatusChange = async (status: Status, row: SkusListResult['list'][0] & { isLoading: boolean }) => {
    await changeSkusStatusApi(row.id, status)
    row.status = status
    ElNotification({
        type: 'success',
        message: '修改状态成功',
        duration: 2000,
    })
}

const selectedIds = ref<number[]>([])

const onSelectionchange = (e: any) => {
    selectedIds.value = e.map((o: any) => o.id)
}

const onDeleteAllClick = async () => {
    if (!selectedIds.value.length)
        return ElNotification({
            type: 'warning',
            message: '请先选择要删除的数据',
            duration: 2000,
        })
    await deleteSkusAllApi(selectedIds.value)
    tableRef.value?.clearSelection()
    await getSkusList()
    ElNotification({
        type: 'success',
        message: '批量删除成功',
        duration: 2000,
    })
}

getSkusList(1)
</script>

<template>
    <div>
        <el-card shadow="hover" class="!border-0">
            <ListHeader
                layout="add,delete,refresh"
                @delete="onDeleteAllClick"
                @add="onAddClick"
                @refresh="getSkusList(1)"
            ></ListHeader>
            <el-table
                ref="tableRef"
                v-loading="isLoading"
                :data="tableData"
                stripe
                @selection-change="onSelectionchange"
            >
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="name" label="规格名称"></el-table-column>
                <el-table-column v-if="!isMobile()" prop="default" label="规格值"></el-table-column>
                <el-table-column v-if="!isMobile()" prop="order" label="排序"></el-table-column>
                <el-table-column v-if="!isMobile()" prop="status" label="状态">
                    <template #default="{ row }">
                        <el-switch
                            :loading="row.isLoading"
                            :model-value="row.status"
                            :active-value="Status.enable"
                            :inactive-value="Status.disable"
                            @change="onStatusChange($event, row)"
                        ></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template #default="{ row }">
                        <el-button type="primary" size="small" text @click="onEditClick(row)">编辑</el-button>
                        <el-popconfirm
                            title="确定删除吗?"
                            confirm-button-text="确定"
                            cancel-button-text="取消"
                            @confirm="onDeleteClick(row.id)"
                        >
                            <template #reference>
                                <el-button type="danger" size="small" text>删除</el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
            <div class="flex-center mt-5">
                <el-pagination
                    :small="isMobile()"
                    layout="prev,pager,next"
                    background
                    :total="total"
                    :current-page="currentPage"
                    :page-size="10"
                    @current-change="getSkusList"
                />
            </div>
        </el-card>
        <FormDrawer ref="drawerRef" :destroy-on-close="true" :title="drawerTitle" @submit="onDrawerConfirm">
            <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="规格名称" prop="name">
                    <el-input v-model="form.name" placeholder="请输入规格名称"></el-input>
                </el-form-item>
                <el-form-item label="规格状态" prop="status">
                    <el-switch
                        v-model="form.status"
                        :active-value="Status.enable"
                        :inactive-value="Status.disable"
                    ></el-switch>
                </el-form-item>
                <el-form-item label="规格值" prop="default">
                    <TagInput v-model="form.default"></TagInput>
                </el-form-item>
                <el-form-item label="排序" prop="order">
                    <el-input-number
                        v-model="form.order"
                        :min="0"
                        :max="1000"
                        placeholder="请选择排序"
                    ></el-input-number>
                </el-form-item>
            </el-form>
        </FormDrawer>
    </div>
</template>

<style scoped></style>
