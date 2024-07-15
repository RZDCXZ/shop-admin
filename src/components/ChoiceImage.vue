<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue'
import { ref } from 'vue'
import ImageMain from '@/components/ImageMain.vue'
import ImageAside from '@/components/ImageAside.vue'
import { isMobile } from '@/utils/tools.ts'

const props = defineProps<{
    modelValue: string
}>()

const emits = defineEmits(['update:modelValue'])

const dialogVisible = ref(false)

const imageAsideRef = ref<InstanceType<typeof ImageAside>>()

const imageMainRef = ref<InstanceType<typeof ImageMain>>()

const onAddCategoryClick = () => {
    imageAsideRef.value?.createDrawer()
}

const onUploadClick = () => {
    imageMainRef.value?.showDrawer()
}

const onCategoryChange = (categoryId: number) => imageMainRef.value?.loadData(categoryId)

let urls: any[] = []

const onChoice = (e: Array<any>) => {
    urls = e.map((o) => o.url)
}

const onDialogConfirm = () => {
    if (urls.length) {
        emits('update:modelValue', urls[0])
    }
    dialogVisible.value = false
}
</script>

<template>
    <div class="flex">
        <div v-if="modelValue">
            <el-image :src="modelValue" fit="cover" class="w-100px h-100px rounded border mr-2"></el-image>
        </div>
        <div
            class="w100px h100px rounded border flex-center cursor-pointer hover:bg-gray-100"
            @click="dialogVisible = true"
        >
            <el-icon :size="25" class="!text-gray-500"><Plus></Plus></el-icon>
        </div>
        <el-dialog v-model="dialogVisible" title="选择图片" :width="isMobile() ? '100%' : '80%'" top="5vh">
            <el-container class="bg-white rounded" style="height: 70vh">
                <el-header class="flex items-center border-b">
                    <el-button type="primary" size="small" @click="onAddCategoryClick">新增图片分类</el-button>
                    <el-button type="warning" size="small" @click="onUploadClick">上传图片</el-button>
                </el-header>
                <el-container>
                    <ImageAside ref="imageAsideRef" @change="onCategoryChange"></ImageAside>
                    <ImageMain ref="imageMainRef" open-choice @choice="onChoice"></ImageMain>
                </el-container>
            </el-container>
            <template #footer>
                <div>
                    <el-button type="primary" @click="onDialogConfirm">确定</el-button>
                    <el-button @click="dialogVisible = false">返回</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<style scoped></style>
