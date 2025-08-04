import axios from 'axios';
import { logApiRequest } from '../../utils/logger';

async function ttdl(url) {
    if (!/^https?:\/\/(www\.)?(tiktok\.com|vt\.tiktok\.com|vm\.tiktok\.com|m\.tiktok\.com)\/.+/i.test(url)) {
        throw new Error('Invalid TikTok URL');
    }
    try {
        const { data } = await axios.get('https://tiktok-scraper7.p.rapidapi.com', {
            headers: {
                'X-RapidAPI-Host': 'tiktok-scraper7.p.rapidapi.com',
                'X-RapidAPI-Key': 'ca5c6d6fa3mshfcd2b0a0feac6b7p140e57jsn72684628152a'
            },
            params: { url: url, hd: '1' }
        });

        if (data.code !== 0 || !data.data) {
             throw new Error(data.message || 'Failed to fetch data from the upstream API.');
        }
        return data.data;

    } catch (error) {
        throw new Error(error.response?.data?.message || error.message || 'An unknown error occurred');
    }
}

export default async function handler(req, res) {
    const endpoint = '/api/tiktokdl';
    const { url } = req.query;

    if (!url) {
        await logApiRequest(endpoint, 400);
        return res.status(400).json({ error: 'Query `url` is required.' });
    }

    try {
        const result = await ttdl(url);
        await logApiRequest(endpoint, 200);
        res.status(200).json({ success: true, result });
    } catch (error) {
        await logApiRequest(endpoint, 500);
        res.status(500).json({ success: false, error: 'Failed to process request.', details: String(error) });
    }
}
