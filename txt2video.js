import axios from 'axios';
import { logApiRequest } from '../../utils/logger';

async function txt2video(prompt) {
    try {
        const { data: k } = await axios.post('https://soli.aritek.app/txt2videov3', { deviceID: Math.random().toString(16).substr(2, 8) + Math.random().toString(16).substr(2, 8), prompt: prompt, used: [], versionCode: 51 }, { headers: { authorization: 'eyJzdWIiwsdeOiIyMzQyZmczNHJ0MzR0weMzQiLCJuYW1lIjorwiSm9objMdf0NTM0NT', 'content-type': 'application/json; charset=utf-8', 'accept-encoding': 'gzip', 'user-agent': 'okhttp/4.11.0' } });
        const { data } = await axios.post('https://soli.aritek.app/video', { keys: [k.key] }, { headers: { authorization: 'eyJzdWIiwsdeOiIyMzQyZmczNHJ0MzR0weMzQiLCJuYW1lIjorwiSm9objMdf0NTM0NT', 'content-type': 'application/json; charset=utf-8', 'accept-encoding': 'gzip', 'user-agent': 'okhttp/4.11.0' } });
        return data.datas[0].url;
    } catch (error) { throw new Error(error.message); }
}

export default async function handler(req, res) {
    const endpoint = '/api/txt2video';
    const { prompt } = req.query;
    if (!prompt) {
        await logApiRequest(endpoint, 400);
        return res.status(400).json({ error: 'Query `prompt` is required.' });
    }
    try {
        const result = await txt2video(prompt);
        await logApiRequest(endpoint, 200);
        res.status(200).json({ success: true, result_url: result });
    } catch (error) {
        await logApiRequest(endpoint, 500);
        res.status(500).json({ success: false, error: 'Failed to process request.', details: String(error) });
    }
}
