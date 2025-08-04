import axios from 'axios';
import cheerio from 'cheerio';
import { logApiRequest } from '../../utils/logger';

async function txttoimage(prompt) {
  const datapost = `prompt=${encodeURIComponent(prompt)}`;
  const h = { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'Accept': 'application/json, text/javascript, */*; q=0.01', 'X-Requested-With': 'XMLHttpRequest', 'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Mobile Safari/537.36', 'Referer': 'https://www.texttoimage.org/' };
  const res = await axios.post('https://www.texttoimage.org/generate', datapost, { headers: h });
  const result = res.data;
  if (!result.success || !result.url) { throw new Error('gagal dapat url image'); }
  const pageurl = `https://www.texttoimage.org/${result.url}`;
  const pageres = await axios.get(pageurl);
  const $ = cheerio.load(pageres.data);
  const imgtag = $('a[data-lightbox="image-set"] img');
  const imgsrc = imgtag.attr('src');
  if (!imgsrc) { throw new Error('gagal nemu gambar di halaman hasil'); }
  return `https://www.texttoimage.org${imgsrc}`;
}

export default async function handler(req, res) {
    const endpoint = '/api/txttoimage';
    const { prompt } = req.query;
    if (!prompt) {
        await logApiRequest(endpoint, 400);
        return res.status(400).json({ error: 'Query `prompt` is required.' });
    }
    try {
        const result = await txttoimage(prompt);
        await logApiRequest(endpoint, 200);
        res.status(200).json({ success: true, result_url: result });
    } catch (error) {
        await logApiRequest(endpoint, 500);
        res.status(500).json({ success: false, error: 'Failed to process request.', details: String(error) });
    }
}
