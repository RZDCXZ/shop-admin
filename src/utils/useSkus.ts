import { computed, nextTick, ref } from 'vue'
import { GoodsDetailResult, SetGoodsSkusCardForm } from '@/api/goods.ts'
import {
    addGoodsSkusCardApi,
    editGoodsSkusCardApi,
    deleteGoodsSkusCardApi,
    addGoodsSkusCardValueApi,
    sortGoodsSkusCardApi,
    editGoodsSkusCardValueApi,
    deleteGoodsSkusCardValueApi,
    setGoodsSkusCardApi,
} from '@/api/goods.ts'
import { useArrayMoveUp, useArrayMoveDown, cartesianProductOf } from '@/utils/tools.ts'
import { ElInput } from 'element-plus'

export const goodsId = ref(0)

export const skus_card_list = ref<GoodsDetailResult['goodsSkusCard']>([])

export const skus_list = ref<GoodsDetailResult['goodsSkus']>([])

export const initSkusCardList = (d: GoodsDetailResult) => {
    skus_card_list.value = d.goodsSkusCard.map((item) => {
        item.text = item.name
        item.loading = false
        item.goodsSkusCardValue.map((v: any) => {
            v.text = v.value || '属性值'
            return v
        })
        return item
    })
    skus_list.value = d.goodsSkus
}

export const btnLoading = ref(false)

export const addGoodsSkusCard = async () => {
    btnLoading.value = true
    const result = await addGoodsSkusCardApi({
        goods_id: goodsId.value,
        name: '规格选项',
        order: 50,
        type: 0,
    }).finally(() => {
        btnLoading.value = false
    })
    skus_card_list.value.push({
        ...result.data,
        text: result.data.name,
        loading: false,
        goodsSkusCardValue: [],
    })
    getTableData()
}

export const editGoodsSkusCard = async (item: GoodsDetailResult['goodsSkusCard'][0]) => {
    item.loading = true
    await editGoodsSkusCardApi(item.id, {
        goods_id: item.goods_id,
        name: item.text,
        order: item.order,
        type: 0,
    })
        .catch(() => (item.text = item.name))
        .finally(() => (item.loading = false))
    item.name = item.text
    getTableData()
}

export const deleteGoodsSkusCard = async (item: GoodsDetailResult['goodsSkusCard'][0]) => {
    item.loading = true
    await deleteGoodsSkusCardApi(item.id)
    const i = skus_card_list.value.findIndex((o) => o.id === item.id)
    if (i !== -1) {
        skus_card_list.value.splice(i, 1)
    }
    getTableData()
}

export const bodyLoading = ref(false)

export const sortCard = async (action: 'up' | 'down', index: number) => {
    const oList = JSON.parse(JSON.stringify(skus_card_list.value))
    const func = action === 'up' ? useArrayMoveUp : useArrayMoveDown
    func(oList, index)
    const sortData = oList.map((o: any, i: number) => {
        return {
            id: o.id,
            order: i + 1,
        }
    })
    bodyLoading.value = false
    await sortGoodsSkusCardApi(sortData).finally(() => {
        bodyLoading.value = false
    })
    func(skus_card_list.value, index)
    getTableData()
}

export const setGoodsSkusCard = async (id: number, data: SetGoodsSkusCardForm) => {
    const item = skus_card_list.value.find((o) => o.id === id)
    item.loading = true
    const result = await setGoodsSkusCardApi(id, data).finally(() => (item.loading = false))
    item.name = item.text = result.data.goods_skus_card.name
    item.goodsSkusCardValue = result.data.goods_skus_card_value.map((o: any) => {
        o.text = o.value || '属性值'
        return o
    })
    getTableData()
}

