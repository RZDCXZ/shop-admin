<script setup lang="ts">
import { ref } from 'vue'
import ChoiceImage from '@/components/ChoiceImage.vue'
import { GoodsListResult } from '@/api/goods.ts'
import { setGoodsBannerApi, getGoodsDetailApi } from '@/api/goods.ts'
import { ElNotification } from 'element-plus'
import { isMobile } from '@/utils/tools.ts'

const dialogVisible = ref(false)

const emits = defineEmits(['reloadData'])

const form = ref<{ banners: string[] }>({
    banners: [],
})

const onSubmit = async () => {
    await setGoodsBannerApi(goodsId.value, form.value.banners)
    dialogVisible.value = false
    ElNotification({
        type: 'success',
        message: '设置轮播图成功',
        duration: 2000,
    })
    emits('reloadData')
}

const goodsId = ref(0)

const open = async (row: GoodsListResult['list'][0]) => {
    goodsId.value = row.id
    const result = await getGoodsDetailApi(goodsId.value)
    form.value.banners = result.data.goodsBanner.map((o) => o.url)
    dialogVisible.value = true
}

const close = () => (dialogVisible.value = false)

defineExpose({
    open,
    close,
})
</script>

<template>
    <div>
        <el-drawer
            v-model="dialogVisible"
            :size="isMobile() ? '80%' : '45%'"
            title="设置轮播图"
            :destroy-on-close="true"
        >
            <el-form :model="form">
                <el-form-item label="轮播图">
                    <ChoiceImage v-model="form.banners" :limit="9"></ChoiceImage>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">提交</el-button>
                    <el-button @click="close">取消</el-button>
                </el-form-item>
            </el-form>
        </el-drawer>
    </div>
</template>

<style scoped></style>
