import { defineConfig, presetIcons, presetUno } from 'unocss'

export default defineConfig({
    presets: [
        presetUno(),
        presetIcons({
            scale: 1.2,
            warn: true,
        }),
    ],
    safelist: [
        'i-ri-folder-3-line',
        'i-ri-file-text-line',
        'i-ri-arrow-go-back-line',
        'i-ri-hard-drive-2-line',
        'i-ri-arrow-right-s-line'
    ]
})
