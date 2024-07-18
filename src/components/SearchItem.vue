<script setup lang="ts">
defineProps<{
    label: string
}>()
</script>

<template>
    <el-form-item :label="label">
        <slot></slot>
    </el-form-item>
</template>

<style scoped></style>
