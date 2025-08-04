import axios from 'axios';
import FormData from 'form-data';
import { logApiRequest } from '../../utils/logger';

async function uploadUguu(buffer, filename = 'image.jpg') {
  const form = new FormData(); form.append('files[]', buffer, { filename });
  const { data } = await axios.post('https://uguu.se/upload.php', form, { headers: form.getHeaders() });
  const url = data?.files?.[0]?.url; if (!url) throw new Error('Upload ke Uguu gagal.'); return url;
}
async function processMosyne(buffer, type) {
  const imageUrl = await uploadUguu(buffer);
  const headers = { 'accept': 'application/json, text/plain, */*', 'content-type': 'application/json', 'origin': 'https://mosyne.ai', 'referer': `https://mosyne.ai/ai/${type === 'removebg' ? 'remove-bg' : 'upscaling'}`, 'user-agent': 'Mozilla/5.0 (X11; Linux x86_64)' };
  const user_id = 'user_test';
  const { data: uploadRes } = await axios.post(`https://mosyne.ai/api/${type === 'removebg' ? 'remove_background' : 'upscale'}`, { image: imageUrl, user_id }, { headers });
  const id = uploadRes.id; if (!id) throw new Error('gagal dpet id.');
  const checkPayload = { id, type: type === 'removebg' ? 'remove_background' : 'upscale', user_id };
  const delay = ms => new Promise(res => setTimeout(res, ms));
  for (let i = 0; i < 30; i++) {
    await delay(2000);
    const { data: statusRes } = await axios.post('https://mosyne.ai/api/status', checkPayload, { headers });
    if (statusRes.status === 'COMPLETED' && statusRes.image) { return statusRes.image; }
    if (statusRes.status === 'FAILED') { throw new Error('proses gagal.'); }
  }
  throw new Error('timeout menunggu.');
}

export default async function handler(req, res) {
    const endpoint = '/api/mosyne';
    const { url, type } = req.query;
    if (!url || !type || !['removebg', 'upscale'].includes(type)) {
        await logApiRequest(endpoint, 400);
        return res.status(400).json({ error: 'Query `url` and `type` (removebg/upscale) are required.' });
    }
    try {
        const imageBuffer = await axios.get(url, { responseType: 'arraybuffer' }).then(res => Buffer.from(res.data));
        const result = await processMosyne(imageBuffer, type);
        await logApiRequest(endpoint, 200);
        res.status(200).json({ success: true, result_url: result });
    } catch (error) {
        await logApiRequest(endpoint, 500);
        res.status(500).json({ success: false, error: 'Failed to process request.', details: String(error) });
    }
}
