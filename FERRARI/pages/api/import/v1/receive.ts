import type { VercelRequest, VercelResponse } from '@vercel/node';

const JSONBIN_API_KEY = process.env.VITE_JSONBIN_API_KEY || process.env.JSONBIN_API_KEY;
const JSONBIN_BIN_ID = process.env.VITE_JSONBIN_BIN_ID || process.env.JSONBIN_BIN_ID;

function cors(res: VercelResponse){
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-import-admin-token');
  res.setHeader('Cache-Control', 'no-store');
}

export default async function handler(req: VercelRequest, res: VercelResponse){
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const token = req.headers['x-import-admin-token'];
  if (token !== 'Ferrari100!') return res.status(401).json({ error: 'Unauthorized' });

  try{
    const draft = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    if (!draft || !draft.address || !(draft.price || draft.rentMonthly)) {
      return res.status(400).json({ error: 'Invalid draft' });
    }
    const id = Date.now().toString();
    const previewUrl = '/nms-admin#imports';

    if (!JSONBIN_API_KEY || !JSONBIN_BIN_ID){
      return res.status(200).json({ ok:true, wrote:false, reason:'jsonbin_credentials_missing', id, previewUrl });
    }

    const latest = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}/latest`,{
      headers:{ 'X-Master-Key': JSONBIN_API_KEY, 'Content-Type':'application/json' }
    });
    let record:any = { properties:[], leads:[], communications:[], notes:[], imports:[] };
    if (latest.ok){
      const js = await latest.json();
      record = js.record || record;
    }
    const imports = Array.isArray(record.imports) ? record.imports : [];
    imports.push({ id, status:'pending', createdAt: new Date().toISOString(), sourceUrl: draft.sourceUrl, listingDraft: draft, confidence: draft.confidence||{} });

    const put = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`,{
      method:'PUT',
      headers:{ 'X-Master-Key': JSONBIN_API_KEY, 'Content-Type':'application/json' },
      body: JSON.stringify({ ...record, imports })
    });
    if (!put.ok){
      const body = await put.text();
      return res.status(200).json({ ok:true, wrote:false, putStatus: put.status, body, id, previewUrl });
    }
    return res.status(200).json({ ok:true, wrote:true, importsCount: imports.length, id, previewUrl });
  }catch(e:any){
    return res.status(500).json({ error: e.message || 'Server error' });
  }
}


