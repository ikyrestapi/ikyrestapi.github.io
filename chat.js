// File: pages/api/vertex/chat.js

import VertexAI from '../../../utils/vertexai';
import { logApiRequest } from '../../../utils/logger';

export default async function handler(req, res) {
    const endpoint = '/api/vertex/chat';
    const { question, model, system_instruction, search } = req.query;

    if (!question) {
        await logApiRequest(endpoint, 400);
        return res.status(400).json({ success: false, error: 'Query parameter "question" is required.' });
    }

    try {
        const vertex = new VertexAI();
        const searchBool = search === 'true';
        const result = await vertex.chat(question, { model, system_instruction, search: searchBool });
        await logApiRequest(endpoint, 200);
        res.status(200).json({ success: true, result });
    } catch (error) {
        await logApiRequest(endpoint, 500);
        res.status(500).json({ success: false, error: 'Failed to get chat response.', details: error.message });
    }
}
