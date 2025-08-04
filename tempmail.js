import axios from 'axios';
import cheerio from 'cheerio';
import { logApiRequest } from '../../utils/logger';

class TempMail {
  static domains = ['anjay.id', 'capcutisme.com', 'moviesme.com', 'freepalestine.id', 'motionisme.com'];
  static base = 'https://premiumisme.info/mailbox';
  static async createEmail(username, domain) { if (!this.domains.includes(domain)) throw new Error('❌ Domain tidak tersedia.'); if (!/^[a-z0-9._]+$/i.test(username)) throw new Error('❌ Username tidak valid.'); return `${username}@${domain}`; }
  static async getInbox(email) { try { const res = await axios.get(`${this.base}?email=${email}`); const $ = cheerio.load(res.data); const list = []; $('table tbody tr').each((i, el) => { const from = $(el).find('td').eq(0).text().trim(); const subject = $(el).find('td').eq(1).text().trim(); const time = $(el).find('td').eq(2).text().trim(); const href = $(el).find('a.btn.btn-sm.btn-primary').attr('href') || ''; const id = href.split('?read=').pop(); list.push({ from, subject, time, id, readUrl: `${this.base}?read=${id}` }); }); return { success: true, email, total: list.length, inbox: list }; } catch { return { success: false, email, inbox: [] }; } }
  static async readMessage(id) { try { const res = await axios.get(`${this.base}?read=${id}`); const $ = cheerio.load(res.data); const from = $('table.table tr').eq(0).find('td').eq(1).text().trim(); const to = $('table.table tr').eq(1).find('td').eq(1).text().trim(); const subject = $('table.table tr').eq(2).find('td').eq(1).text().trim(); const content = $('div.card-body').text().trim(); return { success: true, from, to, subject, content }; } catch { return { success: false, from: '', to: '', subject: '', content: '' }; } }
}

export default async function handler(req, res) {
    const endpoint = '/api/tempmail';
    const { action, username, domain, email, id } = req.query;
    try {
        let result;
        switch (action) {
            case 'create': result = await TempMail.createEmail(username, domain); break;
            case 'inbox': result = await TempMail.getInbox(email); break;
            case 'read': result = await TempMail.readMessage(id); break;
            default:
                await logApiRequest(endpoint, 400);
                return res.status(400).json({ error: 'Invalid action. Available: create, inbox, read' });
        }
        await logApiRequest(endpoint, 200);
        res.status(200).json({ success: true, result });
    } catch (error) {
        await logApiRequest(endpoint, 500);
        res.status(500).json({ success: false, error: 'Failed to process request.', details: String(error) });
    }
}
