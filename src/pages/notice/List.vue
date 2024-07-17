<script setup lang="ts">
import { computed, ref } from 'vue'
import { getNoticeListApi, deleteNoticeApi, NoticeListResult, addNoticeApi, editNoticeApi } from '@/api/notice.ts'
import { ElNotification, FormRules } from 'element-plus'
import { isMobile } from '@/utils/tools.ts'
import FormDrawer from '@/components/FormDrawer.vue'
import { FormInstance } from 'element-plus/lib/components'
import ListHeader from '@/components/ListHeader.vue'

const currentPage = ref(1)

const total = ref(0)

const isLoading = ref(false)

const currentId = ref(0)

const drawerTitle = computed(() => (currentId.value ? '编辑' : '新增'))

const drawerRef = ref<InstanceType<typeof FormDrawer>>()

const form = ref({
    title: '',
    content: '',
})

const formRef = ref<FormInstance>()

const rules = ref<FormRules<{ title: string; content: string }>>({
    title: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
    content: [{ required: true, message: '内容不能为空', trigger: 'blur' }],
})

const tableData = ref<NoticeListResult['list']>([])

const getNoticeList = async (pageNum: number = 1) => {
    isLoading.value = true
    currentPage.value = pageNum
    const result = await getNoticeListApi(currentPage.value).finally(() => (isLoading.value = false))
    tableData.value = result.data.list
    total.value = result.data.totalCount
}

const onDrawerConfirm = () => {
    formRef.value?.validate(async (valid) => {
        if (!valid) return
        drawerRef.value?.showLoading()

        if (currentId.value) {
            await editNoticeApi(currentId.value, form.value.title, form.value.content).finally(() =>
                drawerRef.value?.hideLoading(),
            )
        } else {
            await addNoticeApi(form.value.title, form.value.content).finally(() => drawerRef.value?.hideLoading())
        }

        await getNoticeList(1)

        ElNotification({
            type: 'success',
            message: drawerTitle.value + '成功',
            duration: 2000,
        })

        drawerRef.value?.close()
    })
}

const onDeleteClick = async (id: number) => {
    await deleteNoticeApi(id)
    await getNoticeList(currentPage.value)
    ElNotification({
        type: 'success',
        message: '删除成功',
        duration: 2000,
    })
}

const onAddClick = () => {
    currentId.value = 0
    formRef.value?.resetFields()
    form.value.title = ''
    form.value.content = ''
    drawerRef.value?.open()
}

const onEditClick = (row: NoticeListResult['list'][0]) => {
    currentId.value = row.id
    formRef.value?.resetFields()
    form.value.title = row.title
    form.value.content = row.content
    drawerRef.value?.open()
}

getNoticeList(1)
</script>

<template>
    <div>
        <el-card shadow="hover" class="!border-0">
            <ListHeader @add="onAddClick" @refresh="getNoticeList(1)"></ListHeader>
            <el-table v-loading="isLoading" :data="tableData" stripe>
                <el-table-column prop="title" label="公告标题"></el-table-column>
                <el-table-column prop="create_time" label="发布时间"></el-table-column>
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
                    @current-change="getNoticeList"
                />
            </div>
        </el-card>
        <FormDrawer ref="drawerRef" :title="drawerTitle" @submit="onDrawerConfirm">
            <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="公告标题" prop="title">
                    <el-input v-model="form.title" placeholder="请输入标题"></el-input>
                </el-form-item>
                <el-form-item label="公告内容" prop="content">
                    <el-input v-model="form.content" type="textarea" :rows="4" placeholder="请输入内容"></el-input>
                </el-form-item>
            </el-form>
        </FormDrawer>
    </div>
</template>

<style scoped></style>
