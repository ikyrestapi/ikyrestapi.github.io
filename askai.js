import axios from 'axios';
import { logApiRequest } from '../../utils/logger';

export const models = { 'ChatGPT-4o': 'chatgpt-4o', 'ChatGPT-4o Mini': 'chatgpt-4o-mini', 'Claude 3 Opus': 'claude-3-opus', 'Claude 3.5 Sonnet': 'claude-3-sonnet', 'Llama 3': 'llama-3', 'Llama 3.1 (Pro)': 'llama-3-pro', 'Perplexity AI': 'perplexity-ai', 'Mistral Large': 'mistral-large', 'Gemini 1.5 Pro': 'gemini-1.5-pro' }

export async function askAI(prompt, modelKey) {
  const model = models[modelKey];
  if (!model) throw new Error(`Model "${modelKey}" ga ada.`);
  try {
    const { data } = await axios.post('https://whatsthebigdata.com/api/ask-ai/', { message: prompt, model, history: [] }, { headers: { 'content-type': 'application/json', 'origin': 'https://whatsthebigdata.com', 'referer': 'https://whatsthebigdata.com/ai-chat/', 'user-agent': 'Mozilla/5.0' } });
    if (data?.text) return data.text;
    throw new Error('No response text');
  } catch (e) { throw new Error(`emror: ${e.response?.status === 400 ? 'Prompt dilarang sma model.' : e.message}`) }
}

export default async function handler(req, res) {
    const endpoint = '/api/askai';
    const { prompt, model } = req.query;
    if (!prompt || !model) {
        await logApiRequest(endpoint, 400);
        return res.status(400).json({ error: 'Query `prompt` and `model` are required.' });
    }
    try {
        const result = await askAI(prompt, model);
        await logApiRequest(endpoint, 200);
        res.status(200).json({ success: true, model, result });
    } catch (error) {
        await logApiRequest(endpoint, 500);
        res.status(500).json({ success: false, error: 'Failed to process request.', details: String(error) });
    }
}
