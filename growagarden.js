import WebSocket from 'ws';
import { logApiRequest } from '../../utils/logger';

function growagarden() {
    return new Promise((resolve, reject) => {
        const ws = new WebSocket('wss://ws.growagardenpro.com', [], { headers: { 'accept-encoding': 'gzip, deflate, br', 'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7', 'cache-control': 'no-cache', connection: 'Upgrade', host: 'ws.growagardenpro.com', origin: 'https://growagardenpro.com', pragma: 'no-cache', 'sec-websocket-extensions': 'permessage-deflate; client_max_window_bits', 'sec-websocket-key': 'TBIaQ04Blb4aAA2qgBCZdA==', 'sec-websocket-version': '13', upgrade: 'websocket', 'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36' } });
        ws.onmessage = (event) => { try { resolve(JSON.parse(event.data)); } catch { resolve(event.data); } ws.close(); };
        ws.onerror = reject;
    });
}

export default async function handler(req, res) {
    const endpoint = '/api/growagarden';
    try {
        const result = await growagarden();
        await logApiRequest(endpoint, 200);
        res.status(200).json({ success: true, result });
    } catch (error) {
        await logApiRequest(endpoint, 500);
        res.status(500).json({ success: false, error: 'WebSocket request failed.', details: String(error) });
    }
}
