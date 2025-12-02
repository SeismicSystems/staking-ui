import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  base: '/staking/',
  plugins: [react()],
  server: {
    proxy: {
      '/summit': {
        target: 'http://localhost:3030',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/summit/, ''),
      },

    },
  },
})