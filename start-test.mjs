import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { dirname, resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), 'dist');
const port = Number(process.argv[2] || 4173);
// Optional project path lets tests exercise GitHub Pages' /ChatGPT/ mount.
const mount = process.argv[3] || '/';
const types = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.webmanifest':'application/manifest+json','.json':'application/json'};
const server = createServer(async (req,res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (mount !== '/' && pathname === mount.slice(0,-1)) { res.writeHead(308,{'Location':mount}).end(); return; }
    if (!pathname.startsWith(mount)) { res.writeHead(404).end(); return; }
    let file = resolve(root, pathname.slice(mount.length) || '.');
    if (file !== root && !file.startsWith(root + sep)) { res.writeHead(403).end(); return; }
    if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html');
    const bytes = await readFile(file);
    res.writeHead(200, {'Content-Type': types[extname(file)] || 'application/octet-stream', 'Cache-Control':'no-store'});
    res.end(bytes);
  } catch { res.writeHead(404).end('Filen finnes ikke.'); }
});
server.on('error', err => { console.error('Kunne ikke starte serveren:', err.message); process.exitCode=1; });
server.listen(port, '127.0.0.1', () => {
  console.log('Læringsreisen er klar! Åpne adressen i nettleseren:');
  console.log('http://localhost:' + port + mount);
  console.log('La terminalen stå åpen. Avslutt med Ctrl+C.');
});
