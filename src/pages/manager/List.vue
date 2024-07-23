<script setup lang="ts">
import {
    addManagerApi,
    AddManagerForm,
    changeManagerStatusApi,
    deleteManagerApi,
    editManagerApi,
    getManagerListApi,
    ManagerListResult,
} from '@/api/manager.ts'
import ListHeader from '@/components/ListHeader.vue'
import { computed, ref } from 'vue'
import FormDrawer from '@/components/FormDrawer.vue'
import { isMobile } from '@/utils/tools.ts'
import { Status, Super } from '@/constant/enum.ts'
import { ElNotification, FormRules } from 'element-plus'
import { FormInstance } from 'element-plus/lib/components'
import ChoiceImage from '@/components/ChoiceImage.vue'
import Search from '@/components/Search.vue'
import SearchItem from '@/components/SearchItem.vue'

const pageNum = ref(1)

const limit = ref(10)

const total = ref(0)

const isLoading = ref(false)

const currentId = ref(0)

const drawerRef = ref<InstanceType<typeof FormDrawer>>()

const drawerTitle = computed(() => (currentId.value ? '编辑' : '添加'))

const formRef = ref<FormInstance>()

const form = ref<AddManagerForm>({
    username: '',
    password: '',
    status: Status.disable,
    role_id: null,
    avatar: '',
})

const searchForm = ref({
    keyword: '',
})

const rules: FormRules<AddManagerForm> = {
    username: [{ required: true, message: '请输入管理员名称', trigger: 'blur' }],
    password: [{ required: true, message: '请输入登录密码', trigger: 'blur' }],
    status: [{ required: true, message: '请选择管理员状态', trigger: 'blur' }],
    role_id: [{ required: true, message: '请选择管理员角色', trigger: 'blur' }],
}

const tableData = ref<ManagerListResult['list']>([])

const roles = ref<ManagerListResult['roles']>([])

const getManagerList = async (p: number = 1) => {
    pageNum.value = p

    isLoading.value = true

    const result = await getManagerListApi(pageNum.value, limit.value, searchForm.value.keyword).finally(
        () => (isLoading.value = false),
    )

    tableData.value = result.data.list.map((item: any) => {
        item.isLoading = false

        return item
    })
    total.value = result.data.totalCount
    roles.value = result.data.roles
}

const onEditClick = (row: ManagerListResult['list'][0]) => {
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
    await deleteManagerApi(id)
    await getManagerList()
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
            await editManagerApi({
                ...form.value,
                id: currentId.value,
            })
        } else {
            await addManagerApi(form.value)
        }
        await getManagerList(pageNum.value)
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
    getManagerList()
}

const onStatusChange = async (status: Status, row: ManagerListResult['list'][0] & { isLoading: boolean }) => {
    row.isLoading = true
    await changeManagerStatusApi(row.id, status).finally(() => (row.isLoading = false))
    row.status = status
    ElNotification({
        type: 'success',
        message: '修改状态成功',
        duration: 2000,
    })
}

getManagerList()
</script>

<template>
    <div>
        <el-card shadow="hover" class="!border-0">
            <Search :model="searchForm" @search="getManagerList(1)" @reset="onResetClick">
                <SearchItem label="关键词">
                    <el-input v-model="searchForm.keyword" clearable placeholder="请输入关键词搜索"></el-input>
                </SearchItem>
            </Search>
            <ListHeader @add="onAddClick" @refresh="getManagerList(1)"></ListHeader>
            <el-table v-loading="isLoading" :data="tableData" stripe>
                <el-table-column label="管理员">
                    <template #default="{ row }">
                        <div class="flex items-center">
                            <el-avatar v-if="!isMobile()" :size="40" :src="row.avatar"></el-avatar>
                            <div class="ml-3">
                                <h6>{{ row.username }}</h6>
                                <small>ID:{{ row.id }}</small>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column v-if="!isMobile()" prop="create_time" label="发布时间"></el-table-column>
                <el-table-column v-if="!isMobile()" label="所属角色" align="center">
                    <template #default="{ row }">
                        {{ row.role?.name || '-' }}
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="状态">
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
                        <small v-if="row.super === Super.is" class="text-sm text-gray-500">暂无操作</small>
                        <div v-else>
                            <el-button type="primary" size="small" text @click="onEditClick(row)">编辑</el-button>
                            <el-popconfirm
                                title="确定删除吗?"
                                confirm-button-text="确定"
                                cancel-button-text="取消"
                                @confirm="onDeleteConfirm(row.id)"
                            >
                                <template #reference>
                                    <el-button type="danger" size="small" text>删除</el-button>
                                </template>
                            </el-popconfirm>
                        </div>
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
                    @current-change="getManagerList"
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
