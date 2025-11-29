import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql, ensureSchema } from '../../../../lib/neon';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-import-admin-token');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (req.headers['x-import-admin-token'] !== 'Ferrari100!') return res.status(401).json({ error: 'Unauthorized' });

  try{
    await ensureSchema();
    const { id } = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    if (!id) return res.status(400).json({ error: 'Missing id' });
    await sql(`update imports set status='rejected' where id=$1`, [id]);
    return res.status(200).json({ ok:true });
  }catch(e:any){
    return res.status(500).json({ error: e.message || 'Server error' });
  }
}


