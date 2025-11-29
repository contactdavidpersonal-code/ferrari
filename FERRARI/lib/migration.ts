import { propertiesService, leadsService, communicationsService, notesService } from './supabaseService'
import type { Listing, Lead, Communication, Note } from '../types'

export class MigrationService {
  // Migrate properties from localStorage to Supabase
  static async migrateProperties(): Promise<{ success: number; errors: string[] }> {
    const errors: string[] = []
    let successCount = 0

    try {
      const savedProperties = localStorage.getItem('managedProperties')
      if (!savedProperties) {
        console.log('No properties found in localStorage')
        return { success: 0, errors: [] }
      }

      const properties: Listing[] = JSON.parse(savedProperties)
      console.log(`Found ${properties.length} properties to migrate`)

      for (const property of properties) {
        try {
          // Remove the id to let Supabase generate a new one
          const { id, ...propertyData } = property
          const migratedProperty = await propertiesService.create(propertyData)
          
          if (migratedProperty) {
            successCount++
            console.log(`Migrated property: ${property.address}`)
          } else {
            errors.push(`Failed to migrate property: ${property.address}`)
          }
        } catch (error) {
          errors.push(`Error migrating property ${property.address}: ${error}`)
        }
      }
    } catch (error) {
      errors.push(`Error reading properties from localStorage: ${error}`)
    }

    return { success: successCount, errors }
  }

  // Migrate leads from localStorage to Supabase
  static async migrateLeads(): Promise<{ success: number; errors: string[] }> {
    const errors: string[] = []
    let successCount = 0

    try {
      const savedLeads = localStorage.getItem('leads')
      if (!savedLeads) {
        console.log('No leads found in localStorage')
        return { success: 0, errors: [] }
      }

      const leads: Lead[] = JSON.parse(savedLeads)
      console.log(`Found ${leads.length} leads to migrate`)

      for (const lead of leads) {
        try {
          const { id, ...leadData } = lead
          const migratedLead = await leadsService.create(leadData)
          
          if (migratedLead) {
            successCount++
            console.log(`Migrated lead: ${lead.name}`)
          } else {
            errors.push(`Failed to migrate lead: ${lead.name}`)
          }
        } catch (error) {
          errors.push(`Error migrating lead ${lead.name}: ${error}`)
        }
      }
    } catch (error) {
      errors.push(`Error reading leads from localStorage: ${error}`)
    }

    return { success: successCount, errors }
  }

  // Migrate communications from localStorage to Supabase
  static async migrateCommunications(): Promise<{ success: number; errors: string[] }> {
    const errors: string[] = []
    let successCount = 0

    try {
      const savedCommunications = localStorage.getItem('communications')
      if (!savedCommunications) {
        console.log('No communications found in localStorage')
        return { success: 0, errors: [] }
      }

      const communications: Communication[] = JSON.parse(savedCommunications)
      console.log(`Found ${communications.length} communications to migrate`)

      for (const communication of communications) {
        try {
          const { id, ...communicationData } = communication
          const migratedCommunication = await communicationsService.create(communicationData)
          
          if (migratedCommunication) {
            successCount++
            console.log(`Migrated communication for lead ${communication.leadId}`)
          } else {
            errors.push(`Failed to migrate communication for lead ${communication.leadId}`)
          }
        } catch (error) {
          errors.push(`Error migrating communication: ${error}`)
        }
      }
    } catch (error) {
      errors.push(`Error reading communications from localStorage: ${error}`)
    }

    return { success: successCount, errors }
  }

  // Migrate notes from localStorage to Supabase
  static async migrateNotes(): Promise<{ success: number; errors: string[] }> {
    const errors: string[] = []
    let successCount = 0

    try {
      const savedNotes = localStorage.getItem('notes')
      if (!savedNotes) {
        console.log('No notes found in localStorage')
        return { success: 0, errors: [] }
      }

      const notes: Note[] = JSON.parse(savedNotes)
      console.log(`Found ${notes.length} notes to migrate`)

      for (const note of notes) {
        try {
          const { id, ...noteData } = note
          const migratedNote = await notesService.create(noteData)
          
          if (migratedNote) {
            successCount++
            console.log(`Migrated note for lead ${note.leadId}`)
          } else {
            errors.push(`Failed to migrate note for lead ${note.leadId}`)
          }
        } catch (error) {
          errors.push(`Error migrating note: ${error}`)
        }
      }
    } catch (error) {
      errors.push(`Error reading notes from localStorage: ${error}`)
    }

    return { success: successCount, errors }
  }

  // Migrate all data at once
  static async migrateAll(): Promise<{
    properties: { success: number; errors: string[] }
    leads: { success: number; errors: string[] }
    communications: { success: number; errors: string[] }
    notes: { success: number; errors: string[] }
  }> {
    console.log('Starting full migration from localStorage to Supabase...')

    const [properties, leads, communications, notes] = await Promise.all([
      this.migrateProperties(),
      this.migrateLeads(),
      this.migrateCommunications(),
      this.migrateNotes()
    ])

    const totalSuccess = properties.success + leads.success + communications.success + notes.success
    const totalErrors = [...properties.errors, ...leads.errors, ...communications.errors, ...notes.errors]

    console.log(`Migration completed: ${totalSuccess} items migrated successfully, ${totalErrors.length} errors`)

    return { properties, leads, communications, notes }
  }

  // Clear localStorage after successful migration
  static clearLocalStorage(): void {
    localStorage.removeItem('managedProperties')
    localStorage.removeItem('leads')
    localStorage.removeItem('communications')
    localStorage.removeItem('notes')
    console.log('Cleared localStorage data')
  }
}
