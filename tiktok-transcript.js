import axios from 'axios';
import { logApiRequest } from '../../utils/logger';

async function getTikTokTranscript(videoUrl) {
    const res = await axios.post(
        'https://www.short.ai/self-api/v2/project/get-tiktok-youtube-link',
        { link: videoUrl },
        {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Origin': 'https://www.short.ai',
                'Referer': 'https://www.short.ai/tiktok-script-generator',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
            }
        }
    );
    const data = res.data?.data?.data;
    if (!data) throw new Error('No data found in the response.');
    return {
        text: data.text,
        duration: data.duration,
        language: data.language,
        url: res.data?.data?.url,
        segments: data.segments.map(s => ({ start: s.start, end: s.end, text: s.text }))
    };
}

export default async function handler(req, res) {
    const endpoint = '/api/tiktok-transcript';
    const { url } = req.query;

    if (!url) {
        await logApiRequest(endpoint, 400);
        return res.status(400).json({ success: false, error: 'Query parameter "url" is required.' });
    }

    try {
        const result = await getTikTokTranscript(url);
        await logApiRequest(endpoint, 200);
        res.status(200).json({ success: true, result });
    } catch (error) {
        await logApiRequest(endpoint, 500);
        res.status(500).json({ success: false, error: 'Failed to get TikTok transcript.', details: error.message });
    }
}
