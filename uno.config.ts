// uno.config.ts
import { defineConfig } from 'unocss'
import presetUno from '@unocss/preset-uno'
import { presetGrid } from 'unocss-preset-grid'

export default defineConfig({
    shortcuts: {
        'flex-center': 'flex items-center justify-center',
        'wh-full': 'w-full h-full',
    },
    presets: [
        presetUno(),
        presetGrid({
            gutter: '0',
        }),
    ],
})
