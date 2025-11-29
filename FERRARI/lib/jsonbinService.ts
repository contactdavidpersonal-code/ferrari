import type { Listing, Lead, Communication, Note } from '../types'

const JSONBIN_API_KEY = import.meta.env.VITE_JSONBIN_API_KEY;
const JSONBIN_BIN_ID = import.meta.env.VITE_JSONBIN_BIN_ID;

if (!JSONBIN_API_KEY || !JSONBIN_BIN_ID) {
  console.warn('JSONBin API key or Bin ID not found. Using localStorage fallback.');
}

// Check if JSONBin is configured
const isJsonBinConfigured = (): boolean => {
  return !!(JSONBIN_API_KEY && JSONBIN_BIN_ID);
};

// Get data from JSONBin
const getJsonBinData = async (): Promise<any> => {
  if (!isJsonBinConfigured()) {
    throw new Error('JSONBin not configured');
  }

  const response = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}/latest`, {
    headers: { 
      'X-Master-Key': JSONBIN_API_KEY,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`JSONBin API error: ${response.status}`);
  }

  const data = await response.json();
  return data.record || { properties: [], leads: [], communications: [], notes: [], imports: [] };
};

// Save data to JSONBin
const saveJsonBinData = async (data: any): Promise<void> => {
  if (!isJsonBinConfigured()) {
    throw new Error('JSONBin not configured');
  }

  const response = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`, {
    method: 'PUT',
    headers: { 
      'X-Master-Key': JSONBIN_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error(`JSONBin API error: ${response.status}`);
  }
};

// Get localStorage fallback
const getLocalStorageProperties = (): Listing[] => {
  const savedProperties = localStorage.getItem('managedProperties');
  if (savedProperties) {
    try {
      return JSON.parse(savedProperties);
    } catch (error) {
      console.error('Error parsing localStorage properties:', error);
    }
  }
  return [];
};

// Properties Service
export const propertiesService = {
  // Get all properties
  async getAll(): Promise<Listing[]> {
    // Prefer Neon API first
    try{
      const res = await fetch('/api/listings');
      if (res.ok){
        const data = await res.json();
        const mapped: Listing[] = (data.listings||[]).map((r:any)=>{
          // Normalize images/videos to arrays; some rows may be strings from legacy imports
          const images = Array.isArray(r.images)
            ? r.images
            : (typeof r.images === 'string' && r.images.trim().length > 0 ? [r.images] : []);
          const videos = Array.isArray(r.videos)
            ? r.videos
            : (typeof r.videos === 'string' && r.videos.trim().length > 0 ? [r.videos] : []);

          return ({
          id: r.id,
          address: r.address,
          city: r.city,
          state: r.state,
          zipCode: r.zip,
          price: Number(r.price)||0,
          type: r.type,
          sqft: Number(r.sqft)||0,
          beds: r.beds||0,
          baths: r.baths||0,
          halfBaths: r.half_baths,
          lotSize: r.lot_acres,
          yearBuilt: r.year_built,
          propertyStyle: r.property_style,
          stories: r.stories,
          condition: r.condition,
          mlsId: r.mls_id,
          mlsNumber: r.mls_id,
          estimatedTaxes: r.estimated_taxes,
          propertyTaxes: r.property_taxes,
          garageSpaces: r.garage_spaces,
          garageType: r.garage_type,
          schoolDistrict: r.school_district,
          township: r.township,
          landUse: r.land_use,
          utilities: r.utilities,
          zoning: r.zoning,
          parkingSpaces: r.parking_spaces,
          features: r.features || [],
          appliances: r.appliances,
          heating: r.heating,
          cooling: r.cooling,
          flooring: r.flooring,
          roofAge: r.roof_age,
          hvacAge: r.hvac_age,
          hoaFees: r.hoa_fees,
          hoaFrequency: r.hoa_frequency,
          rentalIncome: r.rental_income,
          capRate: r.cap_rate,
          occupancyRate: r.occupancy_rate,
          rooms: r.rooms,
          bedrooms: r.bedrooms,
          aiPrompt: r.ai_prompt,
          images,
          videos,
          virtualTour: r.virtual_tour,
          listingDate: r.listing_date,
          lastUpdated: r.updated_at || r.listing_date,
          status: r.status
        });
        });
        return mapped;
      }
    }catch(e){ /* fall through */ }

    // Legacy fallback path (kept temporarily)
    if (!isJsonBinConfigured()) {
      return getLocalStorageProperties();
    }
    try { const data = await getJsonBinData(); return data.properties || []; } catch { return getLocalStorageProperties(); }
  },

  // Get active properties only
  async getActive(): Promise<Listing[]> {
    const allProperties = await this.getAll();
    return allProperties.filter(property => property.status === 'Active');
  },

  // Save a new property
  async save(property: Omit<Listing, 'id'>): Promise<Listing> {
    // Save via Neon API
    try{
      const res = await fetch('/api/listings', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(property) });
      if (res.ok){
        window.dispatchEvent(new CustomEvent('propertiesUpdated'));
        const { id } = await res.json();
        return { ...(property as any), id } as Listing;
      }
    }catch(e){ /* fallthrough */ }

    // Fallback legacy local
    const newProperty: Listing = { ...(property as any), id: Date.now(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() } as any;
    const properties = getLocalStorageProperties();
    properties.push(newProperty);
    localStorage.setItem('managedProperties', JSON.stringify(properties));
    window.dispatchEvent(new CustomEvent('propertiesUpdated'));
    return newProperty;
  },

  // Update an existing property
  async update(id: number, updates: Partial<Listing>): Promise<Listing | null> {
    try{ await fetch(`/api/listings/${id}`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify(updates) }); window.dispatchEvent(new CustomEvent('propertiesUpdated')); }catch{}
    const properties = getLocalStorageProperties();
    const index = properties.findIndex(p => p.id === id);
    if (index !== -1) { properties[index] = { ...properties[index], ...updates, updated_at: new Date().toISOString() } as any; localStorage.setItem('managedProperties', JSON.stringify(properties)); window.dispatchEvent(new CustomEvent('propertiesUpdated')); return properties[index]; }
    return null;
  },

  // Delete a property
  async delete(id: number): Promise<boolean> {
    try{ await fetch(`/api/listings/${id}`, { method:'DELETE' }); window.dispatchEvent(new CustomEvent('propertiesUpdated')); return true; }catch{}
    const properties = getLocalStorageProperties();
    const filtered = properties.filter(p => p.id !== id);
    localStorage.setItem('managedProperties', JSON.stringify(filtered));
    window.dispatchEvent(new CustomEvent('propertiesUpdated'));
    return true;
  }
};

