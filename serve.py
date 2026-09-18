#!/usr/bin/env python3
"""Local preview server with Vercel-like clean URL handling (static pages only)."""
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import os

ROOT = Path(__file__).resolve().parent
os.chdir(ROOT)

class CleanURLHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        path = self.path.split('?', 1)[0].split('#', 1)[0]
        if path != '/' and '.' not in Path(path).name and not path.startswith('/api/'):
            candidate = ROOT / (path.lstrip('/') + '.html')
            if candidate.is_file():
                self.path = path + '.html'
        return super().do_GET()

    def send_error(self, code, message=None, explain=None):
        if code == 404:
            page = ROOT / '404.html'
            if page.is_file():
                body = page.read_bytes()
                self.send_response(404)
                self.send_header('Content-Type', 'text/html; charset=utf-8')
                self.send_header('Content-Length', str(len(body)))
                self.end_headers()
                self.wfile.write(body)
                return
        return super().send_error(code, message, explain)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', '8001'))
    server = ThreadingHTTPServer(('0.0.0.0', port), CleanURLHandler)
    print(f'Local preview: http://localhost:{port}')
    print('Note: /api/contact runs only on Vercel; local form uses its email fallback.')
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print('\nStopped.')
