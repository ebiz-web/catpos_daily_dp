import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as path from 'node:path';

const REPO_NAME = 'catpos_daily_dp'; 

export default defineConfig({
  base: `/`,
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 3000,
    proxy: {
      '/api': {
        target: process.env.VITE_SERVER_URL,
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  // 빌드 최적화
  build: {
    outDir: 'dist', // 기본 출력 디렉토리
    sourcemap: false, // 프로덕션에서는 소스맵 비활성화
    minify: 'esbuild', // 빠른 빌드를 위해 esbuild 사용
  },
});
