import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    base: '/',
    build: {
      outDir: 'docs',
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes("node_modules")) return undefined;

            if (id.includes("react-dom") || id.includes("react-router-dom") || id.includes("\\react\\") || id.includes("/react/")) {
              return "react-vendor";
            }

            if (id.includes("framer-motion") || id.includes("\\motion\\") || id.includes("/motion/")) {
              return "motion-vendor";
            }

            if (id.includes("lucide-react")) {
              return "icons-vendor";
            }

            if (id.includes("@tanstack/react-virtual")) {
              return "virtual-vendor";
            }

            if (id.includes("@base-ui/react")) {
              return "base-ui-vendor";
            }

            return undefined;
          },
        },
      },
    },
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
