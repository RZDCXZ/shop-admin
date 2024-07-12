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
