import axios from 'axios';
import crypto from 'crypto';
import { logApiRequest } from '../../utils/logger';

export default async function handler(req, res) {
    const endpoint = '/api/txt2vid';
    
    if (req.method !== 'GET') {
        await logApiRequest(endpoint, 405);
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
    const { prompt, ratio } = req.query;
    if (!prompt) {
        await logApiRequest(endpoint, 400);
        return res.status(400).json({ error: 'Query `prompt` is required.' });
    }

    try {
        const { data: verificationResponse } = await axios.get('https://api.nekorinn.my.id/tools/rynn-stuff', { params: { mode: 'turnstile-min', siteKey: '0x4AAAAAAATOXAtQtziH-Rwq', url: 'https://www.yeschat.ai/features/text-to-video-generator', accessKey: 'a40fc14224e8a999aaf0c26739b686abfa4f0b1934cda7fa3b34522b0ed5125d' } });
        const verifyToken = verificationResponse.result.token;
        const uniqueId = crypto.createHash('md5').update(Date.now().toString()).digest('hex');
        const { data: taskResponse } = await axios.post('https://aiarticle.erweima.ai/api/v1/secondary-page/api/create', {
            prompt: prompt, aspectRatio: ratio || '16:9', imgUrls: [], quality: '540p', duration: 5,
            autoSoundFlag: false, soundPrompt: '', autoSpeechFlag: false, speechPrompt: '', speakerId: 'Auto',
            secondaryPageId: 388, channel: 'PIXVERSE', source: 'yeschat.ai', type: 'features',
            watermarkFlag: false, privateFlag: false, isTemp: true, vipFlag: false
        }, { headers: { uniqueid: uniqueId, verify: verifyToken } });
        const recordId = taskResponse.data.recordId;

        const combinedTicket = `${recordId}|||${uniqueId}|||${verifyToken}`;
        const encodedTicket = Buffer.from(combinedTicket).toString('base64');

        await logApiRequest(endpoint, 200);
        res.status(200).json({
            success: true,
            message: "Video generation started. Use the ticket below to get the result.",
            ticket: encodedTicket
        });

    } catch (error) {
        await logApiRequest(endpoint, 500);
        res.status(500).json({ success: false, error: 'Failed to start video generation.', details: error.message });
    }
}
