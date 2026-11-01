import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function legacyBridgeDevPlugin() {
  return {
    name: '3dlearn-legacy-bridge-dev',
    transformIndexHtml(html: string, context: { path?: string; filename?: string }) {
      const url = context?.path || context?.filename || '';
      if (!/^\/courses\/[^/]+\.html(?:\?.*)?$/.test(url.replace(/\\/g, '/'))) return undefined;
      if (html.includes('data-3dlearn-legacy-bridge')) return undefined;
      const tag = '<script data-3dlearn-legacy-bridge src="/scripts/bridge/legacy-bridge.js"></script>';
      const nextHtml = html.includes('</body>') ? html.replace('</body>', `${tag}</body>`) : `${html}\n${tag}`;
      return { html: nextHtml, tags: [] };
    },
  };
}

function rootRedirectPlugin() {
  return {
    name: '3dlearn-root-redirect',
    configureServer(server: any) {
      server.middlewares.use((req: any, res: any, next: any) => {
        const rawUrl = req.url || '';
        const pathname = rawUrl.split('?')[0];

        const isHtml = () => {
          const ct = res.getHeader('content-type') || '';
          if (typeof ct === 'string' && ct.includes('text/html')) return true;
          if (pathname.endsWith('.html') || rawUrl.includes('.html')) return true;
          if (pathname.startsWith('/app/') && !pathname.split('/').pop()?.includes('.')) return true;
          if (pathname === '/app' || pathname === '/app/') return true;
          if (req.headers?.accept?.includes('text/html')) return true;
          return false;
        };

        const origSetHeader = res.setHeader.bind(res);
        res.setHeader = (name: string, value: any) => {
          if (name.toLowerCase() === 'cache-control') {
            if (isHtml()) {
              return origSetHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
            }
          }
          if (name.toLowerCase() === 'content-type' && typeof value === 'string' && value.includes('text/html')) {
            origSetHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
          }
          return origSetHeader(name, value);
        };

        const origWriteHead = res.writeHead.bind(res);
        res.writeHead = (statusCode: number, ...args: any[]) => {
          let headers: any = null;
          if (args.length === 1 && typeof args[0] === 'object') {
            headers = args[0];
          } else if (args.length >= 2 && typeof args[1] === 'object') {
            headers = args[1];
          }
          if (isHtml()) {
            origSetHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
            if (headers) {
              headers['Cache-Control'] = 'no-store, no-cache, must-revalidate';
              delete headers['cache-control'];
            }
          }
          return origWriteHead(statusCode, ...args);
        };

        if (pathname === '/' || pathname === '/index.html') {
          const search = rawUrl.includes('?') ? rawUrl.slice(rawUrl.indexOf('?')) : '';
          res.writeHead(302, {
            Location: `/app/${search}`,
            'Cache-Control': 'no-store, no-cache, must-revalidate',
          });
          res.end();
          return;
        }

        if (pathname === '/app') {
          const search = rawUrl.includes('?') ? rawUrl.slice(rawUrl.indexOf('?')) : '';
          res.writeHead(302, {
            Location: `/app/${search}`,
            'Cache-Control': 'no-store, no-cache, must-revalidate',
          });
          res.end();
          return;
        }

        // SPA fallback for all subroutes under /app/ (e.g. /app/lesson/:slug)
        if (pathname.startsWith('/app/') && !pathname.split('/').pop()?.includes('.')) {
          req.url = '/app/index.html';
        }

        if (isHtml()) {
          origSetHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
        }

        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), legacyBridgeDevPlugin(), rootRedirectPlugin()],
  resolve: {
    alias: {
      'three/addons/': path.resolve(__dirname, 'node_modules/three/examples/jsm/') + '/',
      'three': path.resolve(__dirname, 'node_modules/three/build/three.module.js'),
    },
  },
  optimizeDeps: {
    include: ['three'],
  },
  // The HTML entry is published below /app/, while hashed bundles live at
  // /assets/ so the reverse proxy can serve them independently of the SPA
  // fallback. Runtime assets are staged separately by stage-release.mjs.
  base: '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  assetsDir: 'assets',
    rollupOptions: {
      input: 'app/index.html',
    },
  },
});
