import axios from 'axios';
import { logApiRequest } from '../../utils/logger';

async function SnackVideo(url) {
  try {
    const response = await axios.post('https://api.snackdownloader.com/get-data', { url: url }, { headers: { 'content-type': 'application/json', 'origin': 'https://snackdownloader.com', 'referer': 'https://snackdownloader.com', 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36' } });
    const { video } = response.data;
    if (!video) throw new Error('Gagal mengambil video. Cek linknya!');
    return { status: true, video };
  } catch (err) { return { status: false, message: err.message || 'error.' } }
}

export default async function handler(req, res) {
    const endpoint = '/api/snackvideo';
    const { url } = req.query;
    if (!url) {
        await logApiRequest(endpoint, 400);
        return res.status(400).json({ error: 'Query `url` is required.' });
    }
    try {
        const result = await SnackVideo(url);
        await logApiRequest(endpoint, 200);
        res.status(200).json({ success: true, result });
    } catch (error) {
        await logApiRequest(endpoint, 500);
        res.status(500).json({ success: false, error: 'Failed to process request.', details: String(error) });
    }
}
