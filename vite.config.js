import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // Alias for src folder
    },
  },
  server: {
    port: 5173, // Optional: specify port
    open: true, // Opens browser on dev start
  },
});



