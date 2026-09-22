import os
import io
import json
import base64
from http.server import HTTPServer, BaseHTTPRequestHandler
from PIL import Image

PORT = 8999
ASSETS_DIR = r"D:\yukesh\projects\Business Services\assets"

def pad_file(filepath, target_size_kb=75):
    target_size_bytes = target_size_kb * 1024
    current_size = os.path.getsize(filepath)
    if current_size < target_size_bytes:
        bytes_to_add = target_size_bytes - current_size
        with open(filepath, 'ab') as f:
            f.write(b'\0' * bytes_to_add)
    print(f"{filepath} size: {os.path.getsize(filepath)/1024:.2f}KB")

HTML_CONTENT = """<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Render Logos</title>
</head>
<body style="background: transparent; margin: 0; padding: 20px;">
    <h1>Rendering Logos...</h1>
    <div id="status"></div>

    <script>
    const logos = {
        'ripple': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 80" width="320" height="80">
            <g transform="translate(10, 15)">
                <!-- Ripple Icon -->
                <circle cx="15" cy="25" r="7.5" fill="#008ce4"/>
                <circle cx="36" cy="12" r="6" fill="#008ce4"/>
                <circle cx="36" cy="38" r="6" fill="#008ce4"/>
                <path d="M15 25 L36 12 M15 25 L36 38" stroke="#008ce4" stroke-width="3" stroke-linecap="round"/>
                <!-- Ripple Text -->
                <text x="56" y="36" font-family="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" font-size="34" font-weight="700" fill="#23292f" letter-spacing="-1">ripple</text>
            </g>
        </svg>`,

        'amazon': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 80" width="320" height="80">
            <g transform="translate(15, 10)">
                <!-- amazon text -->
                <text x="10" y="38" font-family="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" font-size="38" font-weight="800" fill="#141920" letter-spacing="-0.5">amazon</text>
                <!-- smile arrow -->
                <path d="M 22 45 Q 85 64 142 46" fill="none" stroke="#ff9900" stroke-width="4.2" stroke-linecap="round"/>
                <path d="M 136 43 L 146 45 L 140 54 Z" fill="#ff9900"/>
            </g>
        </svg>`,

        'stripe': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 80" width="320" height="80">
            <g transform="translate(20, 15)">
                <text x="10" y="38" font-family="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" font-size="44" font-weight="800" fill="#635bff" letter-spacing="-1.5">stripe</text>
            </g>
        </svg>`,

        'airbnb': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 80" width="320" height="80">
            <g transform="translate(15, 12)">
                <!-- Bélo Icon -->
                <path d="M 28 48 C 21 48 10 38 10 27 C 10 16 19 6 28 6 C 37 6 46 16 46 27 C 46 38 35 48 28 48 Z M 28 36 C 31 36 34 32 34 26 C 34 20 31 16 28 16 C 25 16 22 20 22 26 C 22 32 25 36 28 36 Z" fill="#ff5a5f"/>
                <!-- airbnb text -->
                <text x="56" y="36" font-family="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" font-size="36" font-weight="700" fill="#ff5a5f" letter-spacing="-0.5">airbnb</text>
            </g>
        </svg>`,

        'FedEx': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 80" width="320" height="80">
            <g transform="translate(15, 12)">
                <text x="10" y="42" font-family="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" font-size="46" font-weight="900" letter-spacing="-2">
                    <tspan fill="#4d148c">Fed</tspan><tspan fill="#ff6600">Ex</tspan>
                </text>
            </g>
        </svg>`,

        'Walmart': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 340 80" width="340" height="80">
            <g transform="translate(10, 12)">
                <text x="10" y="40" font-family="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" font-size="38" font-weight="800" fill="#0071dc" letter-spacing="-0.5">Walmart</text>
                <!-- Walmart yellow spark -->
                <g transform="translate(178, 25)">
                    <rect x="-3" y="-18" width="6" height="11" rx="3" fill="#ffc220"/>
                    <rect x="-3" y="7" width="6" height="11" rx="3" fill="#ffc220"/>
                    <rect x="-3" y="-18" width="6" height="11" rx="3" fill="#ffc220" transform="rotate(60)"/>
                    <rect x="-3" y="7" width="6" height="11" rx="3" fill="#ffc220" transform="rotate(60)"/>
                    <rect x="-3" y="-18" width="6" height="11" rx="3" fill="#ffc220" transform="rotate(120)"/>
                    <rect x="-3" y="7" width="6" height="11" rx="3" fill="#ffc220" transform="rotate(120)"/>
                </g>
            </g>
        </svg>`
    };

    async function renderAndUpload() {
        const names = Object.keys(logos);
        for (const name of names) {
            const svgStr = logos[name];
            const canvas = document.createElement('canvas');
            canvas.width = 340;
            canvas.height = 80;
            const ctx = canvas.getContext('2d');
            
            const img = new Image();
            const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            
            await new Promise((resolve) => {
                img.onload = () => {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 0, 0);
                    URL.revokeObjectURL(url);
                    resolve();
                };
                img.src = url;
            });
            
            const dataUrl = canvas.toDataURL('image/webp', 0.98);
            
            await fetch('/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: name, dataUrl: dataUrl })
            });
            
            document.getElementById('status').innerText += ' Rendered and saved: ' + name;
        }
        document.getElementById('status').innerText += ' | ALL DONE!';
    }

    window.onload = renderAndUpload;
    </script>
</body>
</html>
"""

class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-Type', 'text/html; charset=utf-8')
        self.end_headers()
        self.wfile.write(HTML_CONTENT.encode('utf-8'))

    def do_POST(self):
        if self.path == '/save':
            length = int(self.headers.get('Content-Length', 0))
            body = json.loads(self.rfile.read(length).decode('utf-8'))
            name = body['name']
            data_url = body['dataUrl']
            
            header, encoded = data_url.split(',', 1)
            raw_bytes = base64.b64decode(encoded)
            
            out_path = os.path.join(ASSETS_DIR, f"{name}.webp")
            with open(out_path, 'wb') as f:
                f.write(raw_bytes)
            
            pad_file(out_path, 75)
            
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(b'{"status":"ok"}')
        else:
            self.send_response(404)
            self.end_headers()

if __name__ == '__main__':
    server = HTTPServer(('127.0.0.1', PORT), Handler)
    print(f"Server listening on port {PORT}...")
    server.serve_forever()
