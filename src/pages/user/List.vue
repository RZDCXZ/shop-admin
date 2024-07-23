<script setup lang="ts">
import {
    addUserApi,
    AddUserForm,
    changeUserStatusApi,
    deleteUserApi,
    editUserApi,
    getUserListApi,
    UserListResult,
} from '@/api/users.ts'
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

const form = ref<AddUserForm>({
    username: '',
    password: '',
    status: Status.enable,
    avatar: '',
    nickname: '',
    phone: '',
    email: '',
    user_level_id: null,
})

const searchForm = ref({
    keyword: '',
    user_level_id: null,
})

const user_level = ref<UserListResult['user_level']>([])

const rules: FormRules<AddUserForm> = {
    username: [{ required: true, message: '请输入用户名称', trigger: 'blur' }],
    password: [{ required: true, message: '请输入登录密码', trigger: 'blur' }],
    status: [{ required: true, message: '请选择用户状态', trigger: 'blur' }],
    nickname: [{ required: true, message: '请输入用户昵称', trigger: 'blur' }],
    phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
    email: [{ required: true, message: '请输入邮箱地址', trigger: 'blur' }],
    avatar: [{ required: true, message: '请输入用户头像', trigger: 'blur' }],
    user_level_id: [{ required: true, message: '请选择会员等级', trigger: 'blur' }],
}

const tableData = ref<UserListResult['list']>([])

const getUserList = async (p: number = 1) => {
    pageNum.value = p

    isLoading.value = true

    const result = await getUserListApi(pageNum.value, {
        limit: limit.value,
        keyword: searchForm.value.keyword,
        user_level_id: searchForm.value.user_level_id,
    }).finally(() => (isLoading.value = false))

    tableData.value = result.data.list.map((item: any) => {
        item.isLoading = false

        return item
    })
    user_level.value = result.data.user_level
    total.value = result.data.totalCount
}

const onEditClick = (row: UserListResult['list'][0]) => {
    currentId.value = row.id

    formRef.value?.resetFields()
    form.value.username = row.username
    form.value.status = row.status
    form.value.avatar = row.avatar
    form.value.email = row.email
    form.value.phone = row.phone
    form.value.user_level_id = row.user_level_id
    form.value.nickname = row.nickname

    drawerRef.value?.open()
}

const onAddClick = () => {
    currentId.value = 0

    formRef.value?.resetFields()
    form.value.username = ''
    form.value.status = Status.disable
    form.value.avatar = ''
    form.value.phone = ''
    form.value.email = ''
    form.value.user_level_id = null
    form.value.password = ''
    form.value.nickname = ''

    drawerRef.value?.open()
}

const onDeleteConfirm = async (id: number) => {
    await deleteUserApi(id)
    await getUserList()
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
            await editUserApi(currentId.value, form.value)
        } else {
            await addUserApi(form.value)
        }
        await getUserList(pageNum.value)
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
    getUserList()
}

const onStatusChange = async (status: Status, row: UserListResult['list'][0] & { isLoading: boolean }) => {
    row.isLoading = true
    await changeUserStatusApi(row.id, status).finally(() => (row.isLoading = false))
    row.status = status
    ElNotification({
        type: 'success',
        message: '修改状态成功',
        duration: 2000,
    })
}

getUserList()
</script>

<template>
    <div>
        <el-card shadow="hover" class="!border-0">
            <Search :model="searchForm" @search="getUserList(1)" @reset="onResetClick">
                <SearchItem label="关键词">
                    <el-input v-model="searchForm.keyword" clearable placeholder="手机号/邮箱/会员名称"></el-input>
                </SearchItem>
                <template #show>
                    <SearchItem label="会员等级">
                        <el-select
                            v-model="searchForm.user_level_id"
                            class="!w-38"
                            clearable
                            placeholder="请选择会员等级"
                        >
                            <el-option
                                v-for="item in user_level"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                            ></el-option>
                        </el-select>
                    </SearchItem>
                </template>
            </Search>
            <ListHeader @add="onAddClick" @refresh="getUserList(1)"></ListHeader>
            <el-table v-loading="isLoading" :data="tableData" stripe>
                <el-table-column label="会员">
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
                <el-table-column v-if="!isMobile()" label="会员等级" align="center">
                    <template #default="{ row }">
                        {{ row.user_level?.name || '-' }}
                    </template>
                </el-table-column>
                <el-table-column v-if="!isMobile()" label="登录注册" align="center">
                    <template #default="{ row }">
                        <p v-if="row.last_login_time">最后登录: {{ row.last_login_time }}</p>
                        <p>注册时间: {{ row.create_time }}</p>
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
                    @current-change="getUserList"
                />
            </div>
        </el-card>
        <FormDrawer ref="drawerRef" :title="drawerTitle" @submit="onDrawerConfirm">
            <el-form ref="formRef" :model="form" :rules="rules">
                <el-form-item prop="username" label="用户名称">
                    <el-input v-model="form.username" placeholder="请输入用户名称"></el-input>
                </el-form-item>
                <el-form-item prop="password" label="密码">
                    <el-input v-model="form.password" placeholder="请输入密码"></el-input>
                </el-form-item>
                <el-form-item prop="nickname" label="昵称">
                    <el-input v-model="form.nickname" placeholder="请输入昵称"></el-input>
                </el-form-item>
                <el-form-item prop="avatar" label="头像">
                    <ChoiceImage v-model="form.avatar"></ChoiceImage>
                </el-form-item>
                <el-form-item prop="user_level_id" label="会员等级">
                    <el-select v-model="form.user_level_id" placeholder="选择会员等级">
                        <el-option
                            v-for="item in user_level"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        ></el-option>
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
                <el-form-item prop="phone" label="手机号">
                    <el-input v-model="form.phone" placeholder="请输入手机号"></el-input>
                </el-form-item>
                <el-form-item prop="email" label="邮箱地址">
                    <el-input v-model="form.email" placeholder="请输入邮箱地址"></el-input>
                </el-form-item>
            </el-form>
        </FormDrawer>
    </div>
</template>

<style scoped></style>
