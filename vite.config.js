import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 6969, // Moved port to the server level
    proxy: {
      '/api': {
        target: 'http://10.10.13.99:8888',
        changeOrigin: true, // Enable to handle CORS by changing the origin
        secure: false, // Disable SSL verification for ngrok
        ws: false // Disable WebSocket proxying if not needed
      }
    }
  }
});

