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
      // Create a test table with comprehensive fields
      await sql`CREATE TABLE IF NOT EXISTS test_listings (
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

      // Insert a test record
      await sql`INSERT INTO test_listings (type, address, city, state, zip, price, beds, baths, sqft, year_built, property_style, condition, stories, half_baths, garage_spaces, garage_type, school_district, township, appliances, flooring, heating, cooling, property_taxes, estimated_taxes, hoa_fees, hoa_frequency, rental_income, cap_rate, occupancy_rate, roof_age, hvac_age, parking_spaces, zoning, land_use, utilities, features, images, mls_id) VALUES ('Residential', '123 Test St', 'Pittsburgh', 'Pennsylvania', '15201', 500000, 4, 3, 2500, 2020, 'Colonial', 'Excellent', 2, 1, 2, 'Attached', 'Pittsburgh Public Schools', 'Pittsburgh', '["Dishwasher", "Refrigerator", "Stove"]', '["Hardwood", "Tile"]', 'Gas', 'Central Air', 8000, 8000, 200, 'Monthly', 3000, 6.0, 95, 5, 3, 4, 'R-1', 'Residential', '["Electric", "Gas", "Water", "Sewer"]', '["Pool", "Fireplace", "Updated Kitchen"]', '["https://picsum.photos/seed/test/800/600"]', 'TEST001')`;

      // Query the test record
      const result = await sql`SELECT * FROM test_listings WHERE mls_id = 'TEST001'`;
      
      return res.status(200).json({ 
        success: true, 
        message: 'Test table created and populated',
        result: result[0]
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Test failed' });
  }
}
