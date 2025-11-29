import { supabase } from './supabase'
import type { Listing, Lead, Communication, Note } from '../types'
import type { Database } from './supabase'

type PropertyRow = Database['public']['Tables']['properties']['Row']
type PropertyInsert = Database['public']['Tables']['properties']['Insert']
type PropertyUpdate = Database['public']['Tables']['properties']['Update']

// Convert Supabase property row to our Listing type
const convertPropertyRowToListing = (row: PropertyRow): Listing => ({
  id: row.id,
  address: row.address,
  city: row.city,
  state: row.state,
  zipCode: row.zip_code,
  price: row.price,
  type: row.type,
  sqft: row.sqft,
  lotSize: row.lot_size,
  yearBuilt: row.year_built,
  propertyStyle: row.property_style,
  stories: row.stories,
  condition: row.condition as any,
  beds: row.beds,
  baths: row.baths,
  halfBaths: row.half_baths,
  mlsId: row.mls_id,
  estimatedTaxes: row.estimated_taxes,
  garageSpaces: row.garage_spaces,
  garageType: row.garage_type as any,
  schoolDistrict: row.school_district,
  township: row.township,
  landUse: row.land_use,
  utilities: row.utilities,
  zoning: row.zoning,
  parkingSpaces: row.parking_spaces,
  features: row.features,
  appliances: row.appliances,
  heating: row.heating,
  cooling: row.cooling,
  flooring: row.flooring,
  propertyTaxes: row.property_taxes,
  hoaFees: row.hoa_fees,
  hoaFrequency: row.hoa_frequency as any,
  rentalIncome: row.rental_income,
  capRate: row.cap_rate,
  images: row.images || [],
  videos: row.videos || [],
  virtualTour: row.virtual_tour,
  listingDate: row.listing_date,
  lastUpdated: row.last_updated,
  status: row.status,
  aiPrompt: row.ai_prompt
})

// Convert our Listing type to Supabase property insert/update
const convertListingToPropertyData = (listing: Partial<Listing>): PropertyInsert | PropertyUpdate => ({
  address: listing.address,
  city: listing.city,
  state: listing.state,
  zip_code: listing.zipCode,
  price: listing.price,
  type: listing.type,
  sqft: listing.sqft,
  lot_size: listing.lotSize,
  year_built: listing.yearBuilt,
  property_style: listing.propertyStyle,
  stories: listing.stories,
  condition: listing.condition,
  beds: listing.beds,
  baths: listing.baths,
  half_baths: listing.halfBaths,
  mls_id: listing.mlsId,
  estimated_taxes: listing.estimatedTaxes,
  garage_spaces: listing.garageSpaces,
  garage_type: listing.garageType,
  school_district: listing.schoolDistrict,
  township: listing.township,
  land_use: listing.landUse,
  utilities: listing.utilities,
  zoning: listing.zoning,
  parking_spaces: listing.parkingSpaces,
  features: listing.features,
  appliances: listing.appliances,
  heating: listing.heating,
  cooling: listing.cooling,
  flooring: listing.flooring,
  property_taxes: listing.propertyTaxes,
  hoa_fees: listing.hoaFees,
  hoa_frequency: listing.hoaFrequency,
  rental_income: listing.rentalIncome,
  cap_rate: listing.capRate,
  images: listing.images,
  videos: listing.videos,
  virtual_tour: listing.virtualTour,
  listing_date: listing.listingDate,
  last_updated: listing.lastUpdated,
  status: listing.status,
  ai_prompt: listing.aiPrompt
})

// Check if Supabase is properly configured
const isSupabaseConfigured = (): boolean => {
  return supabase !== null
}

// localStorage fallback functions
const getLocalStorageProperties = (): Listing[] => {
  try {
    const saved = localStorage.getItem('managedProperties')
    return saved ? JSON.parse(saved) : []
  } catch (error) {
    console.error('Error reading from localStorage:', error)
    return []
  }
}

