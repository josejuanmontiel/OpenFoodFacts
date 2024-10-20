// vite.config.js
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({

  root: path.resolve(__dirname, 'src'),
  resolve: {
    alias: {
      '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
    }
  },
  server: {
    port: 8080,
    hot: true,
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    reportCompressedSize: false,
    // Evitar convertir archivos grandes en base64
    assetsInlineLimit: 0, // No convertir archivos en base64 si son grandes
  },
  watch: {
    usePolling: true, // Para manejar grandes cantidades de archivos en desarrollo
    interval: 1000,   // Intervalo para el polling
  },
});
