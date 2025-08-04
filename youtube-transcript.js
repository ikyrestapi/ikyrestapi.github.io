import axios from 'axios';
import { logApiRequest } from '../../utils/logger';

async function getYouTubeTranscript(videoUrl) {
    const res = await axios.post('https://kome.ai/api/transcript', 
        {
            video_id: videoUrl,
            format: true
        }, 
        {
            headers: {
                'Content-Type': 'application/json',
                'Origin': 'https://kome.ai',
                'Referer': 'https://kome.ai/tools/youtube-transcript-generator',
                'User-Agent': 'Mozilla/5.0'
            }
        }
    );
    if (!res.data || !res.data.transcript) throw new Error('No transcript found in the response.');
    return res.data.transcript;
}


export default async function handler(req, res) {
    const endpoint = '/api/youtube-transcript';
    const { url } = req.query;

    if (!url) {
        await logApiRequest(endpoint, 400);
        return res.status(400).json({ success: false, error: 'Query parameter "url" is required.' });
    }

    try {
        const result = await getYouTubeTranscript(url);
        await logApiRequest(endpoint, 200);
        res.status(200).json({ success: true, result });
    } catch (error) {
        await logApiRequest(endpoint, 500);
        res.status(500).json({ success: false, error: 'Failed to get YouTube transcript.', details: error.message });
    }
}
