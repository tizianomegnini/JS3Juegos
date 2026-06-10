const http = require('http');
const fs   = require('fs');
const path = require('path');

const MIME = {
  '.html': 'text/html',
  '.js':   'text/javascript',
  '.css':  'text/css',
  '.png':  'image/png',
  '.ico':  'image/x-icon',
};

http.createServer((req, res) => {
  const filePath = './public' + (req.url === '/' ? '/index.html' : req.url);
  const ext      = path.extname(filePath);
  const type     = MIME[ext] || 'text/plain';

  fs.readFile(filePath, (err, content) => {
    if (err) { res.writeHead(404); res.end('No encontrado'); return; }
    res.writeHead(200, { 'Content-Type': type });
    res.end(content);
  });

}).listen(3016, () => console.log('Servidor en http://localhost:3016'));
