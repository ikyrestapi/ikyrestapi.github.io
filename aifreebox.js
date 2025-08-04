import axios from 'axios';
import { logApiRequest } from '../../utils/logger';

async function AIFreeboxImage(prompt, aspectRatio = '16:9', slug = 'ai-art-generator') {
  const validRatios = ['1:1', '2:3', '9:16', '16:9'];
  const validSlugs = ['ai-art-generator', 'ai-fantasy-map-creator', 'ai-youtube-thumbnail-generator', 'ai-old-cartoon-characters-generator'];
  if (!validRatios.includes(aspectRatio)) { throw new Error(`Aspect ratio ga ada! Pilih salah satu: ${validRatios.join(', ')}`) }
  if (!validSlugs.includes(slug)) { throw new Error(`Slug ga ada! Pilih salah satu: ${validSlugs.join(', ')}`) }
  try {
    const response = await axios.post('https://aifreebox.com/api/image-generator', { userPrompt: prompt, aspectRatio, slug }, { headers: { 'Content-Type': 'application/json', 'Origin': 'https://aifreebox.com', 'Referer': `https://aifreebox.com/image-generator/${slug}`, 'User-Agent': 'Mozilla/5.0 (Linux; Android 13; Mobile) AppleWebKit/537.36 Safari/537.36' } });
    const { data } = response;
    if (data?.success && data.imageUrl) { return data.imageUrl } else { throw new Error('ga ada respon') }
  } catch (err) { throw new Error('emror') }
}

export default async function handler(req, res) {
    const endpoint = '/api/aifreebox';
    const { prompt, ratio, slug } = req.query;
    if (!prompt) {
        await logApiRequest(endpoint, 400);
        return res.status(400).json({ error: 'Query `prompt` is required.' });
    }
    try {
        const result = await AIFreeboxImage(prompt, ratio, slug);
        await logApiRequest(endpoint, 200);
        res.status(200).json({ success: true, result_url: result });
    } catch (error) {
        await logApiRequest(endpoint, 500);
        res.status(500).json({ success: false, error: 'Failed to process request.', details: String(error) });
    }
}
