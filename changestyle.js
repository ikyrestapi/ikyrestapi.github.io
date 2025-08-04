import ws from 'ws';
import axios from 'axios';
import { logApiRequest } from '../../utils/logger';

async function changestyle(buffer, style = 'anime') {
    const _style = { anime: [], ghibli: ['ghibli_style_offset:0.8'] };
    if (!buffer || !Buffer.isBuffer(buffer)) throw new Error('Image buffer is required');
    if (!Object.keys(_style).includes(style)) throw new Error(`Available styles: ${Object.keys(_style).join(', ')}`);
    const session_hash = Math.random().toString(36).substring(2);
    const socket = new ws('wss://colorifyai.art/demo-auto-coloring/queue/join');
    return new Promise(async (resolve, reject) => {
        socket.on('message', (data) => {
            const d = JSON.parse(data.toString('utf8'));
            if (d.msg === 'send_hash') { socket.send(JSON.stringify({ session_hash })); } 
            else if (d.msg === 'send_data') { socket.send(JSON.stringify({ data: { lora: _style[style], source_image: `data:image/jpeg;base64,${buffer.toString('base64')}`, prompt: '(masterpiece), best quality', request_from: 10 } })); } 
            else if (d.msg === 'process_completed') { socket.close(); resolve(`https://temp.colorifyai.art/${d.output.result[0]}`); }
        });
        socket.on('error', reject);
    });
}

export default async function handler(req, res) {
    const endpoint = '/api/changestyle';
    const { url, style } = req.query;
    if (!url) {
        await logApiRequest(endpoint, 400);
        return res.status(400).json({ error: 'Query `url` is required.' });
    }
    try {
        const imageBuffer = await axios.get(url, { responseType: 'arraybuffer' }).then(res => Buffer.from(res.data));
        const result = await changestyle(imageBuffer, style);
        await logApiRequest(endpoint, 200);
        res.status(200).json({ success: true, result_url: result });
    } catch (error) {
        await logApiRequest(endpoint, 500);
        res.status(500).json({ success: false, error: 'Failed to process request.', details: String(error) });
    }
}
