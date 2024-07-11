import { App } from 'vue'
import { useUserStore } from '@/store/user.ts'
import { storeToRefs } from 'pinia'

const hasPermission = (value: string[], el: HTMLElement) => {
    if (!Array.isArray(value)) {
        throw new Error('需要配置权限,格式例如 v-permission="[getStatistics1,GET]"')
    }

    const { userInfo } = storeToRefs(useUserStore())

    const hasAuth = value.findIndex((v) => userInfo.value?.ruleNames?.includes(v)) !== -1

    if (el && !hasAuth) {
        el.parentNode && el.parentNode.removeChild(el)
    }

    return hasAuth
}

export default {
    install(app: App) {
        app.directive('permission', {
            mounted(el, binding) {
                hasPermission(binding.value, el)
            },
        })
    },
}
