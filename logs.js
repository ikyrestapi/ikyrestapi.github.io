import { kv } from '@vercel/kv';
export default async function handler(req, res) {
    if (req.method === 'GET') { const logs = await kv.lrange('api_logs', 0, 99); return res.status(200).json(logs || []); } 
    else if (req.method === 'DELETE') { await kv.del('api_logs'); return res.status(200).json({ success: true, message: 'Logs cleared.' }); }
    return res.status(405).json({ error: 'Method not allowed' });
}
