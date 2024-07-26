<script setup lang="ts">
import { computed, ref } from 'vue'
import {
    getRoleListApi,
    deleteRoleApi,
    RoleListResult,
    addRoleApi,
    editRoleApi,
    AddRoleForm,
    changeRoleStatusApi,
    setRoleApi,
} from '@/api/role.ts'
import { AccessListResult, getAccessListApi } from '@/api/access.ts'
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

const checkStrictly = ref(false)

const form = ref<AddRoleForm>({
    name: '',
    status: Status.enable,
    desc: '',
})

const formRef = ref<FormInstance>()

const setRuleDrawerRef = ref<InstanceType<typeof FormDrawer>>()

const elTreeRef = ref()

const rules = ref<FormRules<AddRoleForm>>({
    name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }],
    status: [{ required: true, message: '请选择角色状态', trigger: 'blur' }],
    desc: [{ required: true, message: '角色描述不能为空', trigger: 'blur' }],
})

const ruleIds = ref<any>([])

const ruleList = ref<AccessListResult['list']>([])

const tableData = ref<RoleListResult['list']>([])

const getRoleList = async (pageNum: number = 1) => {
    isLoading.value = true
    currentPage.value = pageNum
    const result = await getRoleListApi(currentPage.value).finally(() => (isLoading.value = false))
    tableData.value = result.data.list
    total.value = result.data.totalCount
}

const onDrawerConfirm = () => {
    formRef.value?.validate(async (valid) => {
        if (!valid) return
        drawerRef.value?.showLoading()

        if (currentId.value) {
            await editRoleApi(currentId.value, form.value).finally(() => drawerRef.value?.hideLoading())
        } else {
            await addRoleApi(form.value).finally(() => drawerRef.value?.hideLoading())
        }

        await getRoleList(1)

        ElNotification({
            type: 'success',
            message: drawerTitle.value + '成功',
            duration: 2000,
        })

        drawerRef.value?.close()
    })
}

const onDeleteClick = async (id: number) => {
    await deleteRoleApi(id)
    await getRoleList(currentPage.value)
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
    form.value.desc = ''
    drawerRef.value?.open()
}

const defaultExpandedKeys = ref<number[]>([])

const onEditClick = (row: RoleListResult['list'][0]) => {
    currentId.value = row.id
    formRef.value?.resetFields()
    form.value.name = row.name
    form.value.status = row.status
    form.value.desc = row.desc
    drawerRef.value?.open()
}

const onStatusChange = async (status: Status, row: RoleListResult['list'][0] & { isLoading: boolean }) => {
    await changeRoleStatusApi(row.id, status)
    row.status = status
    ElNotification({
        type: 'success',
        message: '修改状态成功',
        duration: 2000,
    })
}

const onSetRuleDrawerConfirm = async () => {
    setRuleDrawerRef.value?.showLoading()
    await setRoleApi(currentId.value, ruleIds.value).finally(() => setRuleDrawerRef.value?.hideLoading())
    await getRoleList()
    setRuleDrawerRef.value?.close()
    ElNotification({
        type: 'success',
        message: '配置成功',
        duration: 2000,
    })
}

const treeHeight = ref(0)

const onSetRoleClick = async (row: RoleListResult['list'][0]) => {
    currentId.value = row.id
    treeHeight.value = window.innerHeight - 180
    checkStrictly.value = true
    const result = await getAccessListApi()
    ruleList.value = result.data.list
    defaultExpandedKeys.value = result.data.list.map((o) => o.id)
    ruleIds.value = row.rules.map((o: any) => o.id)
    setRuleDrawerRef.value?.open()
    setTimeout(() => {
        elTreeRef.value.setCheckedKeys(ruleIds.value)
        checkStrictly.value = false
    }, 50)
}

const onTreeCheck = (...e: any) => {
    const { checkedKeys, halfCheckedKeys } = e[1]
    ruleIds.value = [...checkedKeys, ...halfCheckedKeys]
}

getRoleList(1)
</script>

<template>
    <div>
        <el-card shadow="hover" class="!border-0">
            <ListHeader @add="onAddClick" @refresh="getRoleList(1)"></ListHeader>
            <el-table v-loading="isLoading" :data="tableData" stripe>
                <el-table-column prop="name" label="角色名称"></el-table-column>
                <el-table-column v-if="!isMobile()" prop="desc" label="角色描述"></el-table-column>
                <el-table-column v-if="!isMobile()" prop="status" label="角色状态">
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
                        <el-button type="warning" size="small" text @click="onSetRoleClick(row)">配置权限</el-button>
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
                    @current-change="getRoleList"
                />
            </div>
        </el-card>
        <FormDrawer ref="drawerRef" :title="drawerTitle" @submit="onDrawerConfirm">
            <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="角色名称" prop="name">
                    <el-input v-model="form.name" placeholder="请输入角色名称"></el-input>
                </el-form-item>
                <el-form-item label="角色状态" prop="status">
                    <el-switch
                        v-model="form.status"
                        :active-value="Status.enable"
                        :inactive-value="Status.disable"
                    ></el-switch>
                </el-form-item>
                <el-form-item label="角色描述" prop="desc">
                    <el-input v-model="form.desc" type="textarea" :rows="4" placeholder="请输入角色描述"></el-input>
                </el-form-item>
            </el-form>
        </FormDrawer>
        <FormDrawer ref="setRuleDrawerRef" title="权限配置" @submit="onSetRuleDrawerConfirm">
            <el-tree-v2
                ref="elTreeRef"
                node-key="id"
                :check-strictly="checkStrictly"
                :default-expanded-keys="defaultExpandedKeys"
                :data="ruleList"
                :props="{ label: 'name', children: 'child' }"
                show-checkbox
                :height="treeHeight"
                @check="onTreeCheck"
            >
                <template #default="{ data }">
                    <div class="flex items-center">
                        <el-tag :type="data.menu ? 'primary' : 'info'" size="small">
                            {{ data.menu ? '菜单' : '权限' }}
                        </el-tag>
                        <span class="ml-2 text-sm">{{ data.name }}</span>
                    </div>
                </template>
            </el-tree-v2>
        </FormDrawer>
    </div>
</template>

<style scoped></style>
