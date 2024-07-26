<script setup lang="ts">
import { computed, ref } from 'vue'
import { getImageListByCategoryApi, CategoryImageListResult, editImageNameApi, deleteImageApi } from '@/api/image.ts'
import { isMobile, showPrompt } from '@/utils/tools.ts'
import { ElNotification } from 'element-plus'
import UploadFile from '@/components/UploadFile.vue'
import FormDrawer from '@/components/FormDrawer.vue'

const props = withDefaults(
    defineProps<{
        openChoice?: boolean
        limit?: number
    }>(),
    {
        openChoice: false,
        limit: 1,
    },
)

const isLoading = ref(false)

const currentPage = ref(1)

const total = ref(0)

const pageLimit = ref(10)

const categoryId = ref(0)

const imageList = ref<any>([])

const drawerRef = ref<InstanceType<typeof FormDrawer>>()

const showDrawer = () => drawerRef.value?.open()

const closeDrawer = () => drawerRef.value?.close()

const emits = defineEmits(['choice'])

const getImageList = async (pageNum: number) => {
    isLoading.value = true
    currentPage.value = pageNum
    const result = await getImageListByCategoryApi(categoryId.value, currentPage.value).finally(
        () => (isLoading.value = false),
    )
    imageList.value = result.data.list.map((item: any) => {
        item.checked = false
        return item
    })
    total.value = result.data.totalCount
}

const loadData = (id: number) => {
    currentPage.value = 1
    categoryId.value = id
    getImageList(1)
}

const onRenameClick = (item: CategoryImageListResult['list'][0]) => {
    showPrompt('重命名', item.name).then(async ({ value }) => {
        await editImageNameApi(item.id, value)
        await getImageList(currentPage.value)
        ElNotification({
            type: 'success',
            message: '重命名成功',
            duration: 2000,
        })
    })
}

const onDeleteClick = async (id: number) => {
    await deleteImageApi([id])
    await getImageList(currentPage.value)
    ElNotification({
        type: 'success',
        message: '删除图片成功',
        duration: 2000,
    })
}

const onUploadSuccess = () => getImageList(1)

const checkedImage = computed(() => imageList.value.filter((o: any) => o.checked))

const onCheckChange = (item: CategoryImageListResult['list'][0] & { checked: boolean }) => {
    if (item.checked && checkedImage.value.length > props.limit) {
        item.checked = false
        return ElNotification({
            type: 'warning',
            message: `最多只能选${props.limit}张`,
            duration: 2000,
        })
    }
    emits('choice', checkedImage.value)
}

defineExpose({
    loadData,
    showDrawer,
    closeDrawer,
})
</script>

<template>
    <el-main v-loading="isLoading" class="relative">
        <div class="absolute top-3 left-3 right-3 bottom-50px overflow-y-scroll overflow-x-hidden">
            <el-row :gutter="10">
                <el-col v-for="(item, index) in imageList" :key="index" :xs="24" :span="6">
                    <el-card shadow="hover" class="mb-3" :class="{ '!border-blue-500': item.checked }">
                        <el-image
                            :src="item.url"
                            :initial-index="0"
                            :preview-src-list="[item.url]"
                            fit="contain"
                            class="w-full h-150px"
                        ></el-image>
                        <div class="text-center truncate text-sm text-gray-500">{{ item.name }}</div>
                        <div class="flex-center p-2">
                            <el-checkbox v-if="openChoice" v-model="item.checked" @change="onCheckChange(item)" />
                            <el-button type="primary" size="small" text @click="onRenameClick(item)">重命名</el-button>
                            <el-popconfirm
                                title="确定删除该图片吗?"
                                confirm-button-text="确定"
                                cancel-button-text="取消"
                                @confirm="onDeleteClick(item.id)"
                            >
                                <template #reference>
                                    <el-button type="primary" size="small" text>删除</el-button>
                                </template>
                            </el-popconfirm>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </div>
        <div class="h-50px flex-center absolute left-0 right-0 bottom-0">
            <el-pagination
                :small="isMobile()"
                layout="prev,pager,next"
                background
                :total="total"
                :current-page="currentPage"
                :page-size="pageLimit"
                @current-change="getImageList"
            />
        </div>
        <FormDrawer ref="drawerRef" title="上传图片" :is-show-footer="false">
            <UploadFile :data="{ image_class_id: categoryId }" @success="onUploadSuccess"></UploadFile>
        </FormDrawer>
    </el-main>
</template>

<style scoped></style>
