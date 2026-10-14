import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Tour360 (three.js) y ProjectsMap (maplibre) pesan ~1 MB cada uno,
    // pero se cargan bajo demanda, no en la primera pantalla.
    chunkSizeWarningLimit: 1100,
  },
})
