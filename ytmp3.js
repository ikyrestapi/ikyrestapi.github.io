import axios from 'axios';
import cheerio from 'cheerio';
import { logApiRequest } from '../../utils/logger';

function extractVideoId(url) {
  const match = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
  return match ? match[1] : null;
}

async function ytmp3(url) {
  if (!url) throw new Error('Masukkan URL YouTube!');

  const videoId = extractVideoId(url);
  const thumbnail = videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : null;

  try {
    const form = new URLSearchParams();
    form.append('q', url);
    form.append('type', 'mp3');

    const res = await axios.post('https://yt1s.click/search', form.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Origin': 'https://yt1s.click',
        'Referer': 'https://yt1s.click/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
    });

    const $ = cheerio.load(res.data);
    const link = $('a[href*="download"]').attr('href');

    if (link) {
      return {
        link,
        title: $('title').text().trim() || 'Unknown Title',
        thumbnail,
        filesize: null,
        duration: null,
        success: true
      };
    }
  } catch (e) {
    // Fallback to the next service
  }

  try {
    if (!videoId) throw new Error('Video ID tidak valid');

    const payload = {
      fileType: 'MP3',
      id: videoId
    };

    const res = await axios.post('https://ht.flvto.online/converter', payload, {
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://ht.flvto.online',
        'Referer': `https://ht.flvto.online/widget?url=https://www.youtube.com/watch?v=${videoId}`,
        'User-Agent': 'Mozilla/5.0 (Linux; Android 13)',
      },
    });

    const data = res?.data;
    if (!data || typeof data !== 'object') {
      throw new Error('Tidak ada respons dari layanan kedua.');
    }

    if (data.status !== 'ok' || !data.link) {
      throw new Error(`Status gagal dari layanan kedua: ${data.msg || 'Tidak diketahui'}`);
    }

    return {
      link: data.link,
      title: data.title,
      thumbnail,
      filesize: data.filesize,
      duration: data.duration,
      success: true
    };

  } catch (e) {
    // Both services failed
  }

  throw new Error('Semua layanan gagal mendapatkan link download.');
}


export default async function handler(req, res) {
    const endpoint = '/api/ytmp3';
    const { url } = req.query;
    if (!url) {
        await logApiRequest(endpoint, 400);
        return res.status(400).json({ error: 'Query `url` is required.' });
    }
    try {
        const result = await ytmp3(url);
        await logApiRequest(endpoint, 200);
        res.status(200).json({ success: true, result });
    } catch (error) {
        await logApiRequest(endpoint, 500);
        res.status(500).json({ success: false, error: 'Failed to process request.', details: String(error) });
    }
}
