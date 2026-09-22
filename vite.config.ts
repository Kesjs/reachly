import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'

// Reachly — dashboard TanStack Start, adapté depuis Reflet
export default defineConfig({
  plugins: [
    viteTsConfigPaths({ projects: ['./tsconfig.json'] }),
    // tanstackStart() intègre et gère Nitro en interne, DOIT venir avant viteReact()
    tanstackStart({
      server: {
        preset: 'vercel'
      }
    }),
    viteReact(),
  ],
  optimizeDeps: {
    exclude: ['puppeteer-core'],
  },
})
