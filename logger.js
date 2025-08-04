import { kv } from '@vercel/kv';
export async function logApiRequest(endpoint, status) {
    try {
        const logEntry = {
            timestamp: new Date().toISOString(),
            endpoint,
            status: status === 200 ? 'SUCCESS' : 'FAILED',
            statusCode: status
        };
        await kv.lpush('api_logs', JSON.stringify(logEntry));
        await kv.ltrim('api_logs', 0, 99);
    } catch (error) {
        console.error("Failed to write log:", error);
    }
}
