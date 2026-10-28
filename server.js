const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.wasm': 'application/wasm',
  '.basis': 'application/octet-stream',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

const server = http.createServer((req, res) => {
  // CORS & Security headers for WebGL / Basis Web Workers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  // Redirect /chapters to root /
  if (pathname.startsWith('/chapters')) {
    res.writeHead(302, { Location: '/' });
    res.end();
    return;
  }

  // Redirect /chapter, /chapter/4 to /page
  if (pathname.startsWith('/chapter')) {
    res.writeHead(302, { Location: '/page' });
    res.end();
    return;
  }

  // Redirect /legal to root /
  if (pathname.startsWith('/legal')) {
    res.writeHead(302, { Location: '/' });
    res.end();
    return;
  }

  // Redirect /about to root /
  if (pathname.startsWith('/about')) {
    res.writeHead(302, { Location: '/' });
    res.end();
    return;
  }

  // Normalize path
  let safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  let filePath = path.join(ROOT, safePath);

  // Check if target is a directory or route without extension
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    const indexPath = path.join(filePath, 'index.html');
    if (fs.existsSync(indexPath)) {
      filePath = indexPath;
    }
  } else if (!fs.existsSync(filePath)) {
    // If request has a file extension (like .basis, .png, .js, etc.) and is missing, return 404!
    const ext = path.extname(filePath);
    if (ext && ext !== '.html') {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    // Try appending .html or checking directory index.html
    if (fs.existsSync(filePath + '.html')) {
      filePath = filePath + '.html';
    } else {
      const dirIndex = path.join(filePath, 'index.html');
      if (fs.existsSync(dirIndex)) {
        filePath = dirIndex;
      } else {
        // Fallback to root index.html for SPA client-side routes
        filePath = path.join(ROOT, 'index.html');
      }
    }
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': stats.size,
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });

    const readStream = fs.createReadStream(filePath);
    readStream.pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`\n========================================`);
  console.log(`🚀 Tifa Birthday Comic is running!`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`📁 Root: ${ROOT}`);
  console.log(`========================================\n`);
});
