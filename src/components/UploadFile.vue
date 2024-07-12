<script setup lang="ts">
import { UploadFilled } from '@element-plus/icons-vue'
import { uploadImageAction } from '@/api/image.ts'
import { getToken } from '@/utils/auth.ts'
import { UploadFiles, UploadFile, ElNotification } from 'element-plus'

defineProps<{
    data: object
}>()

const token = getToken()

const emits = defineEmits(['success'])

const onUploadSuccess = (response: any, uploadFile: UploadFile, uploadFiles: UploadFiles) => {
    console.log(response)
    emits('success', {
        response,
        uploadFile,
        uploadFiles,
    })
}

const onUploadError = (error: Error) => {
    const msg = JSON.parse(error.message).msg || '上传失败'
    console.error(msg)
    ElNotification({
        type: 'error',
        message: msg,
        duration: 2000,
    })
}
</script>

<template>
    <div>
        <el-upload
            :action="uploadImageAction"
            multiple
            drag
            :headers="{
                token,
            }"
            name="img"
            :data="data"
            :on-success="onUploadSuccess"
            :on-error="onUploadError"
        >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">拖动文件到这或<em>点击上传</em></div>
            <template #tip>
                <div class="el-upload__tip text-center">请上传jpg/png文件且小于500kx</div>
            </template>
        </el-upload>
    </div>
</template>

<style scoped></style>
