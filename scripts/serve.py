#!/usr/bin/env python3
"""Serveur local : sert site/ et renvoie index.html pour les URLs de pages (/jour/3, /logements…)."""
import http.server, os, sys
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "site")
class H(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **k): super().__init__(*a, directory=ROOT, **k)
    def send_head(self):
        path = self.path.split("?")[0].split("#")[0]
        if "." not in os.path.basename(path) and not os.path.isfile(os.path.join(ROOT, path.lstrip("/"))):
            self.path = "/index.html"
        return super().send_head()
    def end_headers(self):
        self.send_header("Cache-Control", "no-cache"); super().end_headers()
port = int(sys.argv[1]) if len(sys.argv) > 1 else 8765
print(f"http://localhost:{port}"); http.server.ThreadingHTTPServer(("", port), H).serve_forever()
