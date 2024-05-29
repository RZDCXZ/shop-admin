import NProgress from 'nprogress'

export const showProgress = () => {
    NProgress.start()
}

export const hideProgress = () => {
    NProgress.done()
}
