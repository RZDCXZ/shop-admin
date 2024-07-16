<script setup lang="ts">
import { ref } from 'vue'
import * as iconList from '@element-plus/icons-vue'

defineProps<{
    modelValue: string
}>()

const emits = defineEmits(['update:modelValue'])

const icons = ref<string[]>(Object.keys(iconList))

const onChange = (icon: string) => {
    emits('update:modelValue', icon)
}
</script>

<template>
    <div class="w-1/3 flex items-center">
        <el-icon v-if="modelValue" :size="20" class="mr-2">
            <component :is="modelValue"></component>
        </el-icon>
        <el-select filterable :model-value="modelValue" placeholder="请选择图标" @change="onChange">
            <el-option v-for="item in icons" :key="item" :label="item" :value="item">
                <div class="flex items-center justify-between">
                    <el-icon>
                        <component :is="item"></component>
                    </el-icon>
                    <span class="text-gray-500">{{ item }}</span>
                </div>
            </el-option>
        </el-select>
    </div>
</template>

<style scoped></style>
