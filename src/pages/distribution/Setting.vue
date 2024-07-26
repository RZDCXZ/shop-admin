<script setup lang="ts">
import { getDistributionConfigApi, editDistributionConfigApi } from '@/api/distribution.ts'
import { ref } from 'vue'
import { ElNotification } from 'element-plus'
import ChoiceImage from '@/components/ChoiceImage.vue'

const loading = ref(false)

const form = ref<any>({
    distribution_open: 1,
    store_first_rebate: 10,
    store_second_rebate: 20,
    spread_banners: [],
    is_self_brokerage: 1,
    settlement_days: 7,
    brokerage_method: 'hand',
})

const getData = async () => {
    loading.value = true
    const result = await getDistributionConfigApi().finally(() => (loading.value = false))
    for (const k in form.value) {
        form.value[k] = (result.data as any)[k]
    }
}

const onSubmit = async () => {
    loading.value = true
    await editDistributionConfigApi({
        ...form.value,
    }).finally(() => (loading.value = false))
    ElNotification({
        type: 'success',
        message: '修改成功',
        duration: 2000,
    })
    await getData()
}

getData()
</script>

<template>
    <div v-loading="loading" class="bg-white p-4 rounded">
        <el-form :model="form">
            <h5 class="bg-gray-100 p-3 rounded mb-5">基础设置</h5>
            <el-form-item label="分销启用">
                <el-radio-group v-model="form.distribution_open">
                    <el-radio :label="0" border>禁用</el-radio>
                    <el-radio :label="1" border>启用</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="分销海报图">
                <ChoiceImage v-model="form.spread_banners" :limit="9"></ChoiceImage>
            </el-form-item>
            <h5 class="bg-gray-100 p-3 rounded mb-5">返佣设置</h5>
            <el-form-item label="一级返佣比例">
                <div>
                    <el-input v-model="form.store_first_rebate" type="number" placeholder="一级返佣比例">
                        <template #append> % </template>
                    </el-input>
                    <small class="text-gray-500 flex mt-1"
                        >订单交易成功后给上级返佣的比例0-100,例:5=反订单金额的5%</small
                    >
                </div>
            </el-form-item>
            <el-form-item label="二级返佣比例">
                <div>
                    <el-input v-model="form.store_second_rebate" type="number" placeholder="二级返佣比例">
                        <template #append> % </template>
                    </el-input>
                    <small class="text-gray-500 flex mt-1"
                        >订单交易成功后给上级返佣的比例0-100,例:5=反订单金额的5%</small
                    >
                </div>
            </el-form-item>
            <el-form-item label="自购返佣">
                <div>
                    <el-radio-group v-model="form.is_self_brokerage">
                        <el-radio :label="1" border>是</el-radio>
                        <el-radio :label="0" border>否</el-radio>
                    </el-radio-group>
                    <small class="text-gray-500 flex mt-1"
                        >是否开启自购返佣(开启:分销员自己购买商品,享受一级返佣,上级享受二级返佣;
                        关闭:分销员自己购买商品没有返佣)</small
                    >
                </div>
            </el-form-item>
            <h5 class="bg-gray-100 p-3 rounded mb-5">结算设置</h5>
            <el-form-item label="结算时间">
                <div>
                    <el-input v-model="form.settlement_days" type="number" placeholder="结算时间">
                        <template #prepend>订单完成后</template>
                        <template #append>天</template>
                    </el-input>
                    <small class="text-gray-500 flex mt-1">预估佣金结算后无法进行回收,请谨慎设置结算天数</small>
                </div>
            </el-form-item>
            <el-form-item label="佣金到账方式">
                <div>
                    <el-radio-group v-model="form.brokerage_method">
                        <el-radio label="hand" border>手动到账</el-radio>
                        <el-radio label="wx" border>自动到微信零钱</el-radio>
                    </el-radio-group>
                    <small class="text-gray-500 flex mt-1"
                        >佣金到账方式支持线下转账和微信零钱自动转账,手动转账更安全,自动转账更方便</small
                    >
                </div>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<style scoped></style>
