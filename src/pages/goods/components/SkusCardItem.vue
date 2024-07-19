<script setup lang="ts">
import { initSkusCardItem } from '@/utils/useSkus.ts'
import { ElInput } from 'element-plus'

const props = defineProps<{
    skusCardId: number
}>()

const { item, loading, handleClose, onTextChange, handleInputConfirm, InputRef, inputValue, inputVisible, showInput } =
    initSkusCardItem(props.skusCardId)
</script>

<template>
    <div v-loading="loading" class="flex gap-2">
        <el-tag
            v-for="(tag, index) in item.goodsSkusCardValue"
            :key="index"
            effect="plain"
            class="mx-1"
            closable
            :disable-transitions="false"
            @close="handleClose(tag)"
        >
            <el-input
                v-model="tag.text"
                class="!ml--10px !w-20"
                placeholder="选项值"
                size="small"
                @change="onTextChange($event, tag)"
            ></el-input>
        </el-tag>
        <el-input
            v-if="inputVisible"
            ref="InputRef"
            v-model="inputValue"
            class="!w-20 !ml-1"
            size="small"
            @keyup.enter="handleInputConfirm"
            @blur="handleInputConfirm"
        />
        <el-button v-else class="button-new-tag" size="small" @click="showInput"> + 添加选项值 </el-button>
    </div>
</template>

<style scoped></style>
