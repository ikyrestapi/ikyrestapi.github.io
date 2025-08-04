// File: pages/api/waifu/oral.js

import axios from 'axios';
import { logApiRequest } from '../../../utils/logger';

// Fungsi inti untuk mengambil gambar dari Waifu.im
async function getWaifuImage(tag) {
    // 1. Dapatkan daftar gambar dari API waifu.im
    const { data } = await axios.get(`https://api.waifu.im/search?included_tags=${tag}&is_nsfw=true`);

    if (!data.images || data.images.length === 0) {
        throw new Error(`No images found for tag: ${tag}`);
    }

    // 2. Pilih satu gambar secara acak dari array 'images'
    const images = data.images;
    const randomImage = images[Math.floor(Math.random() * images.length)];
    const imageUrl = randomImage.url;
    
    if (!imageUrl) {
        throw new Error('Randomly selected image does not have a URL.');
    }

    // 3. Download gambar yang dipilih sebagai buffer
    const imageResponse = await axios.get(imageUrl, {
        responseType: 'arraybuffer' // Kunci untuk mendapatkan data sebagai buffer
    });

    // 4. Tentukan Content-Type secara dinamis berdasarkan ekstensi file
    const extension = randomImage.extension.substring(1); // Hapus titik (misal, '.jpeg' -> 'jpeg')
    const mimeType = `image/${extension}`;

    // Kembalikan buffer dan tipe MIME-nya
    return {
        buffer: imageResponse.data,
        mimeType: mimeType
    };
}


// Handler API Next.js
export default async function handler(req, res) {
    const endpoint = '/api/waifu/oral';
    const tag = 'oral'; // Tag spesifik untuk file ini

    try {
        const { buffer, mimeType } = await getWaifuImage(tag);

        // Atur header respons untuk memberitahu browser ini adalah file gambar/gif
        res.setHeader('Content-Type', mimeType);
        res.setHeader('Content-Length', buffer.length);
        
        // Kirim buffer gambar sebagai respons
        res.send(buffer);
        await logApiRequest(endpoint, 200);

    } catch (error) {
        await logApiRequest(endpoint, 500);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch image from Waifu.im.',
            details: error.message
        });
    }
}
