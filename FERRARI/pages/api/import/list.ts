import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (_req.method === 'OPTIONS') return res.status(204).end();

  const JSONBIN_API_KEY = process.env.VITE_JSONBIN_API_KEY || process.env.JSONBIN_API_KEY;
  const JSONBIN_BIN_ID = process.env.VITE_JSONBIN_BIN_ID || process.env.JSONBIN_BIN_ID;
  if (!JSONBIN_API_KEY || !JSONBIN_BIN_ID) {
    return res.status(200).json({ imports: [] });
  }
  try{
    const latest = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}/latest`,{
      headers:{'X-Master-Key': JSONBIN_API_KEY, 'Content-Type':'application/json'}
    });
    if(!latest.ok){
      return res.status(200).json({ imports: [] });
    }
    const record = (await latest.json()).record || {};
    return res.status(200).json({ imports: record.imports || [] });
  }catch(e:any){
    return res.status(200).json({ imports: [] });
  }
}