export const initSkusCardItem = (id: number) => {
    const item = skus_card_list.value.find((o) => o.id === id)

    const inputValue = ref('')
    const inputVisible = ref(false)
    const InputRef = ref<InstanceType<typeof ElInput>>()

    const handleClose = async (tag: any) => {
        loading.value = true
        await deleteGoodsSkusCardValueApi(tag.id).finally(() => (loading.value = false))
        const i = item.goodsSkusCardValue.findIndex((o: any) => o.id === tag.id)
        if (i !== -1) {
            item.goodsSkusCardValue.splice(i, 1)
        }
        getTableData()
    }

    const showInput = () => {
        inputVisible.value = true
        nextTick(() => {
            InputRef.value!.input!.focus()
        })
    }

    const loading = ref(false)
    const handleInputConfirm = async () => {
        if (!inputValue.value) {
            inputVisible.value = false
            return
        }
        loading.value = true
        const result = await addGoodsSkusCardValueApi({
            goods_skus_card_id: id,
            name: item.name,
            order: 50,
            value: inputValue.value,
        }).finally(() => {
            inputVisible.value = false
            inputValue.value = ''
            loading.value = false
        })
        item.goodsSkusCardValue.push({
            ...result.data,
            text: result.data.value,
        })
    }

    const onTextChange = async (value: string, tag: any) => {
        loading.value = true
        await editGoodsSkusCardValueApi(tag.id, {
            goods_skus_card_id: id,
            name: item.name,
            order: tag.order,
            value: value,
        })
            .finally(() => {
                loading.value = false
            })
            .catch(() => {
                tag.text = tag.value
            })
        tag.value = value
    }

    return {
        item,
        inputValue,
        inputVisible,
        InputRef,
        handleClose,
        showInput,
        handleInputConfirm,
        loading,
        onTextChange,
    }
}

export const initSkusTable = () => {
    const skusLables = computed(() => skus_card_list.value.filter((v) => v.goodsSkusCardValue.length > 0))

    const tableThs = computed(() => {
        const length = skusLables.value.length

        return [
            {
                name: '商品规格',
                colspan: length,
                width: '',
                rowspan: length > 0 ? 1 : 2,
            },
            {
                name: '销售价',
                width: '80',
                rowspan: 2,
            },
            {
                name: '市场价',
                width: '80',
                rowspan: 2,
            },
            {
                name: '成本价',
                width: '80',
                rowspan: 2,
            },
            {
                name: '库存',
                width: '80',
                rowspan: 2,
            },
            {
                name: '体积',
                width: '80',
                rowspan: 2,
            },
            {
                name: '重量',
                width: '80',
                rowspan: 2,
            },
            {
                name: '编码',
                width: '80',
                rowspan: 2,
            },
        ]
    })

    return {
        skusLables,
        tableThs,
        skus_list,
    }
}

export const getTableData = () => {
    setTimeout(() => {
        if (skus_card_list.value.length === 0) return []

        const list: any[] = []

        skus_card_list.value.forEach((o) => {
            if (o.goodsSkusCardValue && o.goodsSkusCardValue.length > 0) {
                list.push(o.goodsSkusCardValue)
            }
        })

        if (list.length === 0) {
            return []
        }

        const arr = cartesianProductOf(...list) as any[]

        const beforeSkuList = JSON.parse(JSON.stringify(skus_list.value)).map((o: any) => {
            // o.skusId = '290-282'
            if (!Array.isArray(o.skus)) {
                o.skus = Object.keys(o.skus).map((k) => o.skus[k])
            }
            o.skus
                .sort((a: any, b: any) => a.id - b.id)
                .map((s: any) => s.id)
                .join(',')

            return o
        })

        skus_list.value = []

        skus_list.value = arr.map((skus: any) => {
            const o = getBeforeSkuItem(JSON.parse(JSON.stringify(skus)), beforeSkuList)
            return {
                code: o?.code || '',
                cprice: o?.cprice || 0,
                goods_id: goodsId.value,
                image: o?.image || '',
                pprice: o?.pprice || 0,
                oprice: o?.oprice || 0,
                skus,
                stock: o?.stock || 0,
                volumn: o?.volumn || 0,
                weight: o?.weight || 0,
            }
        })
    }, 200)
}

const getBeforeSkuItem = (skus: any, beforeSkuList: any) => {
    const skusId = skus
        .sort((a: any, b: any) => a.id - b.id)
        .map((s: any) => s.id)
        .join(',')

    return beforeSkuList.find((o: any) => {
        if (skus.length > o.skus.legth) {
            return skusId.indexOf(o.skusId) !== -1
        }
        return o.skusId.indexOf(skusId) !== -1
    })
}
