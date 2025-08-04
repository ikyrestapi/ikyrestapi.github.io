import axios from 'axios';
import cheerio from 'cheerio';
async function aoirandom(jumlah = 1) {
    try {
        const response = await axios.get('https://aoi.live');
        const $ = cheerio.load(response.data);
        const img = [], judul = [], like = [];
        $('img.post-image').each((_, element) => { const imags = $(element).attr('src'); if (imags) img.push(imags); });
        $('div[data-v-3b96c720]').each((_, element) => { const title = $(element).text().trim(); if (title) judul.push(title); });
        $('div.num-text').each((_, element) => { const jumlhlik = $(element).text().trim(); if (jumlhlik) like.push(jumlhlik); });
        const randomimg = [], judule = [], jmlhlike = [];
        while (randomimg.length < jumlah && img.length > 0 && judul.length > 0 && like.length > 0) {
            const ri = Math.floor(Math.random() * img.length);
            randomimg.push(img.splice(ri, 1)[0]);
            judule.push(judul.splice(ri, 1)[0]);
            jmlhlike.push(like.splice(ri, 1)[0]);
        }
        return randomimg.map((img, index) => ({ Gambar: img, judul: judule[index] || 'No title', like: jmlhlike[index] || '0' }));
    } catch (error) { return []; }
}
export default async function handler(req, res) {
    const { count } = req.query;
    try {
        const result = await aoirandom(parseInt(count) || 1);
        res.status(200).json({ success: true, result });
    } catch (error) { res.status(500).json({ success: false, error: 'Failed to process request.', details: String(error) }); }
}
