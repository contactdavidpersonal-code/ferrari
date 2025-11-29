import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  console.warn('DATABASE_URL is not set. Neon Postgres will not be available.');
}

export const sql = process.env.DATABASE_URL
  ? neon(process.env.DATABASE_URL)
  : neon(process.env.POSTGRES_URL || '');

export async function ensureSchema() {
  // Create comprehensive listings table with all fields
  await sql(`create table if not exists listings (
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
  )`);

  // Add missing columns to existing table - check if column exists first
  const columnsToAdd = [
    { name: 'property_style', type: 'text' },
    { name: 'stories', type: 'int' },
    { name: 'condition', type: 'text' },
    { name: 'estimated_taxes', type: 'numeric' },
    { name: 'property_taxes', type: 'numeric' },
    { name: 'garage_spaces', type: 'int' },
    { name: 'garage_type', type: 'text' },
    { name: 'school_district', type: 'text' },
    { name: 'township', type: 'text' },
    { name: 'land_use', type: 'text' },
    { name: 'utilities', type: 'jsonb' },
    { name: 'zoning', type: 'text' },
    { name: 'parking_spaces', type: 'int' },
    { name: 'appliances', type: 'jsonb' },
    { name: 'heating', type: 'text' },
    { name: 'cooling', type: 'text' },
    { name: 'flooring', type: 'jsonb' },
    { name: 'roof_age', type: 'int' },
    { name: 'hvac_age', type: 'int' },
    { name: 'hoa_fees', type: 'numeric' },
    { name: 'hoa_frequency', type: 'text' },
    { name: 'rental_income', type: 'numeric' },
    { name: 'cap_rate', type: 'numeric' },
    { name: 'occupancy_rate', type: 'numeric' },
    { name: 'rooms', type: 'jsonb' },
    { name: 'bedrooms', type: 'jsonb' },
    { name: 'ai_prompt', type: 'text' },
    { name: 'virtual_tour', type: 'text' }
  ];

  for (const col of columnsToAdd) {
    try {
      // Check if column exists
      const exists = await sql`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'listings' AND column_name = ${col.name}
      `;
      
      if (!exists || exists.length === 0) {
        // Column doesn't exist, add it
        await sql(`ALTER TABLE listings ADD COLUMN ${col.name} ${col.type}`);
      }
    } catch (error) {
      // Column might already exist or other error, continue
    }
  }

  await sql(`create table if not exists imports (
    id text primary key,
    created_at timestamptz default now(),
    status text default 'pending',
    source_url text,
    listing_draft jsonb not null,
    confidence jsonb
  )`);

  await sql(`create table if not exists leads (
    id bigserial primary key,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    name text,
    email text,
    phone text,
    source text,
    interest text,
    status text,
    priority text,
    notes text,
    data jsonb
  )`);

  await sql(`create table if not exists conversations (
    id bigserial primary key,
    created_at timestamptz default now(),
    user_id text,
    page text,
    messages jsonb,
    summary text,
    tags text[]
  )`);
}


