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
    const rows = await sql(`select listing_draft from imports where id=$1`, [id]);
    if (!rows || rows.length === 0) return res.status(404).json({ error: 'Not found' });
    const d = rows[0].listing_draft;
    // upsert into listings by mls_id or address+city+state
    const upsert = await sql(`
      insert into listings (status, type, address, city, state, zip, price, rent_monthly, beds, baths, sqft, lot_acres, year_built, mls_id, features, description, images, videos, source_url, listing_date, updated_at)
      values ('Active', $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, now(), now())
      on conflict (mls_id) do update set
        status='Active', type=excluded.type, address=excluded.address, city=excluded.city, state=excluded.state, zip=excluded.zip,
        price=excluded.price, rent_monthly=excluded.rent_monthly, beds=excluded.beds, baths=excluded.baths, sqft=excluded.sqft,
        lot_acres=excluded.lot_acres, year_built=excluded.year_built, features=excluded.features, description=excluded.description,
        images=excluded.images, videos=excluded.videos, source_url=excluded.source_url, listing_date=excluded.listing_date, updated_at=now()
      returning id
    `,[
      d.type || 'Residential', d.address||'', d.city||'', d.state||'', d.zip||'', d.price||null, d.rentMonthly||null,
      d.beds||null, d.baths||null, d.sqft||null, d.lotSizeAcres||null, d.yearBuilt||null, d.mlsId||null,
      JSON.stringify(d.features||[]), d.description||null, JSON.stringify(d.images||[]), JSON.stringify(d.videos||[]), d.sourceUrl||null
    ]);
    await sql(`update imports set status='approved' where id=$1`, [id]);
    return res.status(200).json({ ok:true, listingId: upsert?.[0]?.id });
  }catch(e:any){
    return res.status(500).json({ error: e.message || 'Server error' });
  }
}


