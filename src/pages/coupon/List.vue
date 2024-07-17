<script setup lang="ts">
import { computed, ref } from 'vue'
import {
    getCouponListApi,
    deleteCouponApi,
    CouponListResult,
    addCouponApi,
    editCouponApi,
    AddCouponForm,
    changeCouponStatusApi,
} from '@/api/coupon.ts'
import { ElNotification, FormRules } from 'element-plus'
import { isMobile } from '@/utils/tools.ts'
import FormDrawer from '@/components/FormDrawer.vue'
import { FormInstance } from 'element-plus/lib/components'
import ListHeader from '@/components/ListHeader.vue'
import { Status } from '@/constant/enum.ts'

const formatStatus = (row: CouponListResult['list'][0]) => {
    let s = '领取中'
    let start_time = new Date(row.start_time).getTime()
    let end_time = new Date(row.end_time).getTime()
    let now = new Date().getTime()

    if (start_time > now) {
        s = '未开始'
    } else if (end_time < now) {
        s = '已结束'
    } else if (row.status === Status.disable) {
        s = '已失效'
    }

    return s
}

const currentPage = ref(1)

const total = ref(0)

const isLoading = ref(false)

const currentId = ref(0)

const timerange = computed({
    get() {
        return form.value.start_time && form.value.end_time ? [form.value.start_time, form.value.end_time] : []
    },
    set(val: string[]) {
        form.value.start_time = val[0]
        form.value.end_time = val[1]
    },
})

const drawerTitle = computed(() => (currentId.value ? '编辑' : '新增'))

const drawerRef = ref<InstanceType<typeof FormDrawer>>()

const form = ref<AddCouponForm>({
    name: '',
    type: 0,
    value: 0,
    total: 0,
    min_price: 0,
    start_time: '',
    end_time: '',
    order: 0,
    desc: '',
})

const formRef = ref<FormInstance>()

const rules = ref<FormRules<AddCouponForm>>({
    name: [{ required: true, message: '优惠券名称不能为空', trigger: 'blur' }],
    type: [{ required: true, message: '类型不能为空', trigger: 'blur' }],
    value: [{ required: true, message: '不能为空', trigger: 'blur' }],
    total: [{ required: true, message: '不能为空', trigger: 'blur' }],
    min_price: [{ required: true, message: '不能为空', trigger: 'blur' }],
    start_time: [{ required: true, message: '开始时间不能为空', trigger: 'blur' }],
    end_time: [{ required: true, message: '结束时间不能为空', trigger: 'blur' }],
    order: [{ required: true, message: '排序不能为空', trigger: 'blur' }],
    desc: [{ required: true, message: '描述不能为空', trigger: 'blur' }],
})

const tableData = ref<CouponListResult['list']>([])

const getCouponList = async (pageNum: number = 1) => {
    isLoading.value = true
    currentPage.value = pageNum
    const result = await getCouponListApi(currentPage.value).finally(() => (isLoading.value = false))
    tableData.value = result.data.list.map((o: any) => {
        o.statusText = formatStatus(o)
        return o
    })
    total.value = result.data.totalCount
}

const onDrawerConfirm = () => {
    formRef.value?.validate(async (valid) => {
        if (!valid) return
        drawerRef.value?.showLoading()

        let body = { ...form.value }

        if (body.start_time.includes('-')) {
            body.start_time = new Date(body.start_time).getTime() as any
        }
        if (body.end_time.includes('-')) {
            body.end_time = new Date(body.end_time).getTime() as any
        }

        if (currentId.value) {
            await editCouponApi(currentId.value, body).finally(() => drawerRef.value?.hideLoading())
        } else {
            await addCouponApi(body).finally(() => drawerRef.value?.hideLoading())
        }

        await getCouponList(1)

        ElNotification({
            type: 'success',
            message: drawerTitle.value + '成功',
            duration: 2000,
        })

        drawerRef.value?.close()
    })
}

const onDeleteClick = async (id: number) => {
    await deleteCouponApi(id)
    await getCouponList(currentPage.value)
    ElNotification({
        type: 'success',
        message: '删除成功',
        duration: 2000,
    })
}

const onAddClick = () => {
    currentId.value = 0

    formRef.value?.resetFields()
    form.value.name = ''
    form.value.order = 0
    form.value.start_time = ''
    form.value.end_time = ''
    form.value.type = 0
    form.value.total = 0
    form.value.min_price = 0
    form.value.value = 0
    form.value.desc = ''

    drawerRef.value?.open()
}

