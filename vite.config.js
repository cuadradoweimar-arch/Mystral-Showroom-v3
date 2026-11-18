import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

// En desarrollo, /api/* lo atienden las mismas funciones que usa Vercel
// (carpeta api/). Las credenciales del panel se leen de .env.local.
function devApi() {
  return {
    name: 'dev-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const path = (req.url || '').split('?')[0]
        const match = path.match(/^\/api\/([a-z-]+)$/)
        if (!match) return next()
        try {
          const mod = await server.ssrLoadModule(`/api/${match[1]}.js`)
          await mod.default(req, res)
        } catch (error) {
          console.error(error)
          res.statusCode = 404
          res.end('{"error":"No encontrado"}')
        }
      })
      // /vendedor → vendedor.html (como el rewrite de vercel.json)
      server.middlewares.use((req, _res, next) => {
        if (/^\/vendedor\/?(\?.*)?$/.test(req.url || '')) req.url = '/vendedor.html'
        next()
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  for (const key of ['PANEL_USER', 'PANEL_PASSWORD', 'PANEL_NAME', 'SESSION_SECRET', 'DATABASE_URL']) {
    if (env[key] && !process.env[key]) process.env[key] = env[key]
  }
  return {
    plugins: [react(), devApi()],
    build: {
      // Tour360 (three.js) y ProjectsMap (maplibre) pesan ~1 MB cada uno,
      // pero se cargan bajo demanda, no en la primera pantalla.
      chunkSizeWarningLimit: 1100,
      rollupOptions: {
        // Dos páginas independientes: el showroom (público) y el panel
        // de vendedor. El código del panel no viaja en el showroom.
        input: {
          main: resolve(import.meta.dirname, 'index.html'),
          vendedor: resolve(import.meta.dirname, 'vendedor.html'),
        },
      },
    },
  }
})
