/**
 * Dev & Preview Server for CalcWeb (Supports Clean SEO Routes & SSG Fallback)
 */

import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const PORT = process.env.PORT || 3000;
const ROOT = process.cwd();

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

const server = http.createServer((req, res) => {
  const urlObj = new URL(req.url, `http://${req.headers.host}`);
  let pathname = decodeURIComponent(urlObj.pathname);

  let filePath = path.join(ROOT, pathname);

  // If directory, look for index.html inside it
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, "index.html");
  }

  // If clean route doesn't exist as a file, fallback to root index.html
  if (!fs.existsSync(filePath)) {
    filePath = path.join(ROOT, "index.html");
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || "application/octet-stream";

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Error interno del servidor");
      return;
    }
    res.writeHead(200, { "Content-Type": contentType });
    res.end(content);
  });
});

server.listen(PORT, () => {
  console.log(`CalcWeb ejecutándose en http://localhost:${PORT}`);
  console.log(`Rutas limpias activas:`);
  console.log(`  - http://localhost:${PORT}/`);
  console.log(`  - http://localhost:${PORT}/transformada-fourier`);
  console.log(`  - http://localhost:${PORT}/transformada-laplace`);
  console.log(`  - http://localhost:${PORT}/transformada-z`);
  console.log(`  - http://localhost:${PORT}/convolucion`);
  console.log(`  - http://localhost:${PORT}/ecuaciones-diferenciales`);
  console.log(`  - http://localhost:${PORT}/integrales-paso-a-paso`);
  console.log(`  - http://localhost:${PORT}/series-taylor`);
  console.log(`  - http://localhost:${PORT}/diagonalizacion-matrices`);
  console.log(`  - http://localhost:${PORT}/sistemas-ecuaciones-gauss`);
  console.log(`  - http://localhost:${PORT}/calculadora-fasores-complejos`);
});
