import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'
import checker from 'vite-plugin-checker'
import tailwindcss from '@tailwindcss/vite'

/** Watches public/dev-data/ and triggers full reload when JSON changes */
function devDataWatcher(): Plugin {
  return {
    name: 'dev-data-watcher',
    configureServer(server) {
      const devDataDir = server.config.root + '/public/dev-data'
      server.watcher.add(devDataDir)
      server.watcher.on('change', (file: string) => {
        if (file.includes('dev-data')) {
          server.ws.send({ type: 'full-reload' })
        }
      })
    }
  }
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    viteSingleFile(),
    checker({ typescript: true }),
    devDataWatcher(),
  ],
  build: {
    cssCodeSplit: false,
    assetsInlineLimit: 100000000,
  }
})
