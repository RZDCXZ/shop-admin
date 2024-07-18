<script setup lang="ts">
import { ref } from 'vue'
import { GoodsListResult } from '@/api/goods.ts'
import { editGoodsSkusApi, getGoodsDetailApi } from '@/api/goods.ts'
import { ElNotification } from 'element-plus'
import FormDrawer from '@/components/FormDrawer.vue'

const emits = defineEmits(['reloadData'])

const form = ref({
    sku_type: 0,
    sku_value: {
        oprice: 0,
        pprice: 0,
        cprice: 0,
        weight: 0,
        volume: 0,
    },
})

const onSubmit = async () => {
    drawerRef.value?.showLoading()
    await editGoodsSkusApi(goodsId.value, form.value as any).finally(() => drawerRef.value?.hideLoading())
    drawerRef.value?.close()
    ElNotification({
        type: 'success',
        message: '设置商品规格成功',
        duration: 2000,
    })
    emits('reloadData')
}

const goodsId = ref(0)

const drawerRef = ref<InstanceType<typeof FormDrawer>>()

const open = async (row: GoodsListResult['list'][0]) => {
    goodsId.value = row.id
    const result = await getGoodsDetailApi(goodsId.value)
    form.value.sku_type = result.data.sku_type
    form.value.sku_value = result.data.sku_value || {
        oprice: 0,
        pprice: 0,
        cprice: 0,
        weight: 0,
        volume: 0,
    }
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
        <FormDrawer ref="drawerRef" title="设置商品规格" :destroy-on-close="true" @submit="onSubmit">
            <el-form :model="form">
                <el-form-item label="规格类型">
                    <el-radio-group v-model="form.sku_type">
                        <el-radio :label="0">单规格</el-radio>
                        <el-radio :label="1">多规格</el-radio>
                    </el-radio-group>
                </el-form-item>
                <template v-if="form.sku_type === 0">
                    <el-form-item label="市场价格">
                        <el-input v-model="form.sku_value.oprice" class="!w-1/3">
                            <template #append>元</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="销售价格">
                        <el-input v-model="form.sku_value.pprice" class="!w-1/3">
                            <template #append>元</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="成本价格">
                        <el-input v-model="form.sku_value.cprice" class="!w-1/3">
                            <template #append>元</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="商品重量">
                        <el-input v-model="form.sku_value.weight" class="!w-1/3">
                            <template #append>公斤</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="商品体积">
                        <el-input v-model="form.sku_value.volume" class="!w-1/3">
                            <template #append>立方米</template>
                        </el-input>
                    </el-form-item>
                </template>
                <template v-else></template>
            </el-form>
        </FormDrawer>
    </div>
</template>

<style scoped></style>
