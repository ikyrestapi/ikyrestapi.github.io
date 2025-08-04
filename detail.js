import AnimeLovers from '../../../utils/animelovers';
import { logApiRequest } from '../../../utils/logger';

export default async function handler(req, res) {
    const endpoint = '/api/animelovers/detail';
    const { url } = req.query;

    if (!url) {
        await logApiRequest(endpoint, 400);
        return res.status(400).json({ success: false, error: 'Query parameter "url" is required.' });
    }

    try {
        const animeApi = new AnimeLovers();
        const result = await animeApi.detail(url);
        await logApiRequest(endpoint, 200);
        res.status(200).json({ success: true, result });
    } catch (error) {
        await logApiRequest(endpoint, 500);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch anime details.',
            details: error.message
        });
    }
}
