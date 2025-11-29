import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end('ok');

  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL || '';
  if (!connectionString) {
    return res.status(500).json({ error: 'Database connection not configured' });
  }

  const sql = neon(connectionString);

  try {
    if (req.method === 'GET') {
      const columns = await sql`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'listings' 
        ORDER BY ordinal_position
      `;
      
      return res.status(200).json({ 
        columns: columns.map((row: any) => row.column_name)
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Query failed' });
  }
}
