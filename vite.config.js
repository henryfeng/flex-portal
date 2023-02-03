import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  base: "./",
  server: {
    port: 5511,
    hmr: {
      overlay: false
    },
    proxy: {
      '/data/service/unity-portal': {
        target: 'http://localhost:8801/unity-portal/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/data\/service\/unity-portal/, '')
      },
      '/data/service/codeless': {
        target: 'http://localhost:8800/codeless/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/data\/service\/codeless/, '')
      },
      '/flex-dashboard': {
        target: 'http://localhost:8801/unity-portal/',
        headers: {
          "owners": "xxxxx,ttttttt,1000310005,e0073494,1000310304"
        },
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/flex-dashboard/, '')
      },
      '/flex-data': {
        target: 'http://localhost:8800/codeless/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/flex-data/, '/api/')
      }
    }
  }
})
