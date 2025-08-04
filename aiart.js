import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { logApiRequest } from '../../utils/logger';

async function aiart(prompt, { base_model = 'flux', style = 'anime', ratio = '1:1' } = {}) {
    try {
        const conf = { models: { flux: 'flux_text2img', artist: 'text2img_artist', anime: 'text2img_anime', realistic: 'text2img_real', realistic_v2: 'text2img_real_v2' }, ratios: { '1:1': { width: 1024, height: 1024 }, '3:4': { width: 864, height: 1152 }, '4:3': { width: 1152, height: 864 }, '4:5': { width: 921, height: 1152 }, '5:4': { width: 1152, height: 921 }, '9:16': { width: 756, height: 1344 }, '16:9': { width: 1344, height: 756 } }, flux_styles: ['general', 'anime', 'fantasy_art', 'line_art', 'photograph', 'comic'], styles: ['general', 'anime', 'ghibli', 'fantasy_art', 'line_art', 'photograph', 'comic'] };
        if (!prompt) throw new Error('Prompt is required');
        if (!Object.keys(conf.models).includes(base_model)) throw new Error(`Available models: ${Object.keys(conf.models).join(', ')}`);
        if (base_model === 'flux' && !conf.flux_styles.includes(style)) throw new Error(`Available flux styles: ${conf.flux_styles.join(', ')}`);
        if (base_model !== 'flux' && !conf.styles.includes(style)) throw new Error(`Available ${base_model} styles: ${conf.styles.join(', ')}`);
        if (!Object.keys(conf.ratios).includes(ratio)) throw new Error(`Available ratios: ${Object.keys(conf.ratios).join(', ')}`);
        const uuid = uuidv4();
        await axios.get('https://api-cdn.aiartgen.net/comfyapi/v4/config', { params: { app_version_code: '469', app_version_name: '3.41.0', device_id: uuid, ad_id: '', platform: 'android' }, headers: { 'accept-encoding': 'gzip', 'content-type': 'application/json; charset=UTF-8', 'user-agent': 'okhttp/4.12.0' } });
        const { data: b } = await axios.post('https://api-cdn.aiartgen.net/comfyapi/v4/prompt', { batch_size: 1, diamond_remain: 3, height: conf.ratios[ratio].height, model_id: style, prompt: prompt, prompt_translated: prompt, ratio: ratio, width: conf.ratios[ratio].width, work_type: conf.models[base_model] }, { params: { app_version_code: '469', app_version_name: '3.41.0', device_id: uuid, ad_id: uuidv4(), platform: 'android' }, headers: { 'accept-encoding': 'gzip', 'content-type': 'application/json; charset=UTF-8', 'user-agent': 'okhttp/4.12.0' } });
        return b.images;
    } catch (error) { throw new Error(error.message); }
}

export default async function handler(req, res) {
    const endpoint = '/api/aiart';
    const { prompt, base_model, style, ratio } = req.query;
    if (!prompt) {
        await logApiRequest(endpoint, 400);
        return res.status(400).json({ error: 'Query `prompt` is required.' });
    }
    try {
        const result = await aiart(prompt, { base_model, style, ratio });
        await logApiRequest(endpoint, 200);
        res.status(200).json({ success: true, result });
    } catch (error) {
        await logApiRequest(endpoint, 500);
        res.status(500).json({ success: false, error: 'Failed to process request.', details: String(error) });
    }
}
