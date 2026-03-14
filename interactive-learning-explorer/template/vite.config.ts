import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'
import checker from 'vite-plugin-checker'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    viteSingleFile(),
    checker({ typescript: true }),
  ],
  build: {
    cssCodeSplit: false,
    assetsInlineLimit: 100000000,
  }
})
