import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      // Trailing slash matters: '/api/' matches real calls like
      // '/api/exams', but does NOT match a file like 'apiClient.js'
      // just because its name happens to start with "api".
      '/api/': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
