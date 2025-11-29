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
      // Force add all missing columns one by one
      const results = [];
      
      try {
        await sql`ALTER TABLE listings ADD COLUMN property_style text;`;
        results.push('property_style: added');
      } catch (e: any) {
        results.push(`property_style: ${e.message}`);
      }
      
      try {
        await sql`ALTER TABLE listings ADD COLUMN stories int;`;
        results.push('stories: added');
      } catch (e: any) {
        results.push(`stories: ${e.message}`);
      }
      
      try {
        await sql`ALTER TABLE listings ADD COLUMN condition text;`;
        results.push('condition: added');
      } catch (e: any) {
        results.push(`condition: ${e.message}`);
      }
      
      try {
        await sql`ALTER TABLE listings ADD COLUMN estimated_taxes numeric;`;
        results.push('estimated_taxes: added');
      } catch (e: any) {
        results.push(`estimated_taxes: ${e.message}`);
      }
      
      try {
        await sql`ALTER TABLE listings ADD COLUMN property_taxes numeric;`;
        results.push('property_taxes: added');
      } catch (e: any) {
        results.push(`property_taxes: ${e.message}`);
      }
      
      try {
        await sql`ALTER TABLE listings ADD COLUMN garage_spaces int;`;
        results.push('garage_spaces: added');
      } catch (e: any) {
        results.push(`garage_spaces: ${e.message}`);
      }
      
      try {
        await sql`ALTER TABLE listings ADD COLUMN garage_type text;`;
        results.push('garage_type: added');
      } catch (e: any) {
        results.push(`garage_type: ${e.message}`);
      }
      
      try {
        await sql`ALTER TABLE listings ADD COLUMN school_district text;`;
        results.push('school_district: added');
      } catch (e: any) {
        results.push(`school_district: ${e.message}`);
      }
      
      try {
        await sql`ALTER TABLE listings ADD COLUMN township text;`;
        results.push('township: added');
      } catch (e: any) {
        results.push(`township: ${e.message}`);
      }
      
      try {
        await sql`ALTER TABLE listings ADD COLUMN land_use text;`;
        results.push('land_use: added');
      } catch (e: any) {
        results.push(`land_use: ${e.message}`);
      }
      
      try {
        await sql`ALTER TABLE listings ADD COLUMN utilities jsonb;`;
        results.push('utilities: added');
      } catch (e: any) {
        results.push(`utilities: ${e.message}`);
      }
      
      try {
        await sql`ALTER TABLE listings ADD COLUMN zoning text;`;
        results.push('zoning: added');
      } catch (e: any) {
        results.push(`zoning: ${e.message}`);
      }
      
      try {
        await sql`ALTER TABLE listings ADD COLUMN parking_spaces int;`;
        results.push('parking_spaces: added');
      } catch (e: any) {
        results.push(`parking_spaces: ${e.message}`);
      }
      
      try {
        await sql`ALTER TABLE listings ADD COLUMN appliances jsonb;`;
        results.push('appliances: added');
      } catch (e: any) {
        results.push(`appliances: ${e.message}`);
      }
      
      try {
        await sql`ALTER TABLE listings ADD COLUMN heating text;`;
        results.push('heating: added');
      } catch (e: any) {
        results.push(`heating: ${e.message}`);
      }
      
      try {
        await sql`ALTER TABLE listings ADD COLUMN cooling text;`;
        results.push('cooling: added');
      } catch (e: any) {
        results.push(`cooling: ${e.message}`);
      }
      
      try {
        await sql`ALTER TABLE listings ADD COLUMN flooring jsonb;`;
        results.push('flooring: added');
      } catch (e: any) {
        results.push(`flooring: ${e.message}`);
      }
      
      try {
        await sql`ALTER TABLE listings ADD COLUMN roof_age int;`;
        results.push('roof_age: added');
      } catch (e: any) {
        results.push(`roof_age: ${e.message}`);
      }
      
      try {
        await sql`ALTER TABLE listings ADD COLUMN hvac_age int;`;
        results.push('hvac_age: added');
      } catch (e: any) {
        results.push(`hvac_age: ${e.message}`);
      }
      
      try {
        await sql`ALTER TABLE listings ADD COLUMN hoa_fees numeric;`;
        results.push('hoa_fees: added');
      } catch (e: any) {
        results.push(`hoa_fees: ${e.message}`);
      }
      
      try {
        await sql`ALTER TABLE listings ADD COLUMN hoa_frequency text;`;
        results.push('hoa_frequency: added');
      } catch (e: any) {
        results.push(`hoa_frequency: ${e.message}`);
      }
      
      try {
        await sql`ALTER TABLE listings ADD COLUMN rental_income numeric;`;
        results.push('rental_income: added');
      } catch (e: any) {
        results.push(`rental_income: ${e.message}`);
      }
      
      try {
        await sql`ALTER TABLE listings ADD COLUMN cap_rate numeric;`;
        results.push('cap_rate: added');
      } catch (e: any) {
        results.push(`cap_rate: ${e.message}`);
      }
      
      try {
        await sql`ALTER TABLE listings ADD COLUMN occupancy_rate numeric;`;
        results.push('occupancy_rate: added');
      } catch (e: any) {
        results.push(`occupancy_rate: ${e.message}`);
      }
      
      try {
        await sql`ALTER TABLE listings ADD COLUMN rooms jsonb;`;
        results.push('rooms: added');
      } catch (e: any) {
        results.push(`rooms: ${e.message}`);
      }
      
      try {
        await sql`ALTER TABLE listings ADD COLUMN bedrooms jsonb;`;
        results.push('bedrooms: added');
      } catch (e: any) {
        results.push(`bedrooms: ${e.message}`);
      }
      
      try {
        await sql`ALTER TABLE listings ADD COLUMN ai_prompt text;`;
        results.push('ai_prompt: added');
      } catch (e: any) {
        results.push(`ai_prompt: ${e.message}`);
      }
      
      try {
        await sql`ALTER TABLE listings ADD COLUMN virtual_tour text;`;
        results.push('virtual_tour: added');
      } catch (e: any) {
        results.push(`virtual_tour: ${e.message}`);
      }

      return res.status(200).json({ 
        success: true, 
        message: 'Force migration completed',
        results 
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Force migration failed' });
  }
}
