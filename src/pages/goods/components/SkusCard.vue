<script setup lang="ts">
import { Bottom, Delete, More, Top } from '@element-plus/icons-vue'
import SkusCardItem from '@/pages/goods/components/SkusCardItem.vue'
import {
    skus_card_list,
    addGoodsSkusCard,
    btnLoading,
    editGoodsSkusCard,
    deleteGoodsSkusCard,
    sortCard,
    bodyLoading,
    setGoodsSkusCard,
} from '@/utils/useSkus.ts'
import ChoiceSkus from '@/components/ChoiceSkus.vue'
import { GoodsDetailResult } from '@/api/goods.ts'
import { ref } from 'vue'

const choiceSkusRef = ref<InstanceType<typeof ChoiceSkus>>()

const onChoiceSkus = (item: GoodsDetailResult['goodsSkusCard'][0]) => {
    choiceSkusRef.value?.open((value: any) => {
        setGoodsSkusCard(item.id, {
            name: value.name,
            value: value.list,
        })
    })
}
</script>

<template>
    <div>
        <el-form-item v-loading="bodyLoading" label="规格选项">
            <el-card
                v-for="(item, index) in skus_card_list"
                :key="index"
                v-loading="item.loading"
                shadow="never"
                class="w-full mb-3 !border-none"
            >
                <template #header>
                    <div class="flex items-center">
                        <el-input
                            v-model="item.text"
                            placeholder="规格名称"
                            class="!w-200px"
                            @change="editGoodsSkusCard(item)"
                        >
                            <template #append>
                                <el-icon class="cursor-pointer" @click="onChoiceSkus(item)"><More></More></el-icon>
                            </template>
                        </el-input>
                        <el-button :disabled="index === 0" class="ml-auto" size="small" @click="sortCard('up', index)"
                            ><el-icon><Top></Top></el-icon
                        ></el-button>
                        <el-button
                            :disabled="index === skus_card_list.length - 1"
                            size="small"
                            @click="sortCard('down', index)"
                            ><el-icon><Bottom></Bottom></el-icon
                        ></el-button>
                        <el-popconfirm
                            title="确定删除吗?"
                            confirm-button-text="确定"
                            cancel-button-text="取消"
                            @confirm="deleteGoodsSkusCard(item)"
                        >
                            <template #reference>
                                <el-button size="small"
                                    ><el-icon><Delete></Delete></el-icon
                                ></el-button>
                            </template>
                        </el-popconfirm>
                    </div>
                </template>
                <SkusCardItem :skus-card-id="item.id"></SkusCardItem>
            </el-card>
            <el-button type="success" size="small" :loading="btnLoading" @click="addGoodsSkusCard">添加规格</el-button>
        </el-form-item>
        <ChoiceSkus ref="choiceSkusRef"></ChoiceSkus>
    </div>
</template>

<style scoped>
:deep(.el-card__header) {
    padding: 0;
    border-bottom: none;
}
</style>
