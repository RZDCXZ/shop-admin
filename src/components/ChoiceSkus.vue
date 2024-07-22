<script setup lang="ts">
import { ref } from 'vue'
import { isMobile } from '@/utils/tools.ts'
import { SkusListResult, getSkusListApi } from '@/api/skus.ts'

const dialogVisible = ref(false)

const onSubmit = () => {
    if (typeof callbackFunc.value === 'function') {
        callbackFunc.value(form.value)
    }
    dialogVisible.value = false
}

const callbackFunc = ref<object>()

const open = (callback: object) => {
    callbackFunc.value = callback
    getGoodsList(1)
    dialogVisible.value = true
}

const activeId = ref(0)

const close = () => (dialogVisible.value = false)

const pageNum = ref(1)

const limit = ref(10)

const total = ref(0)

const tableData = ref<SkusListResult['list']>([])

const getGoodsList = async (p: number = 1) => {
    pageNum.value = p
    const result = await getSkusListApi(pageNum.value)
    tableData.value = result.data.list
    total.value = result.data.totalCount
    if (tableData.value.length > 0) {
        onChangeActiveId(tableData.value[0].id)
    }
}

const list = ref<string[]>([])

const form = ref({
    name: '',
    list: [],
})

const onChangeActiveId = (id: number) => {
    activeId.value = id
    list.value = []
    let item = tableData.value.find((o) => o.id === id)
    if (item) {
        list.value = item.default.split(',')
        form.value.name = item.name
    }
}

defineExpose({
    open,
    close,
})
</script>

<template>
    <el-dialog v-model="dialogVisible" title="规格选择" :width="isMobile() ? '80%' : '45%'" top="5vh">
        <el-container class="!h-65vh">
            <el-aside class="border-r relative !w-100px !md:w-220px">
                <div class="absolute top-0 left-0 right-0 bottom-50px overflow-y-scroll">
                    <div
                        v-for="(item, index) in tableData"
                        :key="index"
                        :class="{ 'bg-blue-50': activeId === item.id }"
                        class="p-3 text-sm text-gray-600 flex items-center cursor-pointer border-b hover:bg-blue-50"
                        @click="onChangeActiveId(item.id)"
                    >
                        {{ item.name }}
                    </div>
                </div>
                <div class="h-50px flex-center absolute left-0 right-0 bottom-0 border-t">
                    <el-pagination
                        :small="isMobile()"
                        layout="prev, next"
                        background
                        :total="total"
                        :current-page="pageNum"
                        :page-size="limit"
                        @current-change="getGoodsList"
                    />
                </div>
            </el-aside>
            <el-main>
                <el-checkbox-group v-model="form.list">
                    <el-checkbox v-for="item in list" :key="item" border :label="item" :value="item">{{
                        item
                    }}</el-checkbox>
                </el-checkbox-group>
            </el-main>
        </el-container>
        <template #footer>
            <span>
                <el-button type="primary" @click="onSubmit">确定</el-button>
                <el-button @click="close">取消</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<style scoped></style>
