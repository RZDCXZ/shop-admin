import NProgress from 'nprogress'

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
