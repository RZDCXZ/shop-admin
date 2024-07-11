// uno.config.ts
import { defineConfig } from 'unocss'
import presetUno from '@unocss/preset-uno'

export default defineConfig({
    shortcuts: {
        'flex-center': 'flex items-center justify-center',
        'wh-full': 'w-full h-full',
    },
    theme: {},
    presets: [presetUno()],
})
