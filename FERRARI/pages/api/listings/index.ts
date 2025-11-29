import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql, ensureSchema } from '../../../lib/neon';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  try{
    await ensureSchema();
    if (req.method === 'GET'){
      const rows = await sql`select id, status, type, address, city, state, zip, price, rent_monthly, beds, baths, half_baths, sqft, lot_acres, year_built, property_style, stories, condition, mls_id, estimated_taxes, property_taxes, garage_spaces, garage_type, school_district, township, land_use, utilities, zoning, parking_spaces, features, appliances, heating, cooling, flooring, roof_age, hvac_age, hoa_fees, hoa_frequency, rental_income, cap_rate, occupancy_rate, rooms, bedrooms, ai_prompt, description, images, videos, virtual_tour, source_url, listing_date from listings where status='Active' order by listing_date desc nulls last, updated_at desc`;
      return res.status(200).json({ listings: rows });
    }
    if (req.method === 'POST'){
      const b = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const upsert = await sql`
        insert into listings (status, type, address, city, state, zip, price, rent_monthly, beds, baths, half_baths, sqft, lot_acres, year_built, property_style, stories, condition, mls_id, estimated_taxes, property_taxes, garage_spaces, garage_type, school_district, township, land_use, utilities, zoning, parking_spaces, features, appliances, heating, cooling, flooring, roof_age, hvac_age, hoa_fees, hoa_frequency, rental_income, cap_rate, occupancy_rate, rooms, bedrooms, ai_prompt, description, images, videos, virtual_tour, source_url, listing_date, updated_at)
        values (${b.status||'Active'}, ${b.type}, ${b.address}, ${b.city}, ${b.state}, ${b.zipCode||b.zip}, ${b.price||null}, ${b.rentMonthly||null}, 
        ${b.beds||null}, ${b.baths||null}, ${b.halfBaths||null}, ${b.sqft||null}, ${b.lotSizeAcres||b.lotSize||null}, ${b.yearBuilt||null}, 
        ${b.propertyStyle||null}, ${b.stories||null}, ${b.condition||null}, ${b.mlsId||null}, 
        ${b.estimatedTaxes||null}, ${b.propertyTaxes||null}, ${b.garageSpaces||null}, ${b.garageType||null}, 
        ${b.schoolDistrict||null}, ${b.township||null}, ${b.landUse||null}, ${JSON.stringify(b.utilities||[])}, ${b.zoning||null}, ${b.parkingSpaces||null},
        ${JSON.stringify(b.features||[])}, ${JSON.stringify(b.appliances||[])}, ${b.heating||null}, ${b.cooling||null}, ${JSON.stringify(b.flooring||[])},
        ${b.roofAge||null}, ${b.hvacAge||null}, ${b.hoaFees||null}, ${b.hoaFrequency||null}, ${b.rentalIncome||null}, ${b.capRate||null}, ${b.occupancyRate||null},
        ${JSON.stringify(b.rooms||[])}, ${JSON.stringify(b.bedrooms||[])}, ${b.aiPrompt||null}, ${b.description||null}, 
        ${JSON.stringify(b.images||[])}, ${JSON.stringify(b.videos||[])}, ${b.virtualTour||null}, ${b.sourceUrl||null}, 
        ${b.listingDate? new Date(b.listingDate).toISOString(): null}, now())
        on conflict (mls_id) do update set 
          status=excluded.status, type=excluded.type, address=excluded.address, city=excluded.city, state=excluded.state, zip=excluded.zip, price=excluded.price, rent_monthly=excluded.rent_monthly, beds=excluded.beds, baths=excluded.baths, half_baths=excluded.half_baths, sqft=excluded.sqft, lot_acres=excluded.lot_acres, year_built=excluded.year_built, property_style=excluded.property_style, stories=excluded.stories, condition=excluded.condition, estimated_taxes=excluded.estimated_taxes, property_taxes=excluded.property_taxes, garage_spaces=excluded.garage_spaces, garage_type=excluded.garage_type, school_district=excluded.school_district, township=excluded.township, land_use=excluded.land_use, utilities=excluded.utilities, zoning=excluded.zoning, parking_spaces=excluded.parking_spaces, features=excluded.features, appliances=excluded.appliances, heating=excluded.heating, cooling=excluded.cooling, flooring=excluded.flooring, roof_age=excluded.roof_age, hvac_age=excluded.hvac_age, hoa_fees=excluded.hoa_fees, hoa_frequency=excluded.hoa_frequency, rental_income=excluded.rental_income, cap_rate=excluded.cap_rate, occupancy_rate=excluded.occupancy_rate, rooms=excluded.rooms, bedrooms=excluded.bedrooms, ai_prompt=excluded.ai_prompt, description=excluded.description, images=excluded.images, videos=excluded.videos, virtual_tour=excluded.virtual_tour, source_url=excluded.source_url, listing_date=excluded.listing_date, updated_at=now()
        returning id
      `;
      return res.status(200).json({ ok:true, id: upsert?.[0]?.id });
    }
    return res.status(405).json({ error: 'Method not allowed' });
  }catch(e:any){
    return res.status(500).json({ error: e.message || 'Server error' });
  }
}


