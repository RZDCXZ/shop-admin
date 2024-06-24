// uno.config.ts
import { defineConfig } from 'unocss'
import presetUno from '@unocss/preset-uno'
import { presetGrid } from 'unocss-preset-grid'
import { breakpoints } from './src/constant/config'

export default defineConfig({
    shortcuts: {
        'flex-center': 'flex items-center justify-center',
        'wh-full': 'w-full h-full',
    },
    theme: {
        breakpoints: breakpoints,
    },
    presets: [
        presetUno(),
        presetGrid({
            gutter: '0',
        }),
    ],
})
