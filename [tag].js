// File: pages/api/waifu/[tag].js

import axios from 'axios';
import { logApiRequest } from '../../../utils/logger';

// Daftar tag yang kita dukung untuk mencegah penyalahgunaan
const SFW_TAGS = ['maid', 'waifu', 'marin-kitagawa', 'mori-calliope', 'raiden-shogun', 'oppai', 'selfies', 'uniform', 'kamisato-ayaka'];
const NSFW_TAGS = ['ass', 'hentai', 'milf', 'oral', 'paizuri', 'ecchi', 'ero'];
const ALL_TAGS = [...SFW_TAGS, ...NSFW_TAGS];

async function getWaifuImage(tag, isNsfw) {
    const { data } = await axios.get(`https://api.waifu.im/search`, {
        params: {
            included_tags: tag,
            is_nsfw: isNsfw
        }
    });

    if (!data.images || data.images.length === 0) {
        throw new Error(`No images found for tag: ${tag}`);
    }

    const images = data.images;
    const randomImage = images[Math.floor(Math.random() * images.length)];
    const imageUrl = randomImage.url;
    
    if (!imageUrl) {
        throw new Error('Randomly selected image does not have a URL.');
    }

    const imageResponse = await axios.get(imageUrl, {
        responseType: 'arraybuffer'
    });

    const extension = randomImage.extension.substring(1);
    const mimeType = `image/${extension}`;

    return {
        buffer: imageResponse.data,
        mimeType: mimeType
    };
}

export default async function handler(req, res) {
    const { tag } = req.query;
    const endpoint = `/api/waifu/${tag}`;

    if (!ALL_TAGS.includes(tag)) {
        await logApiRequest(endpoint, 404);
        return res.status(404).json({ success: false, error: `Tag "${tag}" is not supported.` });
    }

    const isNsfw = NSFW_TAGS.includes(tag);

    try {
        const { buffer, mimeType } = await getWaifuImage(tag, isNsfw);

        res.setHeader('Content-Type', mimeType);
        res.setHeader('Content-Length', buffer.length);
        
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
