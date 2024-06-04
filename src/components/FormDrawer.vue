<script setup lang="ts">
import { ref } from 'vue'

const drawer = ref(false)

withDefaults(
    defineProps<{
        title: string
        size?: string
        destroyOnClose?: boolean
    }>(),
    {
        size: '45%',
        destroyOnClose: false,
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
            <el-button :loading="isLoading" @click="onSubmit">确认</el-button>
            <el-button @click="onCancel">取消</el-button>
        </template>
    </el-drawer>
</template>

<style scoped></style>
