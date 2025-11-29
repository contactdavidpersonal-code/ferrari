import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql, ensureSchema } from '../../../lib/neon';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();

  const id = req.query.id as string;
  if (!id) return res.status(400).json({ error: 'Missing id' });

  try{
    await ensureSchema();
    if (req.method === 'DELETE'){
      await sql`delete from listings where id=${id}`;
      return res.status(200).json({ ok: true });
    }
    if (req.method === 'PATCH'){
      const b = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      await sql`update listings set 
        status=coalesce(${b.status},status), type=coalesce(${b.type},type), address=coalesce(${b.address},address), city=coalesce(${b.city},city), state=coalesce(${b.state},state), zip=coalesce(${b.zipCode||b.zip},zip),
        price=coalesce(${b.price},price), rent_monthly=coalesce(${b.rentMonthly},rent_monthly), beds=coalesce(${b.beds},beds), baths=coalesce(${b.baths},baths), half_baths=coalesce(${b.halfBaths},half_baths), sqft=coalesce(${b.sqft},sqft),
        lot_acres=coalesce(${b.lotSizeAcres||b.lotSize},lot_acres), year_built=coalesce(${b.yearBuilt},year_built), property_style=coalesce(${b.propertyStyle},property_style), stories=coalesce(${b.stories},stories), condition=coalesce(${b.condition},condition),
        estimated_taxes=coalesce(${b.estimatedTaxes},estimated_taxes), property_taxes=coalesce(${b.propertyTaxes},property_taxes), garage_spaces=coalesce(${b.garageSpaces},garage_spaces), garage_type=coalesce(${b.garageType},garage_type),
        school_district=coalesce(${b.schoolDistrict},school_district), township=coalesce(${b.township},township), land_use=coalesce(${b.landUse},land_use), utilities=coalesce(${b.utilities? JSON.stringify(b.utilities): null},utilities), zoning=coalesce(${b.zoning},zoning), parking_spaces=coalesce(${b.parkingSpaces},parking_spaces),
        features=coalesce(${b.features? JSON.stringify(b.features): null},features), appliances=coalesce(${b.appliances? JSON.stringify(b.appliances): null},appliances), heating=coalesce(${b.heating},heating), cooling=coalesce(${b.cooling},cooling), flooring=coalesce(${b.flooring? JSON.stringify(b.flooring): null},flooring),
        roof_age=coalesce(${b.roofAge},roof_age), hvac_age=coalesce(${b.hvacAge},hvac_age), hoa_fees=coalesce(${b.hoaFees},hoa_fees), hoa_frequency=coalesce(${b.hoaFrequency},hoa_frequency),
        rental_income=coalesce(${b.rentalIncome},rental_income), cap_rate=coalesce(${b.capRate},cap_rate), occupancy_rate=coalesce(${b.occupancyRate},occupancy_rate),
        rooms=coalesce(${b.rooms? JSON.stringify(b.rooms): null},rooms), bedrooms=coalesce(${b.bedrooms? JSON.stringify(b.bedrooms): null},bedrooms), ai_prompt=coalesce(${b.aiPrompt},ai_prompt), description=coalesce(${b.description},description),
        images=coalesce(${b.images? JSON.stringify(b.images): null},images), videos=coalesce(${b.videos? JSON.stringify(b.videos): null},videos), virtual_tour=coalesce(${b.virtualTour},virtual_tour), source_url=coalesce(${b.sourceUrl},source_url), listing_date=coalesce(${b.listingDate? new Date(b.listingDate).toISOString(): null},listing_date), updated_at=now()
        where id=${id}`;
      return res.status(200).json({ ok: true });
    }
    if (req.method === 'GET'){
      const rows = await sql`select * from listings where id=${id}`;
      if (!rows || rows.length===0) return res.status(404).json({ error: 'Not found' });
      return res.status(200).json(rows[0]);
    }
    return res.status(405).json({ error: 'Method not allowed' });
  }catch(e:any){
    return res.status(500).json({ error: e.message || 'Server error' });
  }
}


