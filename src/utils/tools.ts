import NProgress from 'nprogress'
import { ElMessageBox } from 'element-plus'

export const showProgress = () => {
    NProgress.start()
}

export const hideProgress = () => {
    NProgress.done()
}

export const refreshWindow = () => {
    window.location.reload()
}

export const isMobile = () => {
    if (document.body.clientWidth < 768) {
        return true
    }
    if (document.body.clientWidth > 768) {
        return false
    }
}

export const showPrompt = (tip: string, value: string = '') => {
    return ElMessageBox.prompt(tip, '', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        inputValue: value,
    })
}

export const showModal = (content: string = '提示内容', type: any = 'warning', title: string = '') => {
    return ElMessageBox.confirm(content, title, {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type,
    })
}

export const useArrayMoveUp = (arr: Array<any>, index: number) => {
    swapArray(arr, index, index - 1)
}

export const useArrayMoveDown = (arr: Array<any>, index: number) => {
    swapArray(arr, index, index + 1)
}

const swapArray = (arr: Array<any>, index1: number, index2: number) => {
    arr[index1] = arr.splice(index2, 1, arr[index1])[0]
    return arr
}

// skus排列算法
export const cartesianProductOf = (...arg: any[]) => {
    return Array.prototype.reduce.call(
        arg,
        (a: any, b: any) => {
            const ret: any[] = []
            a.forEach((a: any) => {
                b.forEach((b: any) => {
                    ret.push(a.concat([b]))
                })
            })
            return ret
        },
        [[]],
    )
}
