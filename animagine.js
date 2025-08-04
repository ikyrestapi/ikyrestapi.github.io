import axios from 'axios';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { logApiRequest } from '../../utils/logger';

function getProxyAgent() {
    const proxyList = process.env.PROXY_LIST;
    if (!proxyList) throw new Error("PROXY_LIST environment variable not set.");
    const proxies = proxyList.split('\n').filter(p => p.trim() !== '');
    if (proxies.length === 0) throw new Error("PROXY_LIST is empty.");
    const randomProxy = proxies[Math.floor(Math.random() * proxies.length)];
    const [host, port, username, password] = randomProxy.split(':');
    if (!host || !port || !username || !password) throw new Error("Invalid proxy format.");
    return new HttpsProxyAgent(`http://${username}:${password}@${host}:${port}`);
}

async function animagine(prompt, options = {}) {
    const {
        aspect_ratio = '1:1',
        style_preset = '(None)'
    } = options;

    const negative_prompt = 'lowres, bad anatomy, bad hands, text, error, missing finger, extra digits, fewer digits, cropped, worst quality, low quality, low score, bad score, average score, signature, watermark, username, blurry';
    const sampler = 'Euler a';
    const width = 1024;
    const height = 1024;
    const guidance_scale = 5;
    const numInference_steps = 28;

    const conf = {
        ratios: {'1:1':'1024 x 1024','9:7':'1152 x 896','7:9':'896 x 1152','19:13':'1216 x 832','13:19':'832 x 1216','7:4':'1344 x 768','4:7':'768 x 1344','12:5':'1536 x 640','5:12':'640 x 1536'},
        styles: ['(None)','Anim4gine','Painting','Pixel art','1980s','1990s','2000s','Toon','Lineart','Art Nouveau','Western Comics','3D','Realistic','Neonpunk']
    };

    if (!Object.keys(conf.ratios).includes(aspect_ratio)) throw new Error(`Available ratios: ${Object.keys(conf.ratios).join(', ')}`);
    if (!conf.styles.includes(style_preset)) throw new Error(`Available styles: ${conf.styles.join(', ')}`);

    const agent = getProxyAgent();
    const session_hash = Math.random().toString(36).substring(2);
    const apiBase = 'https://asahina2k-animagine-xl-4-0.hf.space';

    const payload = {
        data: [prompt, negative_prompt, Math.floor(Math.random() * 2147483648), width, height, guidance_scale, numInference_steps, sampler, conf.ratios[aspect_ratio], style_preset, false, 0.55, 1.5, true],
        event_data: null, fn_index: 5, trigger_id: 43, session_hash
    };

    await axios.post(`${apiBase}/queue/join?`, payload, { httpsAgent: agent, timeout: 60000 });
    const { data: streamData } = await axios.get(`${apiBase}/queue/data?session_hash=${session_hash}`, { httpsAgent: agent, timeout: 180000 });

    const lines = streamData.split('\n\n').filter(line => line.startsWith('data:'));
    for (const line of lines) {
        try {
            const d = JSON.parse(line.substring(6));
            if (d.msg === 'process_completed') {
                const resultUrl = d.output?.data?.[0]?.[0]?.image?.url;
                if (resultUrl) return resultUrl;
            }
        } catch (e) { /* Ignore */ }
    }
    throw new Error('Gagal mendapatkan hasil gambar.');
}

export default async function handler(req, res) {
    const endpoint = '/api/animagine';
    const { prompt, aspect_ratio, style_preset } = req.query;

    if (!prompt) {
        await logApiRequest(endpoint, 400);
        return res.status(400).json({ error: 'Query `prompt` is required.' });
    }
    try {
        const result_url = await animagine(prompt, { aspect_ratio, style_preset });
        await logApiRequest(endpoint, 200);
        res.status(200).json({ success: true, result_url });
    } catch (error) {
        await logApiRequest(endpoint, 500);
        res.status(500).json({ success: false, error: 'Failed to process request.', details: String(error) });
    }
}
