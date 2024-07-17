<script setup lang="ts">
import { Refresh } from '@element-plus/icons-vue'
import { computed } from 'vue'

const props = withDefaults(
    defineProps<{
        layout?: string
    }>(),
    {
        layout: 'add,refresh',
    },
)

const btns = computed(() => props.layout.split(','))

const emits = defineEmits(['add', 'refresh', 'delete'])
</script>

<template>
    <div class="flex items-center justify-between mb-4">
        <div>
            <el-button v-if="btns.includes('add')" type="primary" size="small" @click="emits('add')">新增</el-button>
            <el-popconfirm
                v-if="btns.includes('delete')"
                title="确定删除所有选中项吗?"
                confirm-button-text="确定"
                cancel-button-text="取消"
                @confirm="emits('delete')"
            >
                <template #reference>
                    <el-button type="danger" size="small">批量删除</el-button>
                </template>
            </el-popconfirm>
        </div>
        <el-tooltip effect="dark" content="刷新数据" placement="top">
            <el-button v-if="btns.includes('refresh')" text @click="emits('refresh')">
                <el-icon :size="20">
                    <Refresh></Refresh>
                </el-icon>
            </el-button>
        </el-tooltip>
    </div>
</template>

<style scoped></style>
