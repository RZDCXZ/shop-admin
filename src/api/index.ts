import request from '@/utils/request.ts'

export type PanelItem = {
    title: string
    value: number
    unit: string
    uintColor: string
    subTitle: string
    subValue: number | string
    subUnit: string
}

interface Statistics1Result {
    panels: Array<PanelItem>
}

interface Statistics2Result {
    goods: Array<{
        label: string
        value: number
    }>
    order: Array<{
        label: string
        value: number
    }>
}

interface Statistics3Result {
    x: Array<string>
    y: Array<number>
}

export const getStatistics1Api = () =>
    request<Statistics1Result>({
        url: '/admin/statistics1',
        method: 'get',
    })

export const getStatistics2Api = () =>
    request<Statistics2Result>({
        url: '/admin/statistics2',
        method: 'get',
    })

export const getStatistics3Api = () =>
    request<Statistics3Result>({
        url: '/admin/statistics3',
        method: 'get',
    })
