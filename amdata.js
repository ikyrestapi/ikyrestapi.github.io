import axios from 'axios';
import { logApiRequest } from '../../utils/logger';

async function amdata(url) {
    try {
        const match = url.match(/\/u\/([^\/]+)\/p\/([^\/\?#]+)/);
        if (!match) throw new Error('Invalid url');
        const { data } = await axios.post('https://us-central1-alight-creative.cloudfunctions.net/getProjectMetadata', { data: { uid: match[1], pid: match[2], platform: 'android', appBuild: 1002592, acctTestMode: 'normal' } }, { headers: { 'content-type': 'application/json; charset=utf-8' } });
        return data.result;
    } catch (error) { throw new Error(error.message); }
}

export default async function handler(req, res) {
    const endpoint = '/api/amdata';
    const { url } = req.query;
    if (!url) {
        await logApiRequest(endpoint, 400);
        return res.status(400).json({ error: 'Query `url` is required.' });
    }
    try {
        const result = await amdata(url);
        await logApiRequest(endpoint, 200);
        res.status(200).json({ success: true, result });
    } catch (error) {
        await logApiRequest(endpoint, 500);
        res.status(500).json({ success: false, error: 'Failed to process request.', details: String(error) });
    }
}
