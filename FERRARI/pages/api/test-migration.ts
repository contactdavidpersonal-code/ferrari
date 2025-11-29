import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end('ok');

  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL || '';
  if (!connectionString) {
    return res.status(500).json({ error: 'Database connection not configured' });
  }

  const sql = neon(connectionString);

  try {
    if (req.method === 'GET') {
      // Try to add one column at a time
      try {
        await sql`ALTER TABLE listings ADD COLUMN IF NOT EXISTS property_style text;`;
        return res.status(200).json({ success: true, message: 'Added property_style column' });
      } catch (error: any) {
        return res.status(500).json({ error: error.message });
      }
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Migration failed' });
  }
}
