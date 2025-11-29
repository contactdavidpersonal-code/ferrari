import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql, ensureSchema } from '../../../../lib/neon';

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (_req.method === 'OPTIONS') return res.status(204).end();
  try{
    await ensureSchema();
    const rows = await sql(`select id, created_at, status, source_url, listing_draft, confidence from imports where status = 'pending' order by created_at desc`);
    return res.status(200).json({ imports: rows });
  }catch(e:any){
    return res.status(500).json({ error: e.message || 'Server error', imports: [] });
  }
}


