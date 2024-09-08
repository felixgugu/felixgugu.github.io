import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vuetify({
      styles: {
        configFile: 'src/styles/settings.scss',
      },
    })
  ],
  build: {
    rollupOptions: {
      input: 'index.html',
      // output: {
      //   format: 'iife',
      //   entryFileNames: 'assets/[name].js',
      //   chunkFileNames: 'assets/[name].js',
      //   assetFileNames: 'assets/[name].[ext]'
      // }
    }
  }
})
