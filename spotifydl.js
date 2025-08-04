import axios from 'axios'
import { logApiRequest } from '../../utils/logger';

function msToMinutes(ms) { const totalSeconds = Math.floor(ms / 1000); const minutes = Math.floor(totalSeconds / 60); const seconds = totalSeconds % 60; return `${minutes}:${seconds.toString().padStart(2, '0')}` }

export async function spotifyDownload(url) {
  if (!url) throw new Error('Link-nya mana, senpai?')
  const metaResponse = await axios.post('https://spotiydownloader.com/api/metainfo', { url }, { headers: { 'Content-Type': 'application/json', 'Origin': 'https://spotiydownloader.com', 'Referer': 'https://spotiydownloader.com/id', 'User-Agent': 'Mozilla/5.0' } })
  const meta = metaResponse.data
  if (!meta || !meta.success || !meta.id) throw new Error('Gomen senpai! Aku gagal mengambil info lagunya')
  const dlResponse = await axios.post('https://spotiydownloader.com/api/download', { id: meta.id }, { headers: { 'Content-Type': 'application/json', 'Origin': 'https://spotiydownloader.com', 'Referer': 'https://spotiydownloader.com/id', 'User-Agent': 'Mozilla/5.0' } })
  const result = dlResponse.data
  if (!result || !result.success || !result.link) throw new Error('Yabai! Gagal dapetin link-nya senpai!')
  return { artist: meta.artists || meta.artist || 'Unknown', title: meta.title || 'Unknown', duration: meta.duration_ms ? msToMinutes(meta.duration_ms) : 'Unknown', image: meta.cover || null, download: result.link }
}

export default async function handler(req, res) {
    const endpoint = '/api/spotifydl';
    const { url } = req.query;
    if (!url) {
        await logApiRequest(endpoint, 400);
        return res.status(400).json({ error: 'Query `url` is required.' });
    }
    try {
        const result = await spotifyDownload(url);
        await logApiRequest(endpoint, 200);
        res.status(200).json({ success: true, result });
    } catch (error) {
        await logApiRequest(endpoint, 500);
        res.status(500).json({ success: false, error: 'Failed to process request.', details: String(error) });
    }
}
