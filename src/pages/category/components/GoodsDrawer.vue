<script setup lang="ts">
import FormDrawer from '@/components/FormDrawer.vue'
import { ref } from 'vue'
import {
    CategoryItemResult,
    getCategoryItemListApi,
    deleteCategoryItemApi,
    addCategoryItemApi,
} from '@/api/category.ts'
import { isMobile } from '@/utils/tools.ts'
import { ElNotification } from 'element-plus'
import ChoiceGoods from '@/components/ChoiceGoods.vue'

const drawerRef = ref<InstanceType<typeof FormDrawer>>()

const category_id = ref(0)

const tableData = ref<CategoryItemResult>([])

const open = async (id: number) => {
    category_id.value = id
    await getList()
    drawerRef.value?.open()
}

const getList = async () => {
    const result = await getCategoryItemListApi(category_id.value)
    tableData.value = result.data
}

const close = () => {
    drawerRef.value?.close()
}

const onDeleteClick = async (id: number) => {
    await deleteCategoryItemApi(id)
    await getList()
    ElNotification({
        type: 'success',
        message: '删除成功',
        duration: 2000,
    })
}

const choiceGoodsRef = ref<InstanceType<typeof ChoiceGoods>>()

const onConnect = () => {
    choiceGoodsRef.value?.open(category_id.value, async (goods_ids) => {
        await addCategoryItemApi(category_id.value, goods_ids)
        await getList()
        ElNotification({
            type: 'success',
            message: '关联成功',
            duration: 2000,
        })
    })
}

defineExpose({
    open,
    close,
})
</script>

<template>
    <div>
        <FormDrawer ref="drawerRef" title="推荐商品" confirm-text="关联" @submit="onConnect">
            <el-table :data="tableData" border stripe>
                <el-table-column v-if="!isMobile()" prop="goods_id" label="ID"></el-table-column>
                <el-table-column prop="cover" label="商品封面">
                    <template #default="{ row }">
                        <el-image :src="row.cover" fit="cover" lazy class="!w-64px !h-64px"></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="商品名称"></el-table-column>
                <el-table-column label="操作">
                    <template #default="{ row }">
                        <el-popconfirm
                            title="确定删除吗?"
                            confirm-button-text="确定"
                            cancel-button-text="取消"
                            @confirm="onDeleteClick(row.id)"
                        >
                            <template #reference>
                                <el-button type="danger" text size="small">删除</el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
        </FormDrawer>
        <ChoiceGoods ref="choiceGoodsRef"></ChoiceGoods>
    </div>
</template>

<style scoped></style>
