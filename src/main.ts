import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'
import pinia from '@/store'
import '@/router/permission.ts'

import 'virtual:uno.css'
import '@unocss/reset/tailwind.css'
import 'element-plus/dist/index.css'
import 'nprogress/nprogress.css'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.use(router)
app.use(pinia)
app.mount('#app')
