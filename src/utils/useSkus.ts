import { nextTick, ref } from 'vue'
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
import { useArrayMoveUp, useArrayMoveDown } from '@/utils/tools.ts'
import { ElInput } from 'element-plus'

export const goodsId = ref(0)

export const skus_card_list = ref<GoodsDetailResult['goodsSkusCard']>([])

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
}

export const deleteGoodsSkusCard = async (item: GoodsDetailResult['goodsSkusCard'][0]) => {
    item.loading = true
    await deleteGoodsSkusCardApi(item.id)
    const i = skus_card_list.value.findIndex((o) => o.id === item.id)
    if (i !== -1) {
        skus_card_list.value.splice(i, 1)
    }
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
