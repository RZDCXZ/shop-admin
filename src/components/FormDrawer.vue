<script setup lang="ts">
import { ref } from 'vue'
import { isMobile } from '@/utils/tools.ts'

const drawer = ref(false)

withDefaults(
    defineProps<{
        title: string
        size?: string
        isShowFooter?: boolean
        destroyOnClose?: boolean
    }>(),
    {
        size: isMobile() ? '80%' : '45%',
        destroyOnClose: false,
        isShowFooter: true,
    },
)

const emits = defineEmits<{
    submit: []
    cancel: []
}>()

const open = () => (drawer.value = true)

const close = () => (drawer.value = false)

const onSubmit = () => {
    emits('submit')
}

const onCancel = () => {
    close()
    emits('cancel')
}

const isLoading = ref(false)

const showLoading = () => (isLoading.value = true)

const hideLoading = () => (isLoading.value = false)

defineExpose({
    open,
    close,
    showLoading,
    hideLoading,
})
</script>

<template>
    <el-drawer v-model="drawer" :title="title" :size="size" :destroy-on-close="destroyOnClose" :show-close="false">
        <slot></slot>
        <template #footer>
            <div v-if="isShowFooter" class="text-align-left">
                <el-button :loading="isLoading" type="primary" @click="onSubmit">确认</el-button>
                <el-button @click="onCancel">取消</el-button>
            </div>
        </template>
    </el-drawer>
</template>

<style scoped></style>
