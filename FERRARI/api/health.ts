import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  try {
    // Check database connection
    const sql = neon(process.env.DATABASE_URL || process.env.POSTGRES_URL || '');
    const dbResult = await sql`select 1 as up`;
    const dbUp = dbResult?.[0]?.up === 1;

    return res.status(200).json({ 
      ok: true, 
      time: new Date().toISOString(),
      database: dbUp ? 'connected' : 'disconnected'
    });
  } catch (e: any) {
    return res.status(200).json({ 
      ok: true, 
      time: new Date().toISOString(),
      database: 'error',
      error: e.message 
    });
  }
}


