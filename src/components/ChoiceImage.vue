<script setup lang="ts">
import { CircleClose, Plus } from '@element-plus/icons-vue'
import { ref } from 'vue'
import ImageMain from '@/components/ImageMain.vue'
import ImageAside from '@/components/ImageAside.vue'
import { isMobile } from '@/utils/tools.ts'
import { ElNotification } from 'element-plus'

const props = withDefaults(
    defineProps<{
        modelValue?: string | string[]
        limit?: number
        preview?: boolean
    }>(),
    {
        limit: 1,
        preview: true,
        modelValue: '',
    },
)

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
    let value = []
    if (props.limit === 1) {
        value = urls[0]
    } else {
        value = props.preview ? [...props.modelValue, ...urls] : [...urls]
        if (value.length > props.limit) {
            let limit = props.preview ? props.limit - props.modelValue.length : props.limit
            return ElNotification({
                type: 'warning',
                message: `最多还能选择${limit}张`,
                duration: 2000,
            })
        }
    }
    if (value && props.preview) {
        emits('update:modelValue', value)
    }
    if (!props.preview && typeof callbackFunc.value === 'function') {
        callbackFunc.value(value)
    }
    close()
}

const onRemoveClick = (url: string) => {
    emits(
        'update:modelValue',
        (props.modelValue as string[]).filter((u) => u !== url),
    )
}

const callbackFunc = ref<object | null>(null)

const open = (callback: any = null) => {
    callbackFunc.value = callback
    dialogVisible.value = true
}

const close = () => (dialogVisible.value = false)

defineExpose({
    open,
    close,
})
</script>

<template>
    <div class="flex flex-wrap">
        <div v-if="modelValue && preview">
            <el-image
                v-if="typeof modelValue === 'string'"
                :src="modelValue"
                fit="cover"
                class="w-100px h-100px rounded border mr-2"
            ></el-image>
            <div v-else class="flex flex-wrap">
                <div v-for="(url, index) in modelValue" :key="index" class="relative mx-1 mb-2 w-100px h-100px">
                    <el-icon
                        class="bg-white rounded-full !absolute right-5px top-5px cursor-pointer z-10"
                        @click="onRemoveClick(url)"
                        ><CircleClose></CircleClose
                    ></el-icon>
                    <el-image :src="url" fit="cover" class="w-100px h-100px rounded border mr-2"></el-image>
                </div>
            </div>
        </div>
        <div
            v-if="preview"
            class="w-100px h-100px rounded border flex-center cursor-pointer hover:bg-gray-100"
            @click="open"
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
                    <ImageMain ref="imageMainRef" :limit="limit" open-choice @choice="onChoice"></ImageMain>
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
