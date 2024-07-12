<script setup lang="ts">
import AsideList from '@/components/AsideList.vue'
import {
    getImageCategoryListApi,
    addImageCategoryApi,
    editImageCategoryApi,
    deleteImageCategoryApi,
    ImageCategoryListResult,
} from '@/api/image_class.ts'
import { computed, ref } from 'vue'
import FormDrawer from '@/components/FormDrawer.vue'
import { FormInstance } from 'element-plus/lib/components'
import { ElNotification, FormRules } from 'element-plus'

const activeId = ref(0)

const currentPage = ref(1)

const limit = ref(20)

const categoryTotal = ref(0)

const editId = ref(0)

const drawerTitle = computed(() => (editId.value ? '编辑' : '新增'))

const imageCategoryList = ref<ImageCategoryListResult['list']>([])

const onImageCategoryClick = (category: ImageCategoryListResult['list'][0]) => {
    activeId.value = category.id
}

const getImageList = async (pageNum: number) => {
    currentPage.value = pageNum

    const result = await getImageCategoryListApi(currentPage.value, limit.value)

    imageCategoryList.value = result.data.list

    categoryTotal.value = result.data.totalCount

    const item = result.data.list[0]
    // 默认选中第一个
    if (item) {
        activeId.value = item.id
    }
}

const drawerRef = ref<InstanceType<typeof FormDrawer>>()

const onDrawerConfirm = () => {
    formRef.value?.validate(async (valid) => {
        if (!valid) return
        drawerRef.value?.showLoading()

        if (editId.value) {
            await editImageCategoryApi(editId.value, form.value.name, form.value.order).finally(() =>
                drawerRef.value?.hideLoading(),
            )
        } else {
            await addImageCategoryApi(form.value.name, form.value.order).finally(() => drawerRef.value?.hideLoading())
        }
        await getImageList(editId.value ? currentPage.value : 1)
        drawerRef.value?.close()
        ElNotification({
            type: 'success',
            message: drawerTitle.value + '分类成功',
            duration: 2000,
        })
    })
}

const createDrawer = () => {
    editId.value = 0
    form.value.name = ''
    form.value.order = 0
    drawerRef.value?.open()
}

const closeDrawer = () => drawerRef.value?.close()

const formRef = ref<FormInstance>()

const form = ref({
    name: '', // 分类名称
    order: 0, // 排序
})

const rules = ref<FormRules<{ name: string; order: number }>>({
    name: [{ required: true, message: '分类名称不能为空', trigger: 'blur' }],
})

const onEditClick = (row: ImageCategoryListResult['list'][0]) => {
    editId.value = row.id
    form.value.name = row.name
    form.value.order = row.order
    drawerRef.value?.open()
}

const onDeleteClick = async (categoryId: number) => {
    await deleteImageCategoryApi(categoryId)
    await getImageList(currentPage.value)
    ElNotification({
        type: 'success',
        message: '删除分类成功',
        duration: 2000,
    })
}

getImageList(1)

defineExpose({
    createDrawer,
    closeDrawer,
})
</script>

<template>
    <el-aside class="border-r relative">
        <div class="absolute top-0 left-0 right-0 bottom-50px overflow-y-scroll">
            <AsideList
                v-for="(item, index) in imageCategoryList"
                :key="index"
                :active="activeId === item.id"
                @click="onImageCategoryClick(item)"
                @edit="onEditClick(item)"
                @delete="onDeleteClick(item.id)"
                >{{ item.name }}</AsideList
            >
        </div>
        <div class="h-50px flex-center absolute left-0 right-0 bottom-0 border-t">
            <el-pagination
                layout="prev, next"
                background
                :total="categoryTotal"
                :current-page="currentPage"
                :page-size="limit"
                @current-change="getImageList"
            />
        </div>
        <FormDrawer ref="drawerRef" :title="drawerTitle" @submit="onDrawerConfirm">
            <el-form ref="formRef" :model="form" :rules="rules" label-width="120">
                <el-form-item label="分类名称:" prop="name">
                    <el-input v-model="form.name" placeholder="请输入分类名称"></el-input>
                </el-form-item>
                <el-form-item label="排序:" prop="order">
                    <el-input-number
                        v-model="form.order"
                        :min="0"
                        :max="categoryTotal"
                        placeholder="请选择排序"
                    ></el-input-number>
                </el-form-item>
            </el-form>
        </FormDrawer>
    </el-aside>
</template>

<style scoped></style>
