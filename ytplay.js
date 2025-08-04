import { fetch } from 'undici';
import { logApiRequest } from '../../utils/logger';

const yt = {
    headers: { "accept": "*/*", "accept-encoding": "gzip, deflate, br, zstd", "accept-language": "en-GB,en;q=0.9,en-US;q=0.8", "cache-control": "no-cache", "pragma": "no-cache", "priority": "u=1, i", "sec-ch-ua": "\"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"138\", \"Microsoft Edge\";v=\"138\"", "sec-ch-ua-mobile": "?0", "sec-ch-ua-platform": "\"Windows\"", "sec-fetch-dest": "empty", "sec-fetch-mode": "cors", "sec-fetch-site": "cross-site", "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0" },
    mintaJson: async (deskripsi, url, headers, method="get", body) => { try { const response = await fetch(url, { headers, method, body }); if (!response.ok) throw Error(`${response.status} ${response.statusText}\n${await response.text() || null}`); const json = await response.json(); return json; } catch (err) { throw Error(`fetch gagal : ${deskripsi}\nkarena: ${err.message}`) } },
    search: async (query) => { if (typeof (query) !== "string" || query?.length == 0) throw Error(`invalid query or empty query`); const headers = { ...yt.headers, "origin": "https://v2.www-y2mate.com", "referer": "https://v2.www-y2mate.com/", }; const json = await yt.mintaJson(`search`,`https://wwd.mp3juice.blog/search.php?q=${encodeURIComponent(query)}`,headers); return json; },
    getKey: async () => { const headers = { "content-type": "application/json", "origin": "https://iframe.y2meta-uk.com", "referer": "https://iframe.y2meta-uk.com/", ...yt.headers }; const json = await yt.mintaJson(`mendapatkan kunci keramat`, `https://api.mp3youtube.cc/v2/sanity/key`, headers); return json; },
    handleFormat: (link, formatId) => { const listFormat = ["128kbps", "320kbps", "144p", "240p", "360p", "720p", "1080p"]; if (typeof (link) !== "string" || link?.length === 0) throw Error(`invalid link or empty`); if (typeof (formatId) !== "string" || formatId?.length === 0) throw Error(`invalid id or empty`); const selectedFormat = listFormat.find(v => v === formatId); if (!selectedFormat) throw Error(`${formatId} is invalid format id. available format id: ${listFormat.map(v => v).join(", ")}`); const match = selectedFormat.match(/(\d+)(\w+)/); const format = match[2] === "kbps" ? "mp3" : "mp4"; const audioBitrate = format === "mp3" ? match[1] : 128; const videoQuality = format === "mp4" ? match[1] : 720; const filenameStyle = "pretty"; const vCodec = "h264"; return { link, format, audioBitrate, videoQuality, filenameStyle, vCodec }; },
    convert: async (youtubeUrl, formatId) => { const { key } = await yt.getKey(); const headers = { "content-type": "application/x-www-form-urlencoded", "Key": key, "origin": "https://iframe.y2meta-uk.com", "referer": "https://iframe.y2meta-uk.com/", ...yt.headers }; const payload = yt.handleFormat(youtubeUrl, formatId); const body = new URLSearchParams(payload); const json = await yt.mintaJson(`convert`, `https://api.mp3youtube.cc/v2/converter`, headers, `post`, body); json.chosenFormat = formatId; return json; },
    searchAndDownload: async (query, formatId = "128kbps") => { const searchResult = await yt.search(query); const youtubeUrl = `https://youtu.be/${searchResult.items[0].id}`; const downloadResult = await yt.convert(youtubeUrl, formatId); return downloadResult; }
}

export default async function handler(req, res) {
    const endpoint = '/api/ytplay';
    const { query, quality, type } = req.query;
    if (!query) {
        await logApiRequest(endpoint, 400);
        return res.status(400).json({ error: 'Query `query` is required.' });
    }
    try {
        const isVideo = type === 'video';
        const audioQualities = ['128kbps', '320kbps'];
        const videoQualities = ['144p', '240p', '360p', '720p', '1080p'];
        const validQualities = isVideo ? videoQualities : audioQualities;
        const defaultQuality = isVideo ? '720p' : '128kbps';
        const selectedQuality = validQualities.includes(quality) ? quality : defaultQuality;
        const result = await yt.searchAndDownload(query, selectedQuality);
        await logApiRequest(endpoint, 200);
        res.status(200).json({ success: true, result });
    } catch (error) {
        await logApiRequest(endpoint, 500);
        res.status(500).json({ success: false, error: 'Failed to process request.', details: String(error) });
    }
}
