import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    strictPort: true,
    open: true, // Opens the browser automatically
    cors: true, // Enable CORS
    proxy: {
      // Add your proxy configurations here if needed
      // '/api': 'http://localhost:3000'
    }
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
    sourcemap: mode === 'development',
    minify: mode === 'production',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          // Add other vendor chunks as needed
        },
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
  css: {
    devSourcemap: true,
    modules: {
      localsConvention: 'camelCase',
    },
  },
  esbuild: {
    jsxInject: `import React from 'react'`,
    target: 'esnext',
  },
}));
