import http from 'http';
import fs from 'fs';
import path from 'path';
import { AddressInfo } from 'net';

export async function servePublicFolder(publicDir: string): Promise<{ url: string; close: () => void }> {
    const server = http.createServer((req, res) => {
        const filePath = path.join(publicDir, req.url || '/');

        // Prevent directory traversal
        if (!filePath.startsWith(publicDir)) {
            res.statusCode = 403;
            res.end('Forbidden');
            return;
        }

        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.statusCode = 404;
                res.end('Not Found');
                return;
            }
            // Set minimal headers (mime types ideally, but video/webm usually works or browser sniffs)
            if (filePath.endsWith('.mp4')) res.setHeader('Content-Type', 'video/mp4');
            if (filePath.endsWith('.webm')) res.setHeader('Content-Type', 'video/webm');

            res.end(data);
        });
    });

    return new Promise((resolve) => {
        server.listen(0, () => { // Random port
            const address = server.address() as AddressInfo;
            const url = `http://localhost:${address.port}`;
            console.log(`[StaticServer] Serving ${publicDir} at ${url}`);
            resolve({
                url,
                close: () => server.close()
            });
        });
    });
}
