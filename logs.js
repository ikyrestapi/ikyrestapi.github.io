// File: pages/api/logs.js

import { kv } from '@vercel/kv';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            // Ambil 20 log terakhir (indeks 0 sampai 19)
            const logs = await kv.lrange('api_logs', 0, 19);
            return res.status(200).json(logs || []);
        } catch (error) {
            console.error("Failed to fetch logs from KV:", error);
            return res.status(500).json({ error: 'Failed to fetch logs.' });
        }
    } else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
}
