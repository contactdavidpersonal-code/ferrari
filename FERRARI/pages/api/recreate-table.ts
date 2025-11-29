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
      // Drop and recreate the listings table with comprehensive fields
      await sql`DROP TABLE IF EXISTS listings CASCADE`;
      
      await sql`CREATE TABLE listings (
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
        rent_monthly numeric,
        beds int,
        baths int,
        half_baths int,
        sqft int,
        lot_acres numeric,
        year_built int,
        property_style text,
        stories int,
        condition text,
        mls_id text unique,
        estimated_taxes numeric,
        property_taxes numeric,
        garage_spaces int,
        garage_type text,
        school_district text,
        township text,
        land_use text,
        utilities jsonb,
        zoning text,
        parking_spaces int,
        features jsonb,
        appliances jsonb,
        heating text,
        cooling text,
        flooring jsonb,
        roof_age int,
        hvac_age int,
        hoa_fees numeric,
        hoa_frequency text,
        rental_income numeric,
        cap_rate numeric,
        occupancy_rate numeric,
        rooms jsonb,
        bedrooms jsonb,
        ai_prompt text,
        description text,
        images jsonb,
        videos jsonb,
        virtual_tour text,
        source_url text,
        listing_date timestamptz
      )`;

      return res.status(200).json({ 
        success: true, 
        message: 'Listings table recreated with comprehensive fields'
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Table recreation failed' });
  }
}
