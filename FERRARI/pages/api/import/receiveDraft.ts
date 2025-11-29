import type { VercelRequest, VercelResponse } from '@vercel/node';
// server-side JSONBin save (no client imports)
const JSONBIN_API_KEY = process.env.VITE_JSONBIN_API_KEY || process.env.JSONBIN_API_KEY;
const JSONBIN_BIN_ID = process.env.VITE_JSONBIN_BIN_ID || process.env.JSONBIN_BIN_ID;

const ALLOWED_ORIGINS = [
  'https://thepreferredrealty.com',
  'https://www.thepreferredrealty.com',
  'https://bhhspreferredpropertymgt.com',
  'https://www.bhhspreferredpropertymgt.com'
];

function setCors(res: VercelResponse, origin?: string){
  const allow = '*';
  res.setHeader('Access-Control-Allow-Origin', allow);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-import-admin-token');
  res.setHeader('Cache-Control', 'no-store');
}

export default async function handler(req: VercelRequest, res: VercelResponse){
  setCors(res, req.headers.origin as string);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const token = req.headers['x-import-admin-token'];
  if (token !== 'Ferrari100!') return res.status(401).json({ error: 'Unauthorized' });

  try{
    const draft = req.body && typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    if (!draft || !draft.address || !(draft.price || draft.rentMonthly)) {
      return res.status(400).json({ error: 'Invalid draft' });
    }
    let id = Date.now().toString();
    const previewUrl = `/nms-admin#imports`;
    if (!JSONBIN_API_KEY || !JSONBIN_BIN_ID){
      return res.status(200).json({ ok: true, id, previewUrl, wrote:false, reason:'jsonbin_credentials_missing' });
    }
    // fetch latest record
    const latest = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}/latest`,{
      headers:{'X-Master-Key': JSONBIN_API_KEY, 'Content-Type':'application/json'}
    });
    let record:any = { properties:[], leads:[], communications:[], notes:[], imports:[] };
    if (latest.ok){
      const js = await latest.json();
      record = js.record || record;
    }
    const all = Array.isArray(record.imports) ? record.imports : [];
    const item = { id, status:'pending', createdAt: new Date().toISOString(), sourceUrl: draft.sourceUrl, listingDraft: draft, confidence: draft.confidence||{} };
    all.push(item);
    const put = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`,{
      method:'PUT',
      headers:{'X-Master-Key': JSONBIN_API_KEY, 'Content-Type':'application/json'},
      body: JSON.stringify({ ...record, imports: all })
    });
    if (!put.ok){
      const t = await put.text();
      return res.status(200).json({ ok:true, id, previewUrl, wrote:false, putStatus: put.status, body: t });
    }
    return res.status(200).json({ ok:true, id, previewUrl, wrote:true, importsCount: all.length });
  }catch(e:any){
    return res.status(500).json({ error: e.message || 'Server error' });
  }
}


