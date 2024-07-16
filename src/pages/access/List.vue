<script setup lang="ts">
import ListHeader from '@/components/ListHeader.vue'
import {
    AccessListResult,
    AddAccessForm,
    getAccessListApi,
    addAccessApi,
    editAccessApi,
    deleteAccessApi,
    changeAccessStatusApi,
} from '@/api/access.ts'
import { computed, ref } from 'vue'
import { Status } from '@/constant/enum.ts'
import FormDrawer from '@/components/FormDrawer.vue'
import { ElNotification, FormRules } from 'element-plus'
import { FormInstance } from 'element-plus/lib/components'
import IconSelect from '@/components/IconSelect.vue'
import { isMobile } from '@/utils/tools.ts'

const isLoading = ref(false)

const drawerRef = ref<InstanceType<typeof FormDrawer>>()

const formRef = ref<FormInstance>()

const currentId = ref(0)

const drawerTitle = computed(() => (currentId.value ? '编辑' : '新增'))

const form = ref<AddAccessForm>({
    rule_id: 0,
    menu: 0,
    name: '',
    condition: '',
    method: 'GET',
    status: Status.enable,
    order: 0,
    icon: '',
    frontPath: '',
})

const rules = ref<FormRules<AddAccessForm>>({
    rule_id: [{ required: true, message: '上级菜单不能为空', trigger: 'blur' }],
    menu: [{ required: true, message: '菜单/规则不能为空', trigger: 'blur' }],
    name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
    condition: [{ required: true, message: '后端规则不能为空', trigger: 'blur' }],
    method: [{ required: true, message: '请求方式不能为空', trigger: 'blur' }],
    status: [{ required: true, message: '', trigger: 'blur' }],
    order: [{ required: true, message: '排序不能为空', trigger: 'blur' }],
    icon: [{ required: true, message: '图标', trigger: 'blur' }],
    frontPath: [{ required: true, message: '前端路由不能为空', trigger: 'blur' }],
})

const tableData = ref<AccessListResult['list']>([])

const accessRules = ref<AccessListResult['rules']>([])

const defaulExpandedKeys = ref<number[]>([])

const getAccessList = async () => {
    isLoading.value = true
    const result = await getAccessListApi().finally(() => (isLoading.value = false))
    tableData.value = result.data.list
    accessRules.value = result.data.rules
    defaulExpandedKeys.value = result.data.list.map((o) => o.id)
}

const onAddClick = () => {
    formRef.value?.resetFields()
    currentId.value = 0
    form.value.rule_id = 0
    form.value.order = 0
    form.value.method = 'GET'
    form.value.condition = ''
    form.value.frontPath = ''
    form.value.icon = ''
    form.value.name = ''
    form.value.menu = 0
    form.value.status = Status.enable
    drawerRef.value?.open()
}

const onEditClick = (row: AccessListResult['list'][0]) => {
    formRef.value?.resetFields()
    currentId.value = row.id
    form.value.rule_id = row.rule_id
    form.value.order = row.order
    form.value.method = row.method
    form.value.condition = row.condition
    form.value.frontPath = row.frontPath
    form.value.icon = row.icon
    form.value.name = row.name
    form.value.menu = row.menu
    form.value.status = row.status
    drawerRef.value?.open()
}

const onDeleteClick = async (id: number) => {
    await deleteAccessApi(id)
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
            await editAccessApi(currentId.value, form.value)
        } else {
            await addAccessApi(form.value)
        }
        await getAccessList()
        drawerRef.value?.close()
        ElNotification({
            type: 'success',
            message: drawerTitle.value + '成功',
            duration: 2000,
        })
    })
}

const onAddChildClick = (id: number) => {
    onAddClick()
    form.value.rule_id = id
    form.value.status = Status.enable
}

const onStatusChange = async (status: Status, row: AccessListResult['list'][0]) => {
    await changeAccessStatusApi(row.id, status)
    row.status = status
    ElNotification({
        type: 'success',
        message: '修改状态成功',
        duration: 2000,
    })
}

getAccessList()
</script>

<template>
    <div>
        <el-card shadow="never" class="!border-0">
            <ListHeader @refresh="getAccessList" @add="onAddClick"></ListHeader>
            <el-tree
                v-loading="isLoading"
                node-key="id"
                :default-expanded-keys="defaulExpandedKeys"
                :data="tableData"
                :props="{ label: 'name', children: 'child' }"
            >
                <template #default="{ data }">
                    <div class="flex flex-1 items-center text-14px">
                        <el-tag size="small" :type="data.menu ? 'primary' : 'info'">{{
                            data.menu ? '菜单' : '权限'
                        }}</el-tag>
                        <el-icon v-if="data.icon" :size="16" class="ml-2">
                            <component :is="data.icon"></component>
                        </el-icon>
                        <span>{{ data.name }}</span>
                        <div v-if="!isMobile()" class="ml-auto" @click.stop="() => {}">
                            <el-switch
                                :model-value="data.status"
                                :active-value="Status.enable"
                                :inactive-value="Status.disable"
                                @change="onStatusChange($event, data)"
                            ></el-switch>
                            <el-button text type="primary" size="small" @click="onEditClick(data)">修改</el-button>
                            <el-button text type="success" size="small" @click="onAddChildClick(data.id)"
                                >增加</el-button
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
                <el-form-item label="上级菜单" prop="rule_id">
                    <el-cascader
                        v-model="form.rule_id"
                        :options="accessRules"
                        :props="{ label: 'name', children: 'child', value: 'id', checkStrictly: true, emitPath: false }"
                        placeholder="请选择上级菜单"
                    ></el-cascader>
                </el-form-item>
                <el-form-item label="菜单/规则" prop="menu">
                    <el-radio-group v-model="form.menu">
                        <el-radio :label="1" border>菜单</el-radio>
                        <el-radio :label="0" border>规则</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="名称" prop="name">
                    <el-input v-model="form.name" placeholder="请输入名称" class="!w-1/2"></el-input>
                </el-form-item>
                <el-form-item v-if="form.menu === 1" label="菜单图标" prop="icon">
                    <IconSelect v-model="form.icon"></IconSelect>
                </el-form-item>
                <el-form-item v-if="form.menu === 1 && form.rule_id > 0" label="前端路由" prop="frontPath">
                    <el-input v-model="form.frontPath" placeholder="请输入前端路由"></el-input>
                </el-form-item>
                <el-form-item v-if="form.menu === 0" label="后端规则" prop="condition">
                    <el-input v-model="form.condition" placeholder="请输入后端规则"></el-input>
                </el-form-item>
                <el-form-item v-if="form.menu === 0" label="请求方式" prop="method">
                    <el-select v-model="form.method" placeholder="请选择请求方式">
                        <el-option
                            v-for="item in ['GET', 'POST', 'PUT', 'DELETE']"
                            :key="item"
                            :label="item"
                            :value="item"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="排序" prop="order">
                    <el-input-number v-model="form.order" :min="0" :max="1000"></el-input-number>
                </el-form-item>
            </el-form>
        </FormDrawer>
    </div>
</template>

<style scoped>
:deep(.el-tree-node__content) {
    padding: 20px 0;
}
</style>
