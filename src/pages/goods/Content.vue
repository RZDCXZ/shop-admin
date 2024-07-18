<script setup lang="ts">
import { ref } from 'vue'
import { GoodsListResult } from '@/api/goods.ts'
import { editGoodsApi, getGoodsDetailApi } from '@/api/goods.ts'
import { ElNotification } from 'element-plus'
import FormDrawer from '@/components/FormDrawer.vue'
import Editor from '@/components/Editor.vue'

const emits = defineEmits(['reloadData'])

const form = ref<{ content: string }>({
    content: '',
})

const onSubmit = async () => {
    drawerRef.value?.showLoading()
    await editGoodsApi(goodsId.value, form.value as any).finally(() => drawerRef.value?.hideLoading())
    drawerRef.value?.close()
    ElNotification({
        type: 'success',
        message: '设置商品详情成功',
        duration: 2000,
    })
    emits('reloadData')
}

const goodsId = ref(0)

const drawerRef = ref<InstanceType<typeof FormDrawer>>()

const open = async (row: GoodsListResult['list'][0]) => {
    goodsId.value = row.id
    const result = await getGoodsDetailApi(goodsId.value)
    form.value.content = result.data.content
    drawerRef.value?.open()
}

const close = () => drawerRef.value?.close()

defineExpose({
    open,
    close,
})
</script>

<template>
    <div>
        <FormDrawer ref="drawerRef" title="设置商品详情" :destroy-on-close="true" @submit="onSubmit">
            <el-form :model="form">
                <el-form-item>
                    <Editor v-model="form.content"></Editor>
                </el-form-item>
            </el-form>
        </FormDrawer>
    </div>
</template>

<style scoped></style>
