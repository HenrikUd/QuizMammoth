import { loadEnv } from 'vite';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react()],
    esbuild: {
      loader: 'tsx',
    },
    root: './',
    build: {
      outDir: 'build',
    },
    optimizeDeps: {
      esbuildOptions: {
        loader: {
          '.js': 'jsx',
          '.ts': 'tsx',
        },
      },
    },
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:8082',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
        '/auth': {
          target: env.VITE_API_URL || 'http://localhost:8082',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/auth/, ''),
        },
        '/profile': {
          target: env.VITE_API_URL || 'http://localhost:8082',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/profile/, ''),
        },
        '/users': {
          target: env.VITE_API_URL || 'http://localhost:8082',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/users/, ''),
        },
      },
    },
  };
});
