import axios from 'axios';
import { logApiRequest } from '../../utils/logger';

async function deepimg(prompt, { style = 'default', size = '1:1' } = {}) {
    try {
        const sizeList = { '1:1': '1024x1024', '3:2': '1080x720', '2:3': '720x1080' };
        const styleList = { 'default': '-style Realism', 'ghibli': '-style Ghibli Art', 'cyberpunk': '-style Cyberpunk', 'anime': '-style Anime', 'portrait': '-style Portrait', 'chibi': '-style Chibi', 'pixel art': '-style Pixel Art', 'oil painting': '-style Oil Painting', '3d': '-style 3D' };
        if (!prompt) throw new Error('Prompt is required');
        if (!styleList[style]) throw new Error(`List available style: ${Object.keys(styleList).join(', ')}`);
        if (!sizeList[size]) throw new Error(`List available size: ${Object.keys(sizeList).join(', ')}`);
        const device_id = Array.from({ length: 32 }, () => Math.floor(Math.random()*16).toString(16)).join('');
        const { data } = await axios.post('https://api-preview.apirouter.ai/api/v1/deepimg/flux-1-dev', { device_id: device_id, prompt: prompt + ' ' + styleList[style], size: sizeList[size], n: '1', output_format: 'png' }, { headers: { 'content-type': 'application/json', origin: 'https://deepimg.ai', referer: 'https://deepimg.ai/', 'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36' } });
        return data.data.images[0].url;
    } catch (error) { throw new Error(error.message); }
};

export default async function handler(req, res) {
    const endpoint = '/api/deepimg';
    const { prompt, style, size } = req.query;
    if (!prompt) {
        await logApiRequest(endpoint, 400);
        return res.status(400).json({ error: 'Query `prompt` is required.' });
    }
    try {
        const result = await deepimg(prompt, { style, size });
        await logApiRequest(endpoint, 200);
        res.status(200).json({ success: true, result_url: result });
    } catch (error) {
        await logApiRequest(endpoint, 500);
        res.status(500).json({ success: false, error: 'Failed to process request.', details: String(error) });
    }
}
