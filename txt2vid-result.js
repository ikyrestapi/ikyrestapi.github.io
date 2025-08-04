import axios from 'axios';
import { logApiRequest } from '../../utils/logger';

export default async function handler(req, res) {
    const endpoint = '/api/txt2vid-result';
    const { ticket } = req.query;

    if (!ticket) {
        await logApiRequest(endpoint, 400);
        return res.status(400).json({ success: false, error: 'Parameter "ticket" is required.' });
    }

    try {
        const decodedTicket = Buffer.from(ticket, 'base64').toString('utf8');
        const [recordId, uniqueId, verifyToken] = decodedTicket.split('|||');

        if (!recordId || !uniqueId || !verifyToken) {
            throw new Error('Invalid or corrupted ticket.');
        }

        const { data: statusResponse } = await axios.get(`https://aiarticle.erweima.ai/api/v1/secondary-page/api/${recordId}`, {
            headers: { uniqueid: uniqueId, verify: verifyToken },
        });

        if (statusResponse.code !== 200) {
            throw new Error(`Upstream API error: ${statusResponse.msg}`);
        }

        const videoData = statusResponse.data;
        let result;

        if (videoData.state === 'success') {
            const finalResult = JSON.parse(videoData.completeData);
            result = { status: 'success', result: finalResult.data };
        } else {
            result = { status: videoData.state, message: `Video is not ready. Current status: ${videoData.state}.` };
        }

        await logApiRequest(endpoint, 200);
        res.status(200).json({ success: true, ...result });

    } catch (error) {
        await logApiRequest(endpoint, 500);
        res.status(500).json({ success: false, error: 'Failed to retrieve video result.', details: error.message });
    }
}
