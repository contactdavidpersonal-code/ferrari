import { createClient } from '@supabase/supabase-js'

// Get Supabase credentials from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Debug logging
console.log('🔍 Supabase Environment Check:');
console.log('VITE_SUPABASE_URL:', supabaseUrl);
console.log('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Present' : 'Missing');

// Validate that we have the required environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('❌ Supabase environment variables not found. App will use localStorage fallback.')
} else {
  console.log('✅ Supabase environment variables found. Using Supabase database.')
}

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Database types
export interface Database {
  public: {
    Tables: {
      properties: {
        Row: {
          id: number
          address: string
          city: string
          state: string
          zip_code: string
          price: number
          type: 'Residential' | 'Commercial' | 'Land'
          sqft: number
          lot_size: string | null
          year_built: number | null
          property_style: string | null
          stories: number | null
          condition: string | null
          beds: number | null
          baths: number | null
          half_baths: number | null
          mls_id: string | null
          estimated_taxes: number | null
          garage_spaces: number | null
          garage_type: string | null
          school_district: string | null
          township: string | null
          land_use: string | null
          utilities: string[] | null
          zoning: string | null
          parking_spaces: number | null
          features: string[] | null
          appliances: string[] | null
          heating: string | null
          cooling: string | null
          flooring: string[] | null
          property_taxes: number | null
          hoa_fees: number | null
          hoa_frequency: string | null
          rental_income: number | null
          cap_rate: number | null
          images: string[] | null
          videos: string[] | null
          virtual_tour: string | null
          listing_date: string
          last_updated: string
          status: 'Active' | 'Inactive' | 'Pending' | 'Sold'
          ai_prompt: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          address: string
          city: string
          state: string
          zip_code: string
          price: number
          type: 'Residential' | 'Commercial' | 'Land'
          sqft: number
          lot_size?: string | null
          year_built?: number | null
          property_style?: string | null
          stories?: number | null
          condition?: string | null
          beds?: number | null
          baths?: number | null
          half_baths?: number | null
          mls_id?: string | null
          estimated_taxes?: number | null
          garage_spaces?: number | null
          garage_type?: string | null
          school_district?: string | null
          township?: string | null
          land_use?: string | null
          utilities?: string[] | null
          zoning?: string | null
          parking_spaces?: number | null
          features?: string[] | null
          appliances?: string[] | null
          heating?: string | null
          cooling?: string | null
          flooring?: string[] | null
          property_taxes?: number | null
          hoa_fees?: number | null
          hoa_frequency?: string | null
          rental_income?: number | null
          cap_rate?: number | null
          images?: string[] | null
          videos?: string[] | null
          virtual_tour?: string | null
          listing_date: string
          last_updated: string
          status: 'Active' | 'Inactive' | 'Pending' | 'Sold'
          ai_prompt?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          address?: string
          city?: string
          state?: string
          zip_code?: string
          price?: number
          type?: 'Residential' | 'Commercial' | 'Land'
          sqft?: number
          lot_size?: string | null
          year_built?: number | null
          property_style?: string | null
          stories?: number | null
          condition?: string | null
          beds?: number | null
          baths?: number | null
          half_baths?: number | null
          mls_id?: string | null
          estimated_taxes?: number | null
          garage_spaces?: number | null
          garage_type?: string | null
          school_district?: string | null
          township?: string | null
          land_use?: string | null
          utilities?: string[] | null
          zoning?: string | null
          parking_spaces?: number | null
          features?: string[] | null
          appliances?: string[] | null
          heating?: string | null
          cooling?: string | null
          flooring?: string[] | null
          property_taxes?: number | null
          hoa_fees?: number | null
          hoa_frequency?: string | null
          rental_income?: number | null
          cap_rate?: number | null
          images?: string[] | null
          videos?: string[] | null
          virtual_tour?: string | null
          listing_date?: string
          last_updated?: string
          status?: 'Active' | 'Inactive' | 'Pending' | 'Sold'
          ai_prompt?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      leads: {
        Row: {
          id: number
          name: string
          email: string | null
          phone: string | null
          source: string
          status: 'New' | 'Contacted' | 'Qualified' | 'Proposal' | 'Closed'
          score: number
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          email?: string | null
          phone?: string | null
          source: string
          status?: 'New' | 'Contacted' | 'Qualified' | 'Proposal' | 'Closed'
          score?: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          email?: string | null
          phone?: string | null
          source?: string
          status?: 'New' | 'Contacted' | 'Qualified' | 'Proposal' | 'Closed'
          score?: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      communications: {
        Row: {
          id: number
          lead_id: number
          type: 'Email' | 'Phone' | 'Text' | 'In Person' | 'Other'
          content: string
          timestamp: string
          created_at: string
        }
        Insert: {
          id?: number
          lead_id: number
          type: 'Email' | 'Phone' | 'Text' | 'In Person' | 'Other'
          content: string
          timestamp: string
          created_at?: string
        }
        Update: {
          id?: number
          lead_id?: number
          type?: 'Email' | 'Phone' | 'Text' | 'In Person' | 'Other'
          content?: string
          timestamp?: string
          created_at?: string
        }
      }
      notes: {
        Row: {
          id: number
          lead_id: number
          content: string
          category: string | null
          importance: 'Low' | 'Medium' | 'High'
          property_ids: number[] | null
          created_at: string
        }
        Insert: {
          id?: number
          lead_id: number
          content: string
          category?: string | null
          importance?: 'Low' | 'Medium' | 'High'
          property_ids?: number[] | null
          created_at?: string
        }
        Update: {
          id?: number
          lead_id?: number
          content?: string
          category?: string | null
          importance?: 'Low' | 'Medium' | 'High'
          property_ids?: number[] | null
          created_at?: string
        }
      }
    }
  }
}
