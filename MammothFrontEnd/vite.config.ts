import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default ({ mode }) => {
  // Load environment variables based on mode (development or production)
  const env = loadEnv(mode, process.cwd());

  // Update process.env with loaded variables
  Object.assign(process.env, env);

  return defineConfig({
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
          target: process.env.VITE_API_URL || 'http://localhost:8082',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  });
};
