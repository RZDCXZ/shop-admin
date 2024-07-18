<script setup lang="ts">
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue'
import { computed, ref, useSlots } from 'vue'

defineProps<{
    model: object
}>()

const emits = defineEmits(['search', 'reset'])

const slots = useSlots()

const hasShowSearch = computed(() => !!slots.show)

const showSearch = ref(false)
</script>

<template>
    <div>
        <el-form :model="model" class="mb-3 md:flex" size="small" inline>
            <slot></slot>
            <template v-if="showSearch">
                <slot name="show"></slot>
            </template>
            <el-form-item class="ml-auto">
                <el-button type="primary" @click="emits('search')">搜索</el-button>
                <el-button @click="emits('reset')">重置</el-button>
                <el-button v-if="hasShowSearch" type="primary" text @click="showSearch = !showSearch">
                    {{ showSearch ? '收起' : '展开' }}
                    <el-icon>
                        <ArrowUp v-show="showSearch"></ArrowUp>
                        <ArrowDown v-show="!showSearch"></ArrowDown>
                    </el-icon>
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<style scoped></style>
