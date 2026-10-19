import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig, Plugin} from 'vite';

function assetStatusPlugin(): Plugin {
  return {
    name: 'asset-status-plugin',
    configureServer(server) {
      server.middlewares.use('/api/asset-status', (_req, res) => {
        const qrisPath = path.resolve(__dirname, 'public/assets/qris.png');
        const bouquetPath = path.resolve(__dirname, 'public/assets/bouquet.webp');
        const ambientPath = path.resolve(__dirname, 'public/assets/ambient.mp3');
        res.setHeader('Content-Type', 'application/json');
        res.end(
          JSON.stringify({
            qrisExists: fs.existsSync(qrisPath),
            bouquetExists: fs.existsSync(bouquetPath),
            ambientExists: fs.existsSync(ambientPath),
          }),
        );
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), assetStatusPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
