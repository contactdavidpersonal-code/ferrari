import { neon } from '@neondatabase/serverless';

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL || '';

if (!connectionString) {
  console.warn('DATABASE_URL/POSTGRES_URL not set');
}

export const sql = neon(connectionString);

export async function ensureSchema() {
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
    sqft int,
    lot_acres numeric,
    year_built int,
    mls_id text unique,
    features jsonb,
    description text,
    images jsonb,
    videos jsonb,
    source_url text,
    listing_date timestamptz
  )`);

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


