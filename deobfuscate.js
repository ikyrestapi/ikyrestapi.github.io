// File: pages/api/deobfuscate.js

import { Deobfuscator } from "deobfuscator";
import { logApiRequest } from '../../utils/logger';

export default async function handler(req, res) {
    const endpoint = '/api/deobfuscate';
    
    // 1. Ubah pengecekan menjadi GET
    if (req.method !== 'GET') {
        await logApiRequest(endpoint, 405);
        return res.status(405).json({ error: 'Method Not Allowed. Please use GET.' });
    }

    // 2. Ambil 'code' dari query parameter, bukan body
    const { code } = req.query; 

    if (!code || typeof code !== 'string') {
        await logApiRequest(endpoint, 400);
        return res.status(400).json({ success: false, error: 'Query parameter "code" is required.' });
    }

    try {
        const deobfuscator = new Deobfuscator();
        const result = await deobfuscator.deobfuscateSource(code);
        await logApiRequest(endpoint, 200);
        res.status(200).json({ success: true, result: result });
    } catch (error) {
        await logApiRequest(endpoint, 500);
        res.status(500).json({
            success: false,
            error: 'Failed to deobfuscate the code.',
            details: error.message,
        });
    }
}
