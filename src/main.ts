import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'
import pinia from '@/store'
import '@/router/permission.ts'
import permission from '@/directives/permission.ts'
import 'default-passive-events' // 解决chrome警告

import 'element-plus/dist/index.css'
import 'nprogress/nprogress.css'
import 'animate.css'
import 'virtual:uno.css'
import '@unocss/reset/tailwind.css'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.use(router)
app.use(pinia)
app.use(permission)
app.mount('#app')
