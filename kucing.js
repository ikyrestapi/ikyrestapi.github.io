import axios from 'axios';
import { logApiRequest } from '../../utils/logger';

class Kucing {
    constructor() { this.client = axios.create({ baseURL: 'https://api.explorethefrontierforlimitlessimaginationanddiscov.com/330cceade91a6a9cd30fb8042222ed56/71b8acf33b508c7543592acd9d9eb70d', headers: { token: 'XbGSFkQsJYbFC6pcUMCFL4oNHULvHU7WdDAXYgpmqYlh7p5ZCQ4QZ13GDgowiOGvAejz9X5H6DYvEQBMrc3A17SO3qwLwVkbn6YY', accept: 'application/json', appbuildcode: '25301', appsignature: 'pOplm8IDEDGXN55IaYohQ8CzJFvWsfXyhGvwPRD9kWgzYSRuuvAOPfsE0AJbHVbAJyWGsGCNUIuQLJ7HbMbuFLMWwDgHNwxOrYMH', 'accept-encoding': 'gzip', 'user-agent': 'okhttp/4.10.0', 'if-modified-since': 'Fri, 20 Jun 2025 07:10:42 GMT' } }); }
    latest = async function () { const { data } = await this.client('/recent'); return data; }
    search = async function (query, page = '1') { if (!query) throw new Error('Query is required'); const { data } = await this.client(`/search?q=${query}&page=${page}`); return data; }
    detail = async function (id) { if (!id || isNaN(id)) throw new Error('ID is required'); const { data } = await this.client(`/post?id=${id}`); return data; }
}

export default async function handler(req, res) {
    const endpoint = '/api/kucing';
    const { action, query, page, id } = req.query;
    const k = new Kucing();
    try {
        let result;
        switch (action) {
            case 'latest': result = await k.latest(); break;
            case 'search': result = await k.search(query, page); break;
            case 'detail': result = await k.detail(id); break;
            default:
                await logApiRequest(endpoint, 400);
                return res.status(400).json({ error: 'Invalid action. Available: latest, search, detail' });
        }
        await logApiRequest(endpoint, 200);
        res.status(200).json({ success: true, result });
    } catch (error) {
        await logApiRequest(endpoint, 500);
        res.status(500).json({ success: false, error: 'Failed to process request.', details: String(error) });
    }
}
