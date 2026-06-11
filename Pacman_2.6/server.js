import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, 'public');
const SCORES_FILE = path.join(__dirname, 'scores.json');
const MAX_SCORES = 10;
const PORT = 3021;

const MIME = {
  '.html': 'text/html',
  '.js':   'text/javascript',
  '.css':  'text/css',
  '.png':  'image/png',
  '.ico':  'image/x-icon',
  '.json': 'application/json',
};

function sendJson(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 10_000) {
        req.destroy();
        reject(new Error('Body demasiado grande'));
      }
    });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

function loadScores() {
  try {
    const raw = fs.readFileSync(SCORES_FILE, 'utf8');
    const scores = JSON.parse(raw);
    return Array.isArray(scores) ? scores : [];
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    console.error('No se pudieron leer los puntajes:', err);
    return [];
  }
}

function saveScores(scores) {
  fs.writeFileSync(SCORES_FILE, JSON.stringify(scores, null, 2));
}

function normalizeName(name) {
  return String(name || '')
    .trim()
    .replace(/\s+/g, ' ')
    .slice(0, 14) || 'ANON';
}

function sortScores(scores) {
  return scores
    .filter(item => Number.isFinite(item.score) && item.score >= 0)
    .sort((a, b) => b.score - a.score || new Date(a.date) - new Date(b.date))
    .slice(0, MAX_SCORES);
}

http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

  if (url.pathname === '/api/scores' && req.method === 'GET') {
    sendJson(res, 200, sortScores(loadScores()));
    return;
  }

  if (url.pathname === '/api/scores' && req.method === 'POST') {
    readBody(req)
      .then(body => {
        const payload = JSON.parse(body || '{}');
        const score = Number(payload.score);
        const level = Number(payload.level);

        if (!Number.isFinite(score) || score < 0) {
          sendJson(res, 400, { error: 'Puntaje invalido' });
          return;
        }

        const entry = {
          name: normalizeName(payload.name),
          score: Math.floor(score),
          level: Number.isFinite(level) && level > 0 ? Math.floor(level) : 1,
          date: new Date().toISOString(),
        };

        const scores = sortScores([...loadScores(), entry]);
        saveScores(scores);
        sendJson(res, 201, entry);
      })
      .catch(err => {
        console.error('No se pudo guardar el puntaje:', err);
        sendJson(res, 400, { error: 'No se pudo guardar el puntaje' });
      });
    return;
  }

  const safePath = path.normalize(url.pathname).replace(/^(\.\.[/\\])+/, '');
  const filePath = path.join(PUBLIC_DIR, url.pathname === '/' ? 'index.html' : safePath);
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    res.end('Prohibido');
    return;
  }

  const ext      = path.extname(filePath);
  const type     = MIME[ext] || 'text/plain';

  fs.readFile(filePath, (err, content) => {
    if (err) { res.writeHead(404); res.end('No encontrado'); return; }
    res.writeHead(200, { 'Content-Type': type });
    res.end(content);
  });

}).listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
