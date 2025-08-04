import { logApiRequest } from '../../utils/logger';

export const config = {
    api: {
        bodyParser: false, // Penting untuk menangani form-data
    },
};

async function transcribe(buffer) {
    const FormData = (await import('form-data')).default;
    const axios = (await import('axios')).default;

    if (!buffer || !Buffer.isBuffer(buffer)) throw new Error('Audio buffer is required');
    const form = new FormData();
    form.append('file', buffer, `${Date.now()}_upload.mp3`);
    const { data } = await axios.post('https://audio-transcription-api.752web.workers.dev/api/transcribe', form, {
        headers: form.getHeaders()
    });
    return data.transcription;
}

export default async function handler(req, res) {
    const endpoint = '/api/transcribe-audio';

    if (req.method !== 'POST') {
        await logApiRequest(endpoint, 405);
        return res.status(405).json({ error: 'Method Not Allowed. Please use POST.' });
    }

    try {
        const formidable = (await import('formidable')).default;
        const fs = (await import('fs')).promises;
        
        const form = formidable({});
        const [fields, files] = await form.parse(req);
        
        const audioFile = files.audio?.[0];
        if (!audioFile) {
            await logApiRequest(endpoint, 400);
            return res.status(400).json({ success: false, error: 'Audio file is required in the "audio" field.' });
        }
        
        const buffer = await fs.readFile(audioFile.filepath);
        const result = await transcribe(buffer);
        
        await logApiRequest(endpoint, 200);
        res.status(200).json({ success: true, transcription: result });

    } catch (error) {
        await logApiRequest(endpoint, 500);
        res.status(500).json({ success: false, error: 'Failed to transcribe audio.', details: error.message });
    }
}
