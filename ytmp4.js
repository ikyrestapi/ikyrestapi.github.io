import axios from 'axios';
import { logApiRequest } from '../../utils/logger';

async function getVideoInfo(url) {
  const { data } = await axios.post(`https://api.ytmp4.fit/api/video-info`, { url }, { headers: { 'Content-Type': 'application/json', 'Origin': 'https://ytmp4.fit', 'Referer': 'https://ytmp4.fit/' } });
  if (!data || !data.title) throw new Error('gagal ambil info.'); return data;
}

export default async function handler(req, res) {
    const endpoint = '/api/ytmp4';
    const { url } = req.query;
    if (!url) {
        await logApiRequest(endpoint, 400);
        return res.status(400).json({ error: 'Query `url` is required.' });
    }
    try {
        const result = await getVideoInfo(url);
        await logApiRequest(endpoint, 200);
        res.status(200).json({ success: true, result });
    } catch (error) {
        await logApiRequest(endpoint, 500);
        res.status(500).json({ success: false, error: 'Failed to process request.', details: String(error) });
    }
}
