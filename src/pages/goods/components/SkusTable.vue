<script setup lang="ts">
import { initSkusTable } from '@/utils/useSkus.ts'

const { skusLables, tableThs, skus_list } = initSkusTable()
</script>

<template>
    <div>
        <el-form-item label="规格设置">
            <table class="border">
                <thead>
                    <tr>
                        <th
                            v-for="(th, index) in tableThs"
                            :key="index"
                            :rowspan="th.rowspan"
                            :colspan="th.colspan"
                            :width="th.width"
                            class="border"
                        >
                            {{ th.name }}
                        </th>
                    </tr>
                    <tr>
                        <th v-for="(th, index) in skusLables" :key="index" class="border">{{ th.name }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in skus_list" :key="index">
                        <td v-for="(sku, skuI) in item.skus" :key="skuI" class="border text-center">{{ sku.value }}</td>
                        <td class="border">
                            <el-input v-model="item.pprice" size="small" type="number"></el-input>
                        </td>
                        <td class="border">
                            <el-input v-model="item.oprice" size="small" type="number"></el-input>
                        </td>
                        <td class="border">
                            <el-input v-model="item.cprice" size="small" type="number"></el-input>
                        </td>
                        <td class="border">
                            <el-input v-model="item.stock" size="small" type="number"></el-input>
                        </td>
                        <td class="border">
                            <el-input v-model="item.volumn" size="small" type="number"></el-input>
                        </td>
                        <td class="border">
                            <el-input v-model="item.weight" size="small" type="number"></el-input>
                        </td>
                        <td class="border">
                            <el-input v-model="item.code" size="small"></el-input>
                        </td>
                    </tr>
                </tbody>
            </table>
        </el-form-item>
    </div>
</template>

<style scoped></style>