const setLocalStorageProperties = (properties: Listing[]): void => {
  try {
    localStorage.setItem('managedProperties', JSON.stringify(properties))
  } catch (error) {
    console.error('Error writing to localStorage:', error)
  }
}

// Properties Service
export const propertiesService = {
  // Get all properties
  async getAll(): Promise<Listing[]> {
    if (!isSupabaseConfigured()) {
      console.log('Supabase not configured, using localStorage fallback')
      return getLocalStorageProperties()
    }

    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching properties:', error)
        return getLocalStorageProperties()
      }

      return data?.map(convertPropertyRowToListing) || []
    } catch (error) {
      console.error('Supabase connection error, using localStorage:', error)
      return getLocalStorageProperties()
    }
  },

  // Get active properties only
  async getActive(): Promise<Listing[]> {
    if (!isSupabaseConfigured()) {
      const properties = getLocalStorageProperties()
      return properties.filter(p => p.status === 'Active')
    }

    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('status', 'Active')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching active properties:', error)
        const properties = getLocalStorageProperties()
        return properties.filter(p => p.status === 'Active')
      }

      return data?.map(convertPropertyRowToListing) || []
    } catch (error) {
      console.error('Supabase connection error, using localStorage:', error)
      const properties = getLocalStorageProperties()
      return properties.filter(p => p.status === 'Active')
    }
  },

  // Get property by ID
  async getById(id: number): Promise<Listing | null> {
    if (!isSupabaseConfigured()) {
      const properties = getLocalStorageProperties()
      return properties.find(p => p.id === id) || null
    }

    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error fetching property:', error)
        const properties = getLocalStorageProperties()
        return properties.find(p => p.id === id) || null
      }

      return data ? convertPropertyRowToListing(data) : null
    } catch (error) {
      console.error('Supabase connection error, using localStorage:', error)
      const properties = getLocalStorageProperties()
      return properties.find(p => p.id === id) || null
    }
  },

  // Create new property
  async create(property: Omit<Listing, 'id'>): Promise<Listing | null> {
    const newProperty: Listing = {
      ...property,
      id: Date.now() // Generate a unique ID
    } as Listing

    if (!isSupabaseConfigured()) {
      const properties = getLocalStorageProperties()
      const updatedProperties = [...properties, newProperty]
      setLocalStorageProperties(updatedProperties)
      return newProperty
    }

    try {
      const propertyData = convertListingToPropertyData(property)
      
      const { data, error } = await supabase
        .from('properties')
        .insert(propertyData)
        .select()
        .single()

      if (error) {
        console.error('Error creating property:', error)
        const properties = getLocalStorageProperties()
        const updatedProperties = [...properties, newProperty]
        setLocalStorageProperties(updatedProperties)
        return newProperty
      }

      return data ? convertPropertyRowToListing(data) : newProperty
    } catch (error) {
      console.error('Supabase connection error, using localStorage:', error)
      const properties = getLocalStorageProperties()
      const updatedProperties = [...properties, newProperty]
      setLocalStorageProperties(updatedProperties)
      return newProperty
    }
  },

  // Update property
  async update(id: number, updates: Partial<Listing>): Promise<Listing | null> {
    if (!isSupabaseConfigured()) {
      const properties = getLocalStorageProperties()
      const propertyIndex = properties.findIndex(p => p.id === id)
      if (propertyIndex === -1) return null
      
      const updatedProperty = { 
        ...properties[propertyIndex], 
        ...updates, 
        lastUpdated: new Date().toISOString().split('T')[0] 
      }
      
      properties[propertyIndex] = updatedProperty
      setLocalStorageProperties(properties)
      return updatedProperty
    }

    try {
      const propertyData = convertListingToPropertyData({
        ...updates,
        lastUpdated: new Date().toISOString().split('T')[0],
        updated_at: new Date().toISOString()
      })

      const { data, error } = await supabase
        .from('properties')
        .update(propertyData)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error updating property:', error)
        // Fallback to localStorage
        const properties = getLocalStorageProperties()
        const propertyIndex = properties.findIndex(p => p.id === id)
        if (propertyIndex === -1) return null
        
        const updatedProperty = { 
          ...properties[propertyIndex], 
          ...updates, 
          lastUpdated: new Date().toISOString().split('T')[0] 
        }
        
        properties[propertyIndex] = updatedProperty
        setLocalStorageProperties(properties)
        return updatedProperty
      }

      return data ? convertPropertyRowToListing(data) : null
    } catch (error) {
      console.error('Supabase connection error, using localStorage:', error)
      // Fallback to localStorage
      const properties = getLocalStorageProperties()
      const propertyIndex = properties.findIndex(p => p.id === id)
      if (propertyIndex === -1) return null
      
      const updatedProperty = { 
        ...properties[propertyIndex], 
        ...updates, 
        lastUpdated: new Date().toISOString().split('T')[0] 
      }
      
      properties[propertyIndex] = updatedProperty
      setLocalStorageProperties(properties)
      return updatedProperty
    }
  },

  // Delete property
  async delete(id: number): Promise<boolean> {
    if (!isSupabaseConfigured()) {
      const properties = getLocalStorageProperties()
      const filteredProperties = properties.filter(p => p.id !== id)
      setLocalStorageProperties(filteredProperties)
      return true
    }

    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting property:', error)
        // Fallback to localStorage
        const properties = getLocalStorageProperties()
        const filteredProperties = properties.filter(p => p.id !== id)
        setLocalStorageProperties(filteredProperties)
        return true
      }

      return true
    } catch (error) {
      console.error('Supabase connection error, using localStorage:', error)
      // Fallback to localStorage
      const properties = getLocalStorageProperties()
      const filteredProperties = properties.filter(p => p.id !== id)
      setLocalStorageProperties(filteredProperties)
      return true
    }
  }
}

