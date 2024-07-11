<script setup lang="ts"></script>

<template>
    <el-main class="relative">
        <div class="absolute top-0 left-0 right-0 bottom-50px overflow-y-scroll">
            <div v-for="i in 100">{{ i }}</div>
        </div>
        <div class="h-50px bg-pink flex-center absolute left-0 right-0 bottom-0">分页区域</div>
    </el-main>
</template>

<style scoped></style>
