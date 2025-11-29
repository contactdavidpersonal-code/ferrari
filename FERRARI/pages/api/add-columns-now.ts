import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end('ok');

  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL || '';
  const sql = neon(connectionString);

  if (req.method === 'GET') {
    const results: any[] = [];
    
    const columns = [
      'property_style text',
      'stories int',
      'condition text',
      'estimated_taxes numeric',
      'property_taxes numeric',
      'garage_spaces int',
      'garage_type text',
      'school_district text',
      'township text',
      'land_use text',
      'utilities jsonb',
      'zoning text',
      'parking_spaces int',
      'appliances jsonb',
      'heating text',
      'cooling text',
      'flooring jsonb',
      'roof_age int',
      'hvac_age int',
      'hoa_fees numeric',
      'hoa_frequency text',
      'rental_income numeric',
      'cap_rate numeric',
      'occupancy_rate numeric',
      'rooms jsonb',
      'bedrooms jsonb',
      'ai_prompt text',
      'virtual_tour text'
    ];

    for (const column of columns) {
      try {
        await sql(`ALTER TABLE listings ADD COLUMN ${column}`);
        results.push({ column, status: 'added' });
      } catch (error: any) {
        results.push({ column, status: 'error', message: error.message });
      }
    }

    return res.status(200).json({ results });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
