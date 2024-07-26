<script setup lang="ts">
import { ref } from 'vue'
import { isMobile } from '@/utils/tools.ts'
import { CategoryItemResult } from '@/api/category.ts'
import { getGoodsListApi } from '@/api/goods.ts'

const pageNum = ref(1)

const limit = ref(5)

const total = ref(0)

const isLoading = ref(false)

const searchForm = ref({
    title: null,
    category_id: 0,
})

const dialogVisible = ref(false)

const tableData = ref<any>([])

const onSubmit = () => {
    if (typeof callbackFunc.value === 'function') {
        callbackFunc.value(selectedIds.value)
    }
    close()
}

const close = () => {
    dialogVisible.value = false
}

const getGoodsList = async (p: number = 1) => {
    pageNum.value = p

    isLoading.value = true

    const result = await getGoodsListApi(
        pageNum.value,
        limit.value,
        'all',
        searchForm.value.title,
        searchForm.value.category_id,
    ).finally(() => (isLoading.value = false))

    tableData.value = result.data.list
    total.value = result.data.totalCount
}

const callbackFunc = ref()

const open = async (id: number, callback: any = null) => {
    searchForm.value.category_id = id
    callbackFunc.value = callback
    await getGoodsList(1)
    dialogVisible.value = true
}

const tableRef = ref()

const selectedIds = ref<number[]>([])

const onSelectionchange = (e: CategoryItemResult) => {
    selectedIds.value = e.map((o) => o.id)
}

defineExpose({
    open,
    close,
})
</script>

<template>
    <div>
        <el-dialog
            v-model="dialogVisible"
            :destroy-on-close="true"
            title="商品选择"
            :width="isMobile() ? '80%' : '45%'"
        >
            <template #footer>
                <el-table
                    ref="tableRef"
                    v-loading="isLoading"
                    height="300px"
                    :data="tableData"
                    stripe
                    @selection-change="onSelectionchange"
                >
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column label="商品">
                        <template #default="{ row }">
                            <div class="flex">
                                <el-image
                                    :src="row.cover"
                                    fit="cover"
                                    :lazy="true"
                                    class="w-50px h-50px mr-3 rounded"
                                ></el-image>
                                <div class="flex-1">
                                    <p>{{ row.title }}</p>
                                    <p class="text-gray-400 text-xs mb-1">分类:{{ row.category?.name || '未分类' }}</p>
                                    <p class="text-gray-400 text-xs">创建时间:{{ row.create_time }}</p>
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="stock" label="总库存" align="center" width="100"></el-table-column>
                    <el-table-column label="价格(元)" align="center" width="150">
                        <template #default="{ row }">
                            <span class="text-rose-500">￥{{ row.min_price }}</span>
                            <el-divider direction="vertical"></el-divider>
                            <span class="text-gray-500 text-xs">￥{{ row.min_oprice }}</span>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="flex-center mt-5">
                    <el-pagination
                        :small="isMobile()"
                        layout="prev,pager,next"
                        background
                        :total="total"
                        :current-page="pageNum"
                        :page-size="limit"
                        @current-change="getGoodsList"
                    />
                </div>
                <span>
                    <el-button @click="onSubmit">确认</el-button>
                    <el-button @click="close">返回</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<style scoped></style>