// Leads Service
export const leadsService = {
  async getAll(): Promise<Lead[]> {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching leads:', error)
      return []
    }

    return data || []
  },

  async create(lead: Omit<Lead, 'id'>): Promise<Lead | null> {
    const { data, error } = await supabase
      .from('leads')
      .insert(lead)
      .select()
      .single()

    if (error) {
      console.error('Error creating lead:', error)
      return null
    }

    return data
  },

  async update(id: number, updates: Partial<Lead>): Promise<Lead | null> {
    const { data, error } = await supabase
      .from('leads')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating lead:', error)
      return null
    }

    return data
  },

  async delete(id: number): Promise<boolean> {
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting lead:', error)
      return false
    }

    return true
  }
}

// Communications Service
export const communicationsService = {
  async getByLeadId(leadId: number): Promise<Communication[]> {
    const { data, error } = await supabase
      .from('communications')
      .select('*')
      .eq('lead_id', leadId)
      .order('timestamp', { ascending: false })

    if (error) {
      console.error('Error fetching communications:', error)
      return []
    }

    return data || []
  },

  async create(communication: Omit<Communication, 'id'>): Promise<Communication | null> {
    const { data, error } = await supabase
      .from('communications')
      .insert(communication)
      .select()
      .single()

    if (error) {
      console.error('Error creating communication:', error)
      return null
    }

    return data
  }
}

// Notes Service
export const notesService = {
  async getByLeadId(leadId: number): Promise<Note[]> {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching notes:', error)
      return []
    }

    return data || []
  },

  async create(note: Omit<Note, 'id'>): Promise<Note | null> {
    const { data, error } = await supabase
      .from('notes')
      .insert(note)
      .select()
      .single()

    if (error) {
      console.error('Error creating note:', error)
      return null
    }

    return data
  },

  async update(id: number, updates: Partial<Note>): Promise<Note | null> {
    const { data, error } = await supabase
      .from('notes')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating note:', error)
      return null
    }

    return data
  },

  async delete(id: number): Promise<boolean> {
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting note:', error)
      return false
    }

    return true
  }
}