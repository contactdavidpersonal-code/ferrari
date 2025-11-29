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
    if (req.method === 'POST') {
      const { sql: sqlQuery } = req.body;
      if (!sqlQuery) {
        return res.status(400).json({ error: 'SQL query required' });
      }

      await sql(sqlQuery);
      return res.status(200).json({ success: true });
    }

    if (req.method === 'GET') {
      // Add missing columns to existing listings table
      const migrations = [
        'ALTER TABLE listings ADD COLUMN IF NOT EXISTS property_style text;',
        'ALTER TABLE listings ADD COLUMN IF NOT EXISTS stories int;',
        'ALTER TABLE listings ADD COLUMN IF NOT EXISTS condition text;',
        'ALTER TABLE listings ADD COLUMN IF NOT EXISTS estimated_taxes numeric;',
        'ALTER TABLE listings ADD COLUMN IF NOT EXISTS property_taxes numeric;',
        'ALTER TABLE listings ADD COLUMN IF NOT EXISTS garage_spaces int;',
        'ALTER TABLE listings ADD COLUMN IF NOT EXISTS garage_type text;',
        'ALTER TABLE listings ADD COLUMN IF NOT EXISTS school_district text;',
        'ALTER TABLE listings ADD COLUMN IF NOT EXISTS township text;',
        'ALTER TABLE listings ADD COLUMN IF NOT EXISTS land_use text;',
        'ALTER TABLE listings ADD COLUMN IF NOT EXISTS utilities jsonb;',
        'ALTER TABLE listings ADD COLUMN IF NOT EXISTS zoning text;',
        'ALTER TABLE listings ADD COLUMN IF NOT EXISTS parking_spaces int;',
        'ALTER TABLE listings ADD COLUMN IF NOT EXISTS appliances jsonb;',
        'ALTER TABLE listings ADD COLUMN IF NOT EXISTS heating text;',
        'ALTER TABLE listings ADD COLUMN IF NOT EXISTS cooling text;',
        'ALTER TABLE listings ADD COLUMN IF NOT EXISTS flooring jsonb;',
        'ALTER TABLE listings ADD COLUMN IF NOT EXISTS roof_age int;',
        'ALTER TABLE listings ADD COLUMN IF NOT EXISTS hvac_age int;',
        'ALTER TABLE listings ADD COLUMN IF NOT EXISTS hoa_fees numeric;',
        'ALTER TABLE listings ADD COLUMN IF NOT EXISTS hoa_frequency text;',
        'ALTER TABLE listings ADD COLUMN IF NOT EXISTS rental_income numeric;',
        'ALTER TABLE listings ADD COLUMN IF NOT EXISTS cap_rate numeric;',
        'ALTER TABLE listings ADD COLUMN IF NOT EXISTS occupancy_rate numeric;',
        'ALTER TABLE listings ADD COLUMN IF NOT EXISTS rooms jsonb;',
        'ALTER TABLE listings ADD COLUMN IF NOT EXISTS bedrooms jsonb;',
        'ALTER TABLE listings ADD COLUMN IF NOT EXISTS ai_prompt text;',
        'ALTER TABLE listings ADD COLUMN IF NOT EXISTS virtual_tour text;'
      ];

      for (const migration of migrations) {
        try {
          await sql(migration);
        } catch (error) {
          console.log(`Migration failed: ${migration}`, error);
        }
      }

      return res.status(200).json({ success: true, message: 'Migrations completed' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Migration failed' });
  }
}
