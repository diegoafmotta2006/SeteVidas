import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base "./" deixa o build portátil: funciona em raiz de domínio,
// em subpastas (ex.: GitHub Pages) e também no `npm run preview`.
export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
  },
});
