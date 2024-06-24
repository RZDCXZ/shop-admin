import NProgress from 'nprogress'
import { breakpoints } from '@/constant/config.ts'

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
    if (document.body.clientWidth < Number(breakpoints.md.slice(0, -2))) {
        return true
    }
    if (document.body.clientWidth > Number(breakpoints.md.slice(0, -2))) {
        return false
    }
}