const onEditClick = (row: CouponListResult['list'][0]) => {
    currentId.value = row.id

    formRef.value?.resetFields()
    form.value.name = row.name
    form.value.order = row.order
    form.value.start_time = row.start_time
    form.value.end_time = row.end_time
    timerange.value = [row.start_time, row.end_time]
    form.value.type = row.type
    form.value.total = row.total
    form.value.min_price = row.min_price
    form.value.value = row.value
    form.value.desc = row.desc

    drawerRef.value?.open()
}

const onChangeStatusClick = async (id: number) => {
    await changeCouponStatusApi(id)
    await getCouponList()
    ElNotification({
        type: 'success',
        message: '优惠券已失效',
        duration: 2000,
    })
}

getCouponList(1)
</script>

<template>
    <div>
        <el-card shadow="hover" class="!border-0">
            <ListHeader @add="onAddClick" @refresh="getCouponList(1)"></ListHeader>
            <el-table v-loading="isLoading" :data="tableData" stripe>
                <el-table-column prop="name" label="优惠券名称">
                    <template #default="{ row }">
                        <div
                            class="border border-dashed py-2 px-4 rounded"
                            :class="
                                row.statusText === '领取中'
                                    ? 'border-rose-200 bg-rose-50 text-red-400'
                                    : 'border-gray-200 bg-gray-50 text-gray-400'
                            "
                        >
                            <h5 class="font-bold text-md">{{ row.name }}</h5>
                            <small>{{ row.start_time }} ~ {{ row.end_time }}</small>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column v-if="!isMobile()" prop="statusText" label="状态"></el-table-column>
                <el-table-column v-if="!isMobile()" prop="type" label="优惠">
                    <template #default="{ row }">
                        {{ row.type === 0 ? '满减' : '折扣' }}
                        {{ row.type === 0 ? '￥' + row.value : row.value + '折' }}
                    </template>
                </el-table-column>
                <el-table-column v-if="!isMobile()" prop="total" label="发放数量"></el-table-column>
                <el-table-column v-if="!isMobile()" prop="used" label="已使用"></el-table-column>
                <el-table-column label="操作" align="center">
                    <template #default="{ row }">
                        <el-button
                            v-if="row.statusText === '未开始'"
                            type="primary"
                            size="small"
                            text
                            @click="onEditClick(row)"
                            >编辑</el-button
                        >
                        <el-popconfirm
                            v-if="row.statusText !== '领取中'"
                            title="确定删除吗?"
                            confirm-button-text="确定"
                            cancel-button-text="取消"
                            @confirm="onDeleteClick(row.id)"
                        >
                            <template #reference>
                                <el-button type="danger" size="small" text>删除</el-button>
                            </template>
                        </el-popconfirm>
                        <el-popconfirm
                            v-if="row.statusText === '领取中'"
                            title="确定让该优惠券失效?"
                            confirm-button-text="确定"
                            cancel-button-text="取消"
                            @confirm="onChangeStatusClick(row.id)"
                        >
                            <template #reference>
                                <el-button type="warning" size="small" text>失效</el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
            <div class="flex-center mt-5">
                <el-pagination
                    :small="isMobile()"
                    layout="prev,pager,next"
                    background
                    :total="total"
                    :current-page="currentPage"
                    :page-size="10"
                    @current-change="getCouponList"
                />
            </div>
        </el-card>
        <FormDrawer ref="drawerRef" :title="drawerTitle" @submit="onDrawerConfirm">
            <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="form.name" placeholder="请输入名称"></el-input>
                </el-form-item>
                <el-form-item label="类型" prop="type">
                    <el-radio-group v-model="form.type">
                        <el-radio :label="0" :value="0">满减</el-radio>
                        <el-radio :label="1" :value="1">折扣</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="面值" prop="value">
                    <el-input v-model="form.value" placeholder="请输入面值">
                        <template #append>{{ form.type ? '折' : '元' }}</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="发行量" prop="total">
                    <el-input-number v-model="form.total" :min="0" :max="10000"></el-input-number>
                </el-form-item>
                <el-form-item label="最低使用价格" prop="min_price">
                    <el-input v-model="form.min_price" type="number" placeholder="请输入最低使用价格"></el-input>
                </el-form-item>
                <el-form-item label="排序" prop="order">
                    <el-input-number v-model="form.order" :min="0" :max="1000"></el-input-number>
                </el-form-item>
                <el-form-item label="活动时间">
                    <el-date-picker
                        v-model="timerange"
                        type="datetimerange"
                        range-separator="~"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        value-format="YYYY-MM-DD HH:mm:ss"
                        :editable="false"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item label="描述" prop="desc">
                    <el-input v-model="form.desc" placeholder="请输入名称"></el-input>
                </el-form-item>
            </el-form>
        </FormDrawer>
    </div>
</template>

<style scoped></style>
