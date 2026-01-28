import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: {
      // This tells Vite: $lib = the 'src/lib' folder
      '$lib': path.resolve(__dirname, './src/lib')
    }
  }
})
