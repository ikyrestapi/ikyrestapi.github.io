import axios from 'axios';
import crypto from 'crypto';
import { logApiRequest } from '../../utils/logger';

export default async function handler(req, res) {
    const endpoint = '/api/veo3-v2-start';
    const { prompt, model, auto_sound, auto_speech } = req.query;

    if (!prompt) {
        await logApiRequest(endpoint, 400);
        return res.status(400).json({ success: false, error: 'Query parameter "prompt" is required.' });
    }

    try {
        const { data: cf } = await axios.get('https://api.nekorinn.my.id/tools/rynn-stuff', {
            params: {
                mode: 'turnstile-min', siteKey: '0x4AAAAAAAdJZmNxW54o-Gvd',
                url: 'https://lunaai.video/features/v3-fast',
                accessKey: '5238b8ad01dd627169d9ac2a6c843613d6225e6d77a6753c75dc5d3f23813653'
            }
        });

        const uid = crypto.createHash('md5').update(Date.now().toString()).digest('hex');
        const { data: task } = await axios.post('https://aiarticle.erweima.ai/api/v1/secondary-page/api/create', {
            prompt, imgUrls: [], quality: '720p', duration: 8,
            autoSoundFlag: auto_sound === 'true', soundPrompt: '',
            autoSpeechFlag: auto_speech === 'true', speechPrompt: '',
            speakerId: 'Auto', aspectRatio: '16:9', secondaryPageId: 1811,
            channel: 'VEO3', source: 'lunaai.video', type: 'features',
            watermarkFlag: true, privateFlag: true, isTemp: true, vipFlag: true,
            model: model || 'veo-3-fast'
        }, {
            headers: { uniqueid: uid, verify: cf.result.token }
        });

        const recordId = task.data.recordId;
        const verifyToken = cf.result.token;
        const combinedTicket = `${recordId}|||${uid}|||${verifyToken}`;
        const encodedTicket = Buffer.from(combinedTicket).toString('base64');

        await logApiRequest(endpoint, 200);
        res.status(200).json({
            success: true,
            message: "V2 video generation started. Use the ticket to get the result.",
            ticket: encodedTicket
        });

    } catch (error) {
        await logApiRequest(endpoint, 500);
        res.status(500).json({ success: false, error: 'Failed to start V2 video generation.', details: error.message });
    }
}
