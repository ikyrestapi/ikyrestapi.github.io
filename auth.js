import { logApiRequest } from '../../utils/logger';

export default async function handler(req, res) {
    const endpoint = '/api/auth';
    if (req.method !== 'POST') {
        await logApiRequest(endpoint, 405);
        return res.status(405).end();
    }
    const { username, password } = req.body;
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (username === adminUsername && password === adminPassword) {
        await logApiRequest(endpoint, 200);
        res.status(200).json({ success: true });
    } else {
        await logApiRequest(endpoint, 401);
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
}
