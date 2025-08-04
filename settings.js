import { kv } from '@vercel/kv';
export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { whatsappUrl } = req.body;
        if (typeof whatsappUrl !== 'string') { return res.status(400).json({ error: 'Invalid whatsappUrl' }); }
        await kv.set('site_settings', { whatsappUrl });
        return res.status(200).json({ success: true, message: 'Settings saved.' });
    } else if (req.method === 'GET') {
        const settings = await kv.get('site_settings');
        return res.status(200).json(settings || { whatsappUrl: '' });
    }
    return res.status(405).json({ error: 'Method not allowed' });
}
