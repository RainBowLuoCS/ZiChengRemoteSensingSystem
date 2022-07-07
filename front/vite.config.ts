import { defineConfig } from 'vite'
import { svgBuilder } from './src/plugins/svgBuilder'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgBuilder('./src/assets/svg/')],
  envDir: './src/env'
})
