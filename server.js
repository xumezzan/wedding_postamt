const fs = require('fs');
const http = require('http');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const INDEX_FILE = 'Приглашение Егор и Анна.html';

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.jsx': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.ico': 'image/x-icon',
  '.mp3': 'audio/mpeg'
};

function send(res, status, body, type = 'text/plain; charset=utf-8') {
  res.writeHead(status, {
    'Content-Type': type,
    'Cache-Control': status === 200 ? 'public, max-age=3600' : 'no-store'
  });
  res.end(body);
}

function resolveRequestPath(reqUrl) {
  const url = new URL(reqUrl, `http://localhost:${PORT}`);
  let pathname = decodeURIComponent(url.pathname);

  if (pathname === '/') pathname = `/${INDEX_FILE}`;
  if (pathname === '/healthz') return { health: true };

  const relative = path.normalize(pathname.replace(/^\/+/, ''));
  if (
    relative.startsWith('..') ||
    path.isAbsolute(relative) ||
    relative.startsWith('.git')
  ) {
    return null;
  }

  return path.join(ROOT, relative);
}

const server = http.createServer((req, res) => {
  if (!['GET', 'HEAD'].includes(req.method)) {
    send(res, 405, 'Method Not Allowed');
    return;
  }

  const target = resolveRequestPath(req.url);
  if (!target) {
    send(res, 403, 'Forbidden');
    return;
  }

  if (target.health) {
    send(res, 200, 'ok');
    return;
  }

  fs.stat(target, (statError, stats) => {
    if (statError || !stats.isFile()) {
      send(res, 404, 'Not Found');
      return;
    }

    const ext = path.extname(target).toLowerCase();
    const type = contentTypes[ext] || 'application/octet-stream';
    res.writeHead(200, {
      'Content-Type': type,
      'Content-Length': stats.size,
      'Cache-Control': ext === '.html' ? 'no-store' : 'public, max-age=31536000, immutable'
    });

    if (req.method === 'HEAD') {
      res.end();
      return;
    }

    fs.createReadStream(target).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`Wedding invitation server listening on port ${PORT}`);
});
