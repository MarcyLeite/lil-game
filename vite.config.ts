import { defineConfig } from 'vite'
import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

export default defineConfig(({ mode }) => {
    const isLib = mode === 'lib'

    return {
        plugins: [
            vue(),
            ...(isLib
                ? [
                    dts({
                        include: ['src/game/**/*.ts', 'src/BuserGame.vue', 'src/index.ts'],
                        bundleTypes: true,
                    }),
                ]
                : []),
        ],
        ...(isLib
            ? {
                publicDir: false,
                build: {
                    lib: {
                        entry: resolve(__dirname, 'src/index.ts'),
                        name: 'BuserGame',
                        fileName: 'lil-game',
                        formats: ['es'],
                    },
                    rollupOptions: {
                        external: ['vue'],
                        output: { globals: { vue: 'Vue' } },
                    },
                    assetsInlineLimit: Number.MAX_SAFE_INTEGER,
                    cssCodeSplit: false,
                },
            }
            : {}),
    }
})
