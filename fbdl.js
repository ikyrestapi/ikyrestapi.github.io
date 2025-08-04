import { fetch } from 'undici';
import { logApiRequest } from '../../utils/logger';

const fbvdl = async (fbUrl) => {
  const fixUrl = (url) => url?.replace(/\\/g,"") || null;
  if (typeof(fbUrl) !== "string") throw Error (`mana url nya`);
  const headers = { "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7", "sec-fetch-site": "none", "sec-fetch-user": "?1", "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0", };
  const response = await fetch(fbUrl, {headers});
  if(!response.ok) throw Error (`${response.status} ${response.statusText} ${response.url}\n${await response.text()||null}`);
  const html = await response.text();
  const m_sd = html.match(/"browser_native_sd_url":"(.+?)",/)?.[1];
  const m_hd = html.match(/"browser_native_hd_url":"(.+?)",/)?.[1];
  const m_a = html.match(/"mime_type":"audio\\\/mp4","codecs":"mp4a\.40\.5","base_url":"(.+?)",/)?.[1];
  return { sd : fixUrl(m_sd), hd : fixUrl(m_hd), audio : fixUrl(m_a) };
}

export default async function handler(req, res) {
    const endpoint = '/api/fbdl';
    const { url } = req.query;
    if (!url) {
        await logApiRequest(endpoint, 400);
        return res.status(400).json({ error: 'Query `url` is required.' });
    }
    try {
        const result = await fbvdl(url);
        await logApiRequest(endpoint, 200);
        res.status(200).json({ success: true, result });
    } catch (error) {
        await logApiRequest(endpoint, 500);
        res.status(500).json({ success: false, error: 'Failed to process request.', details: String(error) });
    }
}
