<script setup lang="ts">
import { changeCommentStatusApi, getCommentListApi, CommentListResult, reviewCommentApi } from '@/api/comment.ts'
import { ref } from 'vue'
import { isMobile } from '@/utils/tools.ts'
import { Status, Super } from '@/constant/enum.ts'
import { ElNotification } from 'element-plus'
import Search from '@/components/Search.vue'
import SearchItem from '@/components/SearchItem.vue'

const pageNum = ref(1)

const total = ref(0)

const limit = ref(10)

const isLoading = ref(false)

const searchForm = ref({
    title: null,
})

const tableData = ref<CommentListResult['list']>([])

const textarea = ref('')

const getCommentList = async (p: number = 1) => {
    pageNum.value = p

    isLoading.value = true

    const result = await getCommentListApi(pageNum.value, searchForm.value.title).finally(
        () => (isLoading.value = false),
    )

    tableData.value = result.data.list.map((item: any) => {
        item.isLoading = false
        item.textareaEdit = false

        return item
    })
    total.value = result.data.totalCount
}

const onResetClick = () => {
    searchForm.value.title = null
    getCommentList()
}

const onStatusChange = async (status: Status, row: CommentListResult['list'][0] & { isLoading: boolean }) => {
    row.isLoading = true
    await changeCommentStatusApi(row.id, status).finally(() => (row.isLoading = false))
    row.status = status
    ElNotification({
        type: 'success',
        message: '修改状态成功',
        duration: 2000,
    })
}

const onReviewClick = (row: CommentListResult['list'][0] & { textareaEdit: boolean }) => {
    textarea.value = ''
    row.textareaEdit = true
}

const onEditClick = (row: CommentListResult['list'][0] & { textareaEdit: boolean }, data: string = '') => {
    textarea.value = data
    row.textareaEdit = true
}

const onReviewConfirm = async (row: CommentListResult['list'][0] & { textareaEdit: boolean }) => {
    if (textarea.value === '') {
        return ElNotification({
            type: 'warning',
            message: '回复内容不能为空',
            duration: 2000,
        })
    }
    await reviewCommentApi(row.id, textarea.value)
    row.textareaEdit = false
    await getCommentList()
    ElNotification({
        type: 'success',
        message: '回复成功',
        duration: 2000,
    })
}

getCommentList()
</script>

<template>
    <div>
        <el-card shadow="hover" class="!border-0">
            <Search :model="searchForm" @search="getCommentList(1)" @reset="onResetClick">
                <SearchItem label="关键词">
                    <el-input v-model="searchForm.title" clearable placeholder="请输入商品标题搜索"></el-input>
                </SearchItem>
            </Search>
            <el-table v-loading="isLoading" default-expand-all :data="tableData" stripe>
                <el-table-column type="expand">
                    <template #default="{ row }">
                        <div class="flex md:pl-18">
                            <el-avatar class="mr-3" :size="50" :src="row.user.avatar" fit="cover"></el-avatar>
                            <div class="flex-1">
                                <h6 class="flex items-center">
                                    {{ row.user.nickname || row.user.username }}
                                    <small class="text-gray-400 ml-2">{{ row.review_time }}</small>
                                    <el-button
                                        v-if="!row.textareaEdit && !row.extra"
                                        size="small"
                                        class="ml-auto"
                                        @click="onReviewClick(row)"
                                        >回复</el-button
                                    >
                                </h6>
                                {{ row.review.data }}
                                <div class="py-2">
                                    <el-image
                                        v-for="(item, index) in row.review.image"
                                        :key="index"
                                        :src="item"
                                        lazy
                                        fit="cover"
                                        class="!w-100px !h-100px rounded"
                                    ></el-image>
                                </div>
                                <div v-if="row.textareaEdit">
                                    <el-input
                                        v-model="textarea"
                                        placeholder="请输入评价内容"
                                        type="textarea"
                                        :row="3"
                                    ></el-input>
                                    <div class="py-2">
                                        <el-button size="small" type="primary" @click="onReviewConfirm(row)"
                                            >回复</el-button
                                        >
                                        <el-button size="small" class="ml-2" @click="row.textareaEdit = false"
                                            >取消</el-button
                                        >
                                    </div>
                                </div>
                                <template v-else>
                                    <div
                                        v-for="(item, index) in row.extra"
                                        :key="index"
                                        class="mt-3 bg-gray-50 p-3 rounded"
                                    >
                                        <h6 class="flex font-bold">
                                            客服
                                            <el-button
                                                class="ml-auto"
                                                size="small"
                                                type="info"
                                                @click="onEditClick(row, item.data)"
                                                >修改</el-button
                                            >
                                        </h6>
                                        <p>{{ item.data }}</p>
                                    </div>
                                </template>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column v-if="!isMobile()" label="ID" width="70" align="center" prop="id"></el-table-column>
                <el-table-column label="商品">
                    <template #default="{ row }">
                        <div class="flex items-center">
                            <el-image
                                :src="row.goods_item?.cover || ''"
                                fit="cover"
                                lazy
                                class="!w-50px !h-50px rounded"
                            ></el-image>
                            <div class="ml-3">
                                <h6>{{ row.goods_item?.title || '商品已被删除' }}</h6>
                                <small>ID:{{ row.id }}</small>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column v-if="!isMobile()" label="评价信息">
                    <template #default="{ row }">
                        <div>
                            <p>用户: {{ row.user.nickname || row.user.username }}</p>
                            <p>
                                <el-rate v-model="row.rating" disabled show-score text-color="#ff9900"></el-rate>
                            </p>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    v-if="!isMobile()"
                    label="评价时间"
                    align="center"
                    prop="review_time"
                ></el-table-column>
                <el-table-column v-if="!isMobile()" prop="status" label="状态">
                    <template #default="{ row }">
                        <el-switch
                            :loading="row.isLoading"
                            :model-value="row.status"
                            :active-value="Status.enable"
                            :inactive-value="Status.disable"
                            :disabled="row.super === Super.is"
                            @change="onStatusChange($event, row)"
                        ></el-switch>
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
                    @current-change="getCommentList"
                />
            </div>
        </el-card>
    </div>
</template>

<style scoped></style>
