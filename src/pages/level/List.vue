<script setup lang="ts">
import { computed, ref } from 'vue'
import {
    getLevelListApi,
    deleteLevelApi,
    LevelListResult,
    addLevelApi,
    editLevelApi,
    AddLevelForm,
    changeLevelStatusApi,
} from '@/api/level.ts'
import { ElNotification, FormRules } from 'element-plus'
import { isMobile } from '@/utils/tools.ts'
import FormDrawer from '@/components/FormDrawer.vue'
import { FormInstance } from 'element-plus/lib/components'
import ListHeader from '@/components/ListHeader.vue'
import { Status, Super } from '@/constant/enum.ts'

const currentPage = ref(1)

const total = ref(0)

const isLoading = ref(false)

const currentId = ref(0)

const drawerTitle = computed(() => (currentId.value ? '编辑' : '新增'))

const drawerRef = ref<InstanceType<typeof FormDrawer>>()

const form = ref<AddLevelForm>({
    name: '',
    status: Status.enable,
    level: 100,
    discount: 0,
    max_price: 0,
    max_times: 0,
})

const formRef = ref<FormInstance>()

const rules = ref<FormRules<AddLevelForm>>({
    name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
    status: [{ required: true, message: '请选择会员状态', trigger: 'blur' }],
    level: [{ required: true, message: '会员等级不能为空', trigger: 'blur' }],
    discount: [{ required: true, message: '折扣率不能为空', trigger: 'blur' }],
    max_price: [{ required: true, message: '累计消费金额不能为空', trigger: 'blur' }],
    max_times: [{ required: true, message: '累计消费不能为空', trigger: 'blur' }],
})

const tableData = ref<LevelListResult['list']>([])

const getLevelList = async (pageNum: number = 1) => {
    isLoading.value = true
    currentPage.value = pageNum
    const result = await getLevelListApi(currentPage.value).finally(() => (isLoading.value = false))
    tableData.value = result.data.list
    total.value = result.data.totalCount
}

const onDrawerConfirm = () => {
    formRef.value?.validate(async (valid) => {
        if (!valid) return
        drawerRef.value?.showLoading()

        if (currentId.value) {
            await editLevelApi(currentId.value, form.value).finally(() => drawerRef.value?.hideLoading())
        } else {
            await addLevelApi(form.value).finally(() => drawerRef.value?.hideLoading())
        }

        await getLevelList(1)

        ElNotification({
            type: 'success',
            message: drawerTitle.value + '成功',
            duration: 2000,
        })

        drawerRef.value?.close()
    })
}

const onDeleteClick = async (id: number) => {
    await deleteLevelApi(id)
    await getLevelList(currentPage.value)
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
    form.value.level = 100
    form.value.discount = 0
    form.value.max_price = 0
    form.value.max_times = 0
    drawerRef.value?.open()
}

const onEditClick = (row: LevelListResult['list'][0]) => {
    currentId.value = row.id
    formRef.value?.resetFields()
    form.value.name = row.name
    form.value.status = row.status
    form.value.level = row.level
    form.value.discount = row.discount
    form.value.max_price = row.max_price
    form.value.max_times = row.max_times
    drawerRef.value?.open()
}

const onStatusChange = async (status: Status, row: LevelListResult['list'][0] & { isLoading: boolean }) => {
    await changeLevelStatusApi(row.id, status)
    row.status = status
    ElNotification({
        type: 'success',
        message: '修改状态成功',
        duration: 2000,
    })
}

getLevelList(1)
</script>

<template>
    <div>
        <el-card shadow="hover" class="!border-0">
            <ListHeader @add="onAddClick" @refresh="getLevelList(1)"></ListHeader>
            <el-table v-loading="isLoading" :data="tableData" stripe>
                <el-table-column prop="name" label="会员等级"></el-table-column>
                <el-table-column v-if="!isMobile()" prop="discount" label="折扣率" align="center"></el-table-column>
                <el-table-column v-if="!isMobile()" prop="level" label="等级序号" align="center"></el-table-column>
                <el-table-column prop="status" label="状态" align="center">
                    <template #default="{ row }">
                        <el-switch
                            :loading="row.isLoading"
                            :model-value="row.status"
                            :active-value="Status.enable"
                            :inactive-value="Status.disable"
                            :disabled="row.super === Super.is"
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
                    @current-change="getLevelList"
                />
            </div>
        </el-card>
        <FormDrawer ref="drawerRef" :title="drawerTitle" @submit="onDrawerConfirm">
            <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="等级名称" prop="name">
                    <el-input v-model="form.name" placeholder="请输入等级名称"></el-input>
                </el-form-item>
                <el-form-item label="等级权重" prop="level">
                    <el-input v-model="form.level" type="number" placeholder="请输入等级权重"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-switch
                        v-model="form.status"
                        type="number"
                        :active-value="Status.enable"
                        :inactive-value="Status.disable"
                    ></el-switch>
                </el-form-item>
                <el-form-item label="升级条件">
                    <div>
                        <div>
                            <small class="text-xs mr-2">累计消费满</small>
                            <el-input v-model="form.max_price" type="number" placeholder="请输入累计消费">
                                <template #append> 元 </template>
                            </el-input>
                            <small class="text-gray-400 flex">设置会员等级所需要的累计消费必须大于等于0,单位:元</small>
                        </div>
                        <div>
                            <small class="text-xs mr-2">累计次数满</small>
                            <el-input v-model="form.max_times" type="number" placeholder="请输入累计次数">
                                <template #append> 次 </template>
                            </el-input>
                            <small class="text-gray-400 flex">设置会员等级所需要的购买量必须大于等于0,单位:笔</small>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label="折扣率(%)" prop="discount">
                    <el-input v-model="form.discount" type="number" placeholder="请输入折扣率">
                        <template #append> % </template>
                    </el-input>
                    <small class="text-gray-400 flex"
                        >折扣率单位为百分比,如输入90,表示该会员等级的用户可以以商品原价的90%购买</small
                    >
                </el-form-item>
            </el-form>
        </FormDrawer>
    </div>
</template>

<style scoped></style>
