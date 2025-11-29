import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-import-admin-token');
  
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Max-Age', '86400');
    return res.status(200).end('ok');
  }

  try {
    const sql = neon(process.env.DATABASE_URL || process.env.POSTGRES_URL || '');
    
    // Create imports table if not exists
    await sql`create table if not exists imports (
      id text primary key,
      created_at timestamptz default now(),
      status text default 'pending',
      source_url text,
      listing_draft jsonb not null,
      confidence jsonb
    )`;

    // Create listings table if not exists
    await sql`create table if not exists listings (
      id bigserial primary key,
      created_at timestamptz default now(),
      updated_at timestamptz default now(),
      status text default 'Active',
      type text not null,
      address text not null,
      city text,
      state text,
      zip text,
      price numeric,
      beds integer,
      baths numeric,
      sqft integer,
      lot_size text,
      year_built integer,
      property_style text,
      stories integer,
      condition text,
      mls_id text,
      mls_number text,
      listing_date timestamptz,
      description text,
      features text[],
      appliances text[],
      flooring text[],
      heating text,
      cooling text,
      parking_spaces integer,
      garage_spaces integer,
      garage_type text,
      half_baths integer,
      property_taxes numeric,
      estimated_taxes numeric,
      hoa_fees numeric,
      hoa_frequency text,
      school_district text,
      township text,
      zoning text,
      land_use text,
      utilities text[],
      roof_age integer,
      hvac_age integer,
      rental_income numeric,
      cap_rate numeric,
      occupancy_rate numeric,
      rooms jsonb,
      bedrooms jsonb,
      images text[],
      videos text[],
      virtual_tour text,
      ai_prompt text
    )`;

    // GET - List pending imports
    if (req.method === 'GET') {
      const rows = await sql`
        select id, created_at, status, source_url, listing_draft, confidence 
        from imports 
        where status = 'pending' 
        order by created_at desc
      `;
      return res.status(200).json({ imports: rows });
    }

    // POST - Handle import operations
    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { action } = body;

      // Check admin token for write operations
      if (action !== 'list' && req.headers['x-import-admin-token'] !== 'Ferrari100!') {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      switch (action) {
        case 'receive':
          // Receive new import draft
          const draft = body.draft;
          if (!draft || !draft.address || !(draft.price || draft.rentMonthly)) {
            return res.status(400).json({ error: 'Invalid draft' });
          }
          const id = Date.now().toString();
          await sql`
            insert into imports (id, source_url, listing_draft, confidence) 
            values (${id}, ${draft.sourceUrl || null}, ${JSON.stringify(draft)}, ${JSON.stringify(draft.confidence || {})}) 
            on conflict (id) do nothing
          `;
          return res.status(200).json({ ok: true, id, previewUrl: '/nms-admin#imports' });

        case 'approve':
          // Approve and import listing
          const { importId } = body;
          if (!importId) {
            return res.status(400).json({ error: 'Import ID required' });
          }

          const importRow = await sql`
            select listing_draft from imports where id = ${importId} and status = 'pending'
          `;
          
          if (!importRow.length) {
            return res.status(404).json({ error: 'Import not found' });
          }

          const listingData = importRow[0].listing_draft;
          
          // Insert into listings table
          const result = await sql`
            insert into listings (
              type, address, city, state, zip, price, beds, baths, sqft, lot_size,
              year_built, property_style, stories, condition, mls_id, mls_number,
              listing_date, description, features, appliances, flooring, heating,
              cooling, parking_spaces, garage_spaces, garage_type, half_baths,
              property_taxes, estimated_taxes, hoa_fees, hoa_frequency,
              school_district, township, zoning, land_use, utilities, roof_age,
              hvac_age, rental_income, cap_rate, occupancy_rate, rooms, bedrooms,
              images, videos, virtual_tour, ai_prompt
            ) values (
              ${listingData.type || 'Residential'},
              ${listingData.address},
              ${listingData.city || null},
              ${listingData.state || 'PA'},
              ${listingData.zip || null},
              ${listingData.price || listingData.rentMonthly || null},
              ${listingData.beds || null},
              ${listingData.baths || null},
              ${listingData.sqft || null},
              ${listingData.lotSize || null},
              ${listingData.yearBuilt || null},
              ${listingData.propertyStyle || null},
              ${listingData.stories || null},
              ${listingData.condition || null},
              ${listingData.mlsId || listingData.mlsNumber || null},
              ${listingData.mlsNumber || listingData.mlsId || null},
              ${listingData.listingDate ? new Date(listingData.listingDate) : null},
              ${listingData.description || null},
              ${listingData.features || []},
              ${listingData.appliances || []},
              ${listingData.flooring || []},
              ${listingData.heating || null},
              ${listingData.cooling || null},
              ${listingData.parkingSpaces || null},
              ${listingData.garageSpaces || null},
              ${listingData.garageType || null},
              ${listingData.halfBaths || null},
              ${listingData.propertyTaxes || null},
              ${listingData.estimatedTaxes || null},
              ${listingData.hoaFees || null},
              ${listingData.hoaFrequency || null},
              ${listingData.schoolDistrict || null},
              ${listingData.township || null},
              ${listingData.zoning || null},
              ${listingData.landUse || null},
              ${listingData.utilities || []},
              ${listingData.roofAge || null},
              ${listingData.hvacAge || null},
              ${listingData.rentalIncome || null},
              ${listingData.capRate || null},
              ${listingData.occupancyRate || null},
              ${listingData.rooms ? JSON.stringify(listingData.rooms) : null},
              ${listingData.bedrooms ? JSON.stringify(listingData.bedrooms) : null},
              ${listingData.images || []},
              ${listingData.videos || []},
              ${listingData.virtualTour || null},
              ${listingData.aiPrompt || null}
            )
            returning id
          `;

          // Mark import as approved
          await sql`
            update imports 
            set status = 'approved' 
            where id = ${importId}
          `;

          return res.status(200).json({ 
            ok: true, 
            listingId: result[0]?.id,
            message: 'Import approved and listing created'
          });

        case 'reject':
          // Reject import
          const { importId: rejectId } = body;
          if (!rejectId) {
            return res.status(400).json({ error: 'Import ID required' });
          }

          await sql`
            update imports 
            set status = 'rejected' 
            where id = ${rejectId}
          `;

          return res.status(200).json({ ok: true, message: 'Import rejected' });

        default:
          return res.status(400).json({ error: 'Invalid action' });
      }
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (e: any) {
    console.error('Import API error:', e);
    return res.status(500).json({ error: e.message || 'Server error' });
  }
}
