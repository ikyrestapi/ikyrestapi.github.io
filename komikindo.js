import axios from 'axios';
import { logApiRequest } from '../../utils/logger';

class KomikIndo {
    constructor() { this.client = axios.create({ baseURL: 'https://kmkindo.click', headers: { 'user-agent': 'Dalvik/2.1.0 (Linux; U; Android 10; Redmi Note 4 Build/QQ3A.200905.001)', host: 'kmkindo.click', connection: 'Keep-Alive', 'accept-encoding': 'gzip' } }); this.kmkRegex = /^https?:\/\/kmkindo\.click\/?\?.*?page=(manga|chapter).*?id=(\d+)/; }
    search = async function (query, page = '1') { if (!query) throw new Error('Query is required'); if (page && isNaN(page)) throw new Error('Invalid page input'); const { data } = await this.client(`?page=search&search=${query}&paged=${page}`); return data; }
    detail = async function (url) { const match = url.match(this.kmkRegex); if (!url || !match) throw new Error('Invalid url'); const [, page, id] = match; if (page !== 'manga') throw new Error('Invalid url'); const { data } = await this.client(`?page=manga&id=${id}`); return data; }
    getImage = async function (url) { const match = url.match(this.kmkRegex); if (!url || !match) throw new Error('Invalid url'); const [, page, id] = match; if (page !== 'chapter') throw new Error('Invalid url'); const { data } = await this.client(`?page=chapter&id=${id}`); return data; }
}

export default async function handler(req, res) {
    const endpoint = '/api/komikindo';
    const { action, query, url, page } = req.query;
    const k = new KomikIndo();
    try {
        let result;
        switch (action) {
            case 'search': result = await k.search(query, page); break;
            case 'detail': result = await k.detail(url); break;
            case 'chapter': result = await k.getImage(url); break;
            default:
                await logApiRequest(endpoint, 400);
                return res.status(400).json({ error: 'Invalid action. Available: search, detail, chapter' });
        }
        await logApiRequest(endpoint, 200);
        res.status(200).json({ success: true, result });
    } catch (error) {
        await logApiRequest(endpoint, 500);
        res.status(500).json({ success: false, error: 'Failed to process request.', details: String(error) });
    }
}
