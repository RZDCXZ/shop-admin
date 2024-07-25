<script setup lang="ts">
import { getSysconfigApi, editSysconfigApi } from '@/api/sysconfig.ts'
import { ref } from 'vue'
import { ElNotification } from 'element-plus'

const loading = ref(false)

const form = ref<any>({
    open_reg: 1,
    reg_method: 'username',
    password_min: 7,
    password_encrypt: [],
    upload_method: 'oss',
    upload_config: {
        Bucket: '',
        http: '',
        ACCESS_KEY: '',
        SECRET_KEY: '',
    },
    api_safe: 1,
    api_secret: '',
})

const activeName = ref('first')

const getData = async () => {
    loading.value = true
    const result = await getSysconfigApi().finally(() => (loading.value = false))
    for (const k in form.value) {
        form.value[k] = (result.data as any)[k]
    }
    form.value.password_encrypt = form.value.password_encrypt.split(',')
}

const onSubmit = async () => {
    loading.value = true
    await editSysconfigApi({
        ...form.value,
        password_encrypt: form.value.password_encrypt.join(','),
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
            <el-tabs v-model="activeName">
                <el-tab-pane label="注册与访问" name="first">
                    <el-form-item label="是否允许注册会员">
                        <el-radio-group v-model="form.open_reg">
                            <el-radio :label="0" border>关闭</el-radio>
                            <el-radio :label="1" border>开启</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="注册类型">
                        <el-radio-group v-model="form.reg_method">
                            <el-radio label="username" border>普通注册</el-radio>
                            <el-radio label="phone" border>手机</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="密码最小长度">
                        <el-input v-model="form.password_min" type="number" placeholder="密码最小长度"></el-input>
                    </el-form-item>
                    <el-form-item label="强制密码复杂度">
                        <el-checkbox-group v-model="form.password_encrypt">
                            <el-checkbox label="0" border>数字</el-checkbox>
                            <el-checkbox label="1" border>小写字母</el-checkbox>
                            <el-checkbox label="2" border>大写字母</el-checkbox>
                            <el-checkbox label="3" border>符号</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="上传设置" name="second">
                    <el-form-item label="上传设置">
                        <el-radio-group v-model="form.upload_method">
                            <el-radio label="oss" border>对象存储</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="Bucket">
                        <el-input v-model="form.upload_config.Bucket" placeholder="Bucket"></el-input>
                    </el-form-item>
                    <el-form-item label="ACCESS_KEY">
                        <el-input v-model="form.upload_config.ACCESS_KEY" placeholder="ACCESS_KEY"></el-input>
                    </el-form-item>
                    <el-form-item label="SECRET_KEY">
                        <el-input v-model="form.upload_config.SECRET_KEY" placeholder="SECRET_KEY"></el-input>
                    </el-form-item>
                    <el-form-item label="空间域名">
                        <el-input v-model="form.upload_config.http" placeholder="空间域名"> </el-input>
                        <small class="text-gray-500 flex mt-1">请补全http://或https://</small>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="Api安全" name="third">
                    <el-form-item label="是否开启Api安全">
                        <el-radio-group v-model="form.api_safe">
                            <el-radio :label="1" border>是</el-radio>
                            <el-radio :label="0" border>否</el-radio>
                            <small class="text-gray-500 flex mt-1">api安全功能开启后调用前端api需要传输签名串</small>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="密钥">
                        <el-input v-model="form.api_safe" placeholder="密钥"> </el-input>
                        <small class="text-gray-500 flex mt-1"
                            >密钥设置关系系统中api调用传输签名串的编码规则,以及会员token解析,请慎重设置,注意设置之后对应会员要求重新登录获取token</small
                        >
                    </el-form-item>
                </el-tab-pane>
            </el-tabs>
            <el-button type="primary" @click="onSubmit">保存</el-button>
        </el-form>
    </div>
</template>

<style scoped></style>
