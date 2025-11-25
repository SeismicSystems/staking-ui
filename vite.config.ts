import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/get_public_keys': {
        target: 'http://localhost:3030',
        changeOrigin: true,
      },
      '/get_deposit_signature': {
        target: 'http://localhost:3030',
        changeOrigin: true,
      },
    },
  },
})
