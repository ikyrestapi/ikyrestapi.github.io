import axios from 'axios';
import { logApiRequest } from '../../utils/logger'; 
async function gpt(prompt, model = 'chatgpt4') {
    try {
        const model_list = {
            chatgpt4: {
                api: 'https://stablediffusion.fr/gpt4/predict2',
                referer: 'https://stablediffusion.fr/chatgpt4'
            },
            chatgpt3: {
                api: 'https://stablediffusion.fr/gpt3/predict',
                referer: 'https://stablediffusion.fr/chatgpt3'
            }
        };
        if (!prompt) throw new Error('Prompt is required');
        if (!model_list[model]) throw new Error(`List available models: ${Object.keys(model_list).join(', ')}`);
        const hmm = await axios.get(model_list[model].referer);
        const {
            data
        } = await axios.post(model_list[model].api, {
            prompt: prompt
        }, {
            headers: {
                accept: '*/*',
                'content-type': 'application/json',
                origin: 'https://stablediffusion.fr',
                referer: model_list[model].referer,
                cookie: hmm.headers['set-cookie'].join('; '),
                'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Mobile Safari/537.36'
            }
        });
        return data.message;
    } catch (error) {
        throw new Error(error.message);
    }
}

export default async function handler(req, res) {
    const endpoint = '/api/gpt';
    const {
        prompt,
        model
    } = req.query;
    if (req.method !== 'GET') {
        await logApiRequest(endpoint, 405);
        return res.status(405).json({
            error: 'Method Not Allowed'
        });
    }
    if (!prompt) {
        await logApiRequest(endpoint, 400);
        return res.status(400).json({
            error: 'Query `prompt` is required.'
        });
    }
    try {
        const result = await gpt(prompt, model);
        await logApiRequest(endpoint, 200);
        res.status(200).json({
            success: true,
            model: model || 'chatgpt4',
            result: result.trim()
        });
    } catch (error) {
        await logApiRequest(endpoint, 500);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch response from the upstream API.',
            details: error.message
        });
    }
}
