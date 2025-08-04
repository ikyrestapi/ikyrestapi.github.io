import { logApiRequest } from '../../utils/logger';

export default async function handler(req, res) {
  const endpoint = '/api/hello';
  await logApiRequest(endpoint, 200);
  res.status(200).json({ name: "John Doe" });
}
