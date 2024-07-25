<script setup lang="ts">
import { getSysconfigApi, editSysconfigApi, uploadAction } from '@/api/sysconfig.ts'
import { ref } from 'vue'
import { ElNotification } from 'element-plus'
import FormDrawer from '@/components/FormDrawer.vue'
import { getToken } from '@/utils/auth.ts'
import { isMobile } from '@/utils/tools.ts'

const loading = ref(false)

const form = ref<any>({
    api_secret: '',
    close_order_minute: 30,
    auto_received_day: 7,
    after_sale_day: 23,
    alipay: {
        app_id: '',
        ali_public_key: '',
        private_key: '',
    },
    wxpay: {
        app_id: '',
        miniapp_id: '',
        secret: '',
        appid: '',
        mch_id: '',
        key: '',
        cert_client: '',
        cert_key: '',
    },
    ship: '',
})

const activeName = ref('first')

const tableData = ref([
    {
        name: '支付宝支付',
        desc: '该系统支付即时到账接口',
        src: '/alipay.png',
        key: 'alipay',
    },
    {
        name: '微信支付',
        desc: '该系统支持微信网页支付和扫码支付',
        src: '/wxpay.png',
        key: '/wxpay',
    },
])

const getData = async () => {
    loading.value = true
    const result = await getSysconfigApi().finally(() => (loading.value = false))
    for (const k in form.value) {
        form.value[k] = (result.data as any)[k]
    }
}

const onSubmit = async () => {
    loading.value = true
    await editSysconfigApi(form.value).finally(() => (loading.value = false))
    ElNotification({
        type: 'success',
        message: '修改成功',
        duration: 2000,
    })
    await getData()
}

const drawerRef = ref<InstanceType<typeof FormDrawer>>()

const drawerType = ref('alipay')

const open = (key: string) => {
    drawerType.value = key
    drawerRef.value?.open()
}

const uploadClientSuccess = (response: any) => {
    form.value.wxpay.cert_client = response.data
}

const uploadKeySuccess = (response: any) => {
    form.value.wxpay.cert_key = response.data
}

getData()
</script>

<template>
    <div v-loading="loading" class="bg-white p-4 rounded">
        <el-form :model="form">
            <el-tabs v-model="activeName">
                <el-tab-pane label="支付设置" name="first">
                    <el-table :data="tableData" border stripe>
                        <el-table-column label="支付方式" align="left">
                            <template #default="{ row }">
                                <div class="flex items-center">
                                    <el-image
                                        v-if="!isMobile()"
                                        :src="row.src"
                                        fit="fill"
                                        lazy
                                        class="!w-40px !h-40px rounded mr-2"
                                    ></el-image>
                                    <div>
                                        <h6>{{ row.name }}</h6>
                                        <small class="flex text-gray-500 mt-1">{{ row.desc }}</small>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" align="center">
                            <template #default="{ row }">
                                <el-button type="primary" size="small" text @click="open(row.key)">配置</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="购物设置" name="second">
                    <el-form-item label="未支付订单">
                        <div>
                            <el-input v-model="form.close_order_minute" type="number" placeholder="未支付订单">
                                <template v-if="!isMobile()" #append> 分钟后自动关闭 </template>
                            </el-input>
                            <small class="text-gray-500 flex mt-1"
                                >订单下单未付款,n分钟后自动关闭,设置0不自动关闭</small
                            >
                        </div>
                    </el-form-item>
                    <el-form-item label="已发货订单">
                        <div>
                            <el-input v-model="form.auto_received_day" type="number" placeholder="已发货订单">
                                <template v-if="!isMobile()" #append> 天后自动确认收货 </template>
                            </el-input>
                            <small class="text-gray-500 flex mt-1"
                                >如果在期间未确认收货,系统自动完成收货,设置0不自动收货</small
                            >
                        </div>
                    </el-form-item>
                    <el-form-item label="已完成订单">
                        <div>
                            <el-input v-model="form.after_sale_day" type="number" placeholder="已完成订单">
                                <template v-if="!isMobile()" #append> 天内允许申请售后 </template>
                            </el-input>
                            <small class="text-gray-500 flex mt-1"
                                >订单完成后,用户在n天内可以发起售后申请,设置0不允许申请售后</small
                            >
                        </div>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">保存</el-button>
                    </el-form-item>
                </el-tab-pane>
            </el-tabs>
        </el-form>
        <FormDrawer ref="drawerRef" title="配置" @submit="onSubmit">
            <el-form v-if="drawerType === 'alipay'" :model="form">
                <el-form-item label="app_id">
                    <el-input v-model="form.alipay.app_id" placeholder="app_id"></el-input>
                </el-form-item>
                <el-form-item label="ali_public_key">
                    <el-input
                        v-model="form.alipay.ali_public_key"
                        type="textarea"
                        :row="4"
                        placeholder="ali_public_key"
                    ></el-input>
                </el-form-item>
                <el-form-item label="private_key">
                    <el-input v-model="form.alipay.private_key" placeholder="private_key"></el-input>
                </el-form-item>
            </el-form>
            <el-form v-else :model="form">
                <el-form-item label="公众号 APPID">
                    <el-input v-model="form.wxpay.app_id" placeholder="app_id"></el-input>
                </el-form-item>
                <el-form-item label="小程序 APPID">
                    <el-input v-model="form.wxpay.miniapp_id" placeholder="miniapp_id"></el-input>
                </el-form-item>
                <el-form-item label="小程序 secret">
                    <el-input v-model="form.wxpay.secret" placeholder="secret"></el-input>
                </el-form-item>
                <el-form-item label="appid">
                    <el-input v-model="form.wxpay.appid" placeholder="app_id"></el-input>
                </el-form-item>
                <el-form-item label="商户号">
                    <el-input v-model="form.wxpay.mch_id" placeholder="商户号"></el-input>
                </el-form-item>
                <el-form-item label="APi 密钥">
                    <el-input v-model="form.wxpay.key" placeholder="APi 密钥"></el-input>
                </el-form-item>
                <el-form-item label="cert_client">
                    <el-upload
                        :action="uploadAction"
                        :limit="1"
                        :headers="{
                            token: getToken(),
                        }"
                        accept=".pem"
                        :on-success="uploadClientSuccess"
                    >
                        <el-button type="primary">点击上传</el-button>
                        <template #tip>
                            <p class="text-rose-500">
                                {{ form.wxpay?.cert_client || '还未配置' }}
                            </p>
                            <div class="el-upload__tip">例如: apiclient.cert.pem</div>
                        </template>
                    </el-upload>
                </el-form-item>
                <el-form-item label="cert_key">
                    <el-upload
                        :action="uploadAction"
                        :limit="1"
                        :headers="{
                            token: getToken(),
                        }"
                        accept=".pem"
                        :on-success="uploadKeySuccess"
                    >
                        <el-button type="primary">点击上传</el-button>
                        <template #tip>
                            <p class="text-rose-500">
                                {{ form.wxpay?.cert_key || '还未配置' }}
                            </p>
                            <div class="el-upload__tip">例如: apiclient.key.pem</div>
                        </template>
                    </el-upload>
                </el-form-item>
            </el-form>
        </FormDrawer>
    </div>
</template>

<style scoped></style>
