/**
 * Simple HTTP server for testing PWA functionality
 * PWA features require HTTPS or localhost
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  // Parse URL
  let filePath = '.' + req.url;
  if (filePath === './') {
    filePath = './index.html';
  }

  // Get file extension
  const extname = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[extname] || 'application/octet-stream';

  // Read and serve file
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        // File not found
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 - File Not Found</h1>', 'utf-8');
      } else {
        // Server error
        res.writeHead(500);
        res.end('Sorry, there was an error: ' + error.code + ' ..\n');
      }
    } else {
      // Success
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   TOOLBEE CAM PWA Server Running!                        ║
║                                                            ║
║   Local:    http://localhost:${PORT}                          ║
║   Network:  http://${getLocalIP()}:${PORT}                       ║
║                                                            ║
║   PWA 기능 테스트:                                        ║
║   1. Chrome/Edge 브라우저로 접속                          ║
║   2. 주소창에 "앱 설치" 버튼 확인                         ║
║   3. F12 > Application > Service Worker 확인              ║
║                                                            ║
║   종료: Ctrl + C                                          ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `);
});

// Get local IP address
function getLocalIP() {
  const os = require('os');
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '127.0.0.1';
}