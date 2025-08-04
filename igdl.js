import axios from 'axios';
import cheerio from 'cheerio';
import qs from 'qs';
import { logApiRequest } from '../../utils/logger';

async function instagramDownloader(url) {
  const data = qs.stringify({ url: url, lang: 'en' });
  try {
    const res = await axios.post('https://api.instasave.website/media', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    const html = (res.data.match(/innerHTML\s*=\s*"(.+?)";/s)?.[1] || '').replace(/\\"/g, '"');
    const $ = cheerio.load(html);
    const result = [];
    $('.download-items').each((_, el) => { const downloadUrl = $(el).find('a[title="Download"]').attr('href'); const type = $(el).find('.format-icon i').attr('class')?.includes('ivideo') ? 'video' : 'image'; if (downloadUrl) result.push({ type, url: downloadUrl }); });
    if (!result.length) throw new Error('Media tidak ditemukan');
    return result;
  } catch (e) { throw new Error(e.response?.data || e.message) }
}

export default async function handler(req, res) {
    const endpoint = '/api/igdl';
    const { url } = req.query;
    if (!url) {
        await logApiRequest(endpoint, 400);
        return res.status(400).json({ error: 'Query `url` is required.' });
    }
    try {
        const result = await instagramDownloader(url);
        await logApiRequest(endpoint, 200);
        res.status(200).json({ success: true, result });
    } catch (error) {
        await logApiRequest(endpoint, 500);
        res.status(500).json({ success: false, error: 'Failed to process request.', details: String(error) });
    }
}
