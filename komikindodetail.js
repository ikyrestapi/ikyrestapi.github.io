import axios from 'axios';
import { logApiRequest } from '../../utils/logger';

async function getKomikDetailById(id) {
    if (!id || isNaN(id)) {
        throw new Error("ID Komik yang valid diperlukan.");
    }

    try {
        const url = `https://kmkindo.click/?page=manga&id=${id}`;
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 10; Redmi Note 4 Build/QQ3A.200905.001)',
                'host': 'kmkindo.click',
                'connection': 'Keep-Alive'
            }
        });

        // API mengembalikan array, kita ambil objek pertama
        if (Array.isArray(data) && data.length > 0) {
            return data[0];
        } else {
            throw new Error("Komik tidak ditemukan atau respons dari API tidak valid.");
        }
    } catch (error) {
        // Menangkap error dari axios atau jika data tidak valid
        throw new Error(error.message || "Gagal mengambil data detail komik.");
    }
}

export default async function handler(req, res) {
    const endpoint = '/api/komikindodetail';
    const { id } = req.query;

    if (!id) {
        await logApiRequest(endpoint, 400);
        return res.status(400).json({ error: 'Query `id` is required.' });
    }

    try {
        const result = await getKomikDetailById(id);
        await logApiRequest(endpoint, 200);
        res.status(200).json({ success: true, result });
    } catch (error) {
        await logApiRequest(endpoint, 500);
        res.status(500).json({ success: false, error: 'Failed to process request.', details: String(error) });
    }
}
