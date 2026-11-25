import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  server: {
    // En desarrollo el front (5173) y la API (5000) quedan en el mismo origen, igual que en prod con nginx,
    // así el front puede llamar a /api/... con URLs relativas y sin configurar CORS.
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
})
