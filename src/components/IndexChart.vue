<script setup lang="ts">
import { getStatistics3Api, Statistics3QueryType } from '@/api'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import * as echarts from 'echarts'
import { EChartsType } from 'echarts'
import { useResizeObserver } from '@vueuse/core'

const current = ref(Statistics3QueryType.week)

const options = ref([
    { label: '近一月', value: Statistics3QueryType.month },
    { label: '近一周', value: Statistics3QueryType.week },
    { label: '近24小时', value: Statistics3QueryType.hour },
])

const onCheckTagChange = (value: Statistics3QueryType) => {
    current.value = value
    getData()
}

let myChart: EChartsType

let chartOption = ref<any>({
    xAxis: {
        type: 'category',
        data: [],
    },
    yAxis: {
        type: 'value',
    },
    series: [
        {
            data: [],
            type: 'bar',
        },
    ],
})

const getData = () => {
    myChart.showLoading()
    getStatistics3Api(current.value)
        .then((res) => {
            chartOption.value.xAxis.data = res.data.x
            chartOption.value.series[0].data = res.data.y
            myChart.setOption(chartOption.value)
        })
        .finally(() => myChart.hideLoading())
}

const chartRef = ref<InstanceType<typeof HTMLDivElement>>()

useResizeObserver(chartRef, () => myChart.resize())

onMounted(() => {
    const chartDom = document.getElementById('chart')
    myChart = echarts.init(chartDom)

    getData()
})

// 关闭页面前销毁chart示例防止白屏
onBeforeUnmount(() => myChart && echarts.dispose(myChart))
</script>

<template>
    <el-card shadow="never">
        <template #header>
            <div class="flex justify-between items-center">
                <span class="text-sm">订单统计</span>
                <div>
                    <el-check-tag
                        v-for="(item, index) in options"
                        :key="index"
                        :checked="item.value === current"
                        class="mx-1"
                        @change="onCheckTagChange(item.value)"
                        >{{ item.label }}</el-check-tag
                    >
                </div>
            </div>
        </template>
        <div id="chart" ref="chartRef" class="w-full h-300px"></div>
    </el-card>
</template>

<style scoped></style>
