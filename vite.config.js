// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    build: {
        reportCompressedSize: false,
        // Evitar convertir archivos grandes en base64
        assetsInlineLimit: 0, // No convertir archivos en base64 si son grandes
      },
    watch: {
      usePolling: true, // Para manejar grandes cantidades de archivos en desarrollo
      interval: 1000,   // Intervalo para el polling
    },
  },
});
