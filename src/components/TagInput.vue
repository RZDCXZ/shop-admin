<template>
    <div class="flex gap-2 flex-wrap">
        <el-tag v-for="tag in dynamicTags" :key="tag" closable :disable-transitions="false" @close="handleClose(tag)">
            {{ tag }}
        </el-tag>
        <el-input
            v-if="inputVisible"
            ref="InputRef"
            v-model="inputValue"
            class="w-20"
            size="small"
            @keyup.enter="handleInputConfirm"
            @blur="handleInputConfirm"
        />
        <el-button v-else class="button-new-tag" size="small" @click="showInput"> + 添加值 </el-button>
    </div>
</template>

<script lang="ts" setup>
import { nextTick, ref } from 'vue'
import { ElInput } from 'element-plus'

const props = defineProps<{
    modelValue: string
}>()

const emits = defineEmits(['update:modelValue'])

const inputValue = ref('')
const dynamicTags = ref(props.modelValue ? props.modelValue.split(',') : [])
const inputVisible = ref(false)
const InputRef = ref<InstanceType<typeof ElInput>>()

const handleClose = (tag: string) => {
    dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1)
    emits('update:modelValue', dynamicTags.value.join(','))
}

const showInput = () => {
    inputVisible.value = true
    nextTick(() => {
        InputRef.value!.input!.focus()
    })
}

const handleInputConfirm = () => {
    if (inputValue.value) {
        dynamicTags.value.push(inputValue.value)
        emits('update:modelValue', dynamicTags.value.join(','))
    }
    inputVisible.value = false
    inputValue.value = ''
}
</script>
