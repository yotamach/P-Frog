import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(async () => {
  const tailwindcss = await import('@tailwindcss/vite').then(m => m.default);
  
  return {
    plugins: [react(), tailwindcss()],
    root: path.resolve(__dirname, 'src'),
    publicDir: path.resolve(__dirname, 'src/assets'),
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom'],
    },
    resolve: {
    alias: {
      '@components': path.resolve(__dirname, 'src/components'),
      '@config': path.resolve(__dirname, 'src/config'),
      '@data': path.resolve(__dirname, 'src/data'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@icons': path.resolve(__dirname, 'src/components/atoms/Icons'),
      '@styles': path.resolve(__dirname, 'src/styles'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@state': path.resolve(__dirname, 'src/state'),
      '@types': path.resolve(__dirname, 'src/types'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@p-frog/data': path.resolve(__dirname, '../../libs/data/src'),
    },
  },
  server: {
    port: 4200,
    proxy: {
      '/api': {
        target: 'http://localhost:3333',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: path.resolve(__dirname, '../../dist/apps/p-frog'),
    emptyOutDir: true,
  },
  };
});
