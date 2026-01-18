import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from '@svgr/rollup';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(async () => {
  const tailwindcss = (await import('@tailwindcss/vite')).default;
  
  return {
    plugins: [
      react(),
      tailwindcss(),
      svgr({ exportType: 'named', namedExport: 'ReactComponent', icon: true }),
    ],
    root: __dirname,
    publicDir: 'public',
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom'],
      force: true,
    },
    resolve: {
      dedupe: ['react', 'react-dom'],
      alias: {
        'react': path.resolve(__dirname, '../../node_modules/react'),
        'react-dom': path.resolve(__dirname, '../../node_modules/react-dom'),
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
      },
    },
    server: {
      port: 4200,
      fs: {
        allow: ['..', '../..'],
      },
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