// Imports Service (to hold drafts from the extension)
export const importsService = {
  async list(status: 'pending' | 'approved' | 'rejected' = 'pending'): Promise<any[]> {
    if (!isJsonBinConfigured()) {
      const raw = localStorage.getItem('imports') || '[]';
      const all = JSON.parse(raw);
      return all.filter((i: any)=>i.status===status);
    }
    const data = await getJsonBinData();
    const all = data.imports || [];
    return all.filter((i: any)=>i.status===status);
  },

  async saveDraft(draft: any): Promise<any> {
    const item = { id: Date.now().toString(), status: 'pending', createdAt: new Date().toISOString(), ...draft };
    if (!isJsonBinConfigured()) {
      const all = JSON.parse(localStorage.getItem('imports') || '[]');
      all.push(item);
      localStorage.setItem('imports', JSON.stringify(all));
      return item;
    }
    const data = await getJsonBinData();
    const all = data.imports || [];
    all.push(item);
    await saveJsonBinData({ ...data, imports: all });
    return item;
  },

  async update(id: string, updates: Partial<any>): Promise<any|null> {
    if (!isJsonBinConfigured()) {
      const all = JSON.parse(localStorage.getItem('imports') || '[]');
      const idx = all.findIndex((i: any)=>i.id===id);
      if (idx>-1){ all[idx] = { ...all[idx], ...updates }; localStorage.setItem('imports', JSON.stringify(all)); return all[idx]; }
      return null;
    }
    const data = await getJsonBinData();
    const all = data.imports || [];
    const idx = all.findIndex((i: any)=>i.id===id);
    if(idx>-1){ all[idx] = { ...all[idx], ...updates }; await saveJsonBinData({ ...data, imports: all }); return all[idx]; }
    return null;
  }
};

// Leads Service (simplified for JSONBin)
export const leadsService = {
  async getAll(): Promise<Lead[]> {
    if (!isJsonBinConfigured()) {
      return [];
    }

    try {
      const data = await getJsonBinData();
      return data.leads || [];
    } catch (error) {
      console.error('Error fetching leads from JSONBin:', error);
      return [];
    }
  },

  async save(lead: Omit<Lead, 'id'>): Promise<Lead> {
    const newLead: Lead = {
      ...lead,
      id: Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (!isJsonBinConfigured()) {
      return newLead;
    }

    try {
      const data = await getJsonBinData();
      const leads = data.leads || [];
      leads.push(newLead);
      
      await saveJsonBinData({
        ...data,
        leads
      });

      return newLead;
    } catch (error) {
      console.error('Error saving lead to JSONBin:', error);
      return newLead;
    }
  }
};

// Communications Service (simplified for JSONBin)
export const communicationsService = {
  async getAll(): Promise<Communication[]> {
    if (!isJsonBinConfigured()) {
      return [];
    }

    try {
      const data = await getJsonBinData();
      return data.communications || [];
    } catch (error) {
      console.error('Error fetching communications from JSONBin:', error);
      return [];
    }
  },

  async save(communication: Omit<Communication, 'id'>): Promise<Communication> {
    const newCommunication: Communication = {
      ...communication,
      id: Date.now(),
      created_at: new Date().toISOString()
    };

    if (!isJsonBinConfigured()) {
      return newCommunication;
    }

    try {
      const data = await getJsonBinData();
      const communications = data.communications || [];
      communications.push(newCommunication);
      
      await saveJsonBinData({
        ...data,
        communications
      });

      return newCommunication;
    } catch (error) {
      console.error('Error saving communication to JSONBin:', error);
      return newCommunication;
    }
  }
};

// Notes Service (simplified for JSONBin)
export const notesService = {
  async getAll(): Promise<Note[]> {
    if (!isJsonBinConfigured()) {
      return [];
    }

    try {
      const data = await getJsonBinData();
      return data.notes || [];
    } catch (error) {
      console.error('Error fetching notes from JSONBin:', error);
      return [];
    }
  },

  async save(note: Omit<Note, 'id'>): Promise<Note> {
    const newNote: Note = {
      ...note,
      id: Date.now(),
      created_at: new Date().toISOString()
    };

    if (!isJsonBinConfigured()) {
      return newNote;
    }

    try {
      const data = await getJsonBinData();
      const notes = data.notes || [];
      notes.push(newNote);
      
      await saveJsonBinData({
        ...data,
        notes
      });

      return newNote;
    } catch (error) {
      console.error('Error saving note to JSONBin:', error);
      return newNote;
    }
  }
};
