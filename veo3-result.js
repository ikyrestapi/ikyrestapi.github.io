import axios from 'axios';
import { logApiRequest } from '../../utils/logger';

export default async function handler(req, res) {
    const endpoint = '/api/veo3-result';
    const { ticket } = req.query;

    if (!ticket) {
        await logApiRequest(endpoint, 400);
        return res.status(400).json({ success: false, error: 'Parameter "ticket" is required.' });
    }

    try {
        const decodedTicket = Buffer.from(ticket, 'base64').toString('utf8');
        const [recordId, uid, verifyToken] = decodedTicket.split('|||');

        if (!recordId || !uid || !verifyToken) {
            throw new Error('Invalid or corrupted ticket.');
        }

        const { data: statusResponse } = await axios.get(`https://aiarticle.erweima.ai/api/v1/secondary-page/api/${recordId}`, {
            headers: {
                uniqueid: uid,
                verify: verifyToken
            }
        });

        const taskData = statusResponse.data;
        let result;

        if (taskData.state === 'success') {
            const finalResult = JSON.parse(taskData.completeData);
            result = { status: 'success', result: finalResult };
        } else {
            result = { status: taskData.state, message: `Video is not ready. Current status: ${taskData.state}.` };
        }

        await logApiRequest(endpoint, 200);
        res.status(200).json({ success: true, ...result });

    } catch (error) {
        await logApiRequest(endpoint, 500);
        res.status(500).json({ success: false, error: 'Failed to retrieve video result.', details: error.message });
    }
}
