import React, { useState, useEffect } from 'react';
import { Listing } from '../types';
import { propertiesService } from '../lib/jsonbinService';
import { EnhancedPropertyForm } from './EnhancedPropertyForm';
import { PropertyCard } from './ListingCard';
import { PropertyQuickViewModal } from './PropertyQuickViewModal';
import { LeadManager } from './LeadManager';
import { importsService } from '../lib/jsonbinService';

interface PropertyManagementProps {
  onLogout: () => void;
}

export const PropertyManagement: React.FC<PropertyManagementProps> = ({ onLogout }) => {
  const [properties, setProperties] = useState<Listing[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All Properties');
  const [showForm, setShowForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Listing | null>(null);
  const [showLeadManager, setShowLeadManager] = useState(false);
  const [activeAdminTab, setActiveAdminTab] = useState<'properties'|'imports'|'leads'>('properties');
  const [imports, setImports] = useState<any[]>([]);
  const [quickViewListing, setQuickViewListing] = useState<Listing | null>(null);

  useEffect(() => {
    loadProperties();
    loadImports();
  }, []);

  const loadProperties = async () => {
    try {
        console.log('Loading properties from database...');
      const supabaseProperties = await propertiesService.getAll();
      
      if (supabaseProperties.length > 0) {
        setProperties(supabaseProperties);
        console.log('Loaded properties from database:', supabaseProperties.length);
      } else {
        // Initialize with template properties if none exist in Supabase
        console.log('No properties in database, initializing with templates...');
        const { FEATURED_LISTINGS, INVESTOR_LISTINGS } = await import('../constants');
        const initialProperties = [...FEATURED_LISTINGS, ...INVESTOR_LISTINGS];
        
        // Save template properties to database
        for (const property of initialProperties) {
          await propertiesService.save(property);
        }
        
        setProperties(initialProperties);
        console.log('Initialized with template properties in database:', initialProperties.length);
      }
    } catch (error) {
      console.error('Error loading properties from database:', error);
      alert('Failed to load properties. Please check your database connection.');
      setProperties([]);
    }
  };

  const approveImport = async (imp: any) => {
    try{
      const res = await fetch('/api/import', { method:'POST', headers:{'Content-Type':'application/json','x-import-admin-token':'Ferrari100!'}, body: JSON.stringify({ action: 'approve', importId: imp.id }) });
      if (!res.ok){ const t = await res.text(); alert('Approve failed: '+t); return; }
      await loadProperties();
      await loadImports();
      alert('Import approved and published.');
    }catch(e){ alert('Approve failed: '+(e as any).message); }
  };

  const rejectImport = async (imp: any) => {
    try{
      await fetch('/api/import', { method:'POST', headers:{'Content-Type':'application/json','x-import-admin-token':'Ferrari100!'}, body: JSON.stringify({ action: 'reject', importId: imp.id }) });
      await loadImports();
    }catch(e){ console.error(e); }
  };

  const loadImports = async () => {
    try{
      const res = await fetch(`/api/import?ts=${Date.now()}`);
      if (res.ok){
        const data = await res.json();
        setImports(data.imports || []);
      }
    }catch(e){ console.error('Failed to load imports', e); }
  };

  const saveProperties = async (newProperties: Listing[]) => {
    setProperties(newProperties);
    // Note: Individual property saves will be handled by the form save function
    // This function is mainly for UI state management
  };

  const handleSaveProperty = async (propertyData: Listing) => {
    try {
      console.log('Saving property to database:', propertyData);
      if (propertyData.id) {
        await propertiesService.update(propertyData.id as any, propertyData);
      } else {
        await propertiesService.save(propertyData);
      }
      
      // Reload properties to get updated data
      await loadProperties();
      
      setShowForm(false);
      setEditingProperty(null);
      alert('Property saved successfully!');
    } catch (error) {
      console.error('Error saving property:', error);
      alert('Failed to save property. Please try again.');
    }
  };

  const handleEditProperty = (property: Listing) => {
    console.log('Edit button clicked for property:', property);
    setEditingProperty(property);
    setShowForm(true);
    console.log('Form should now be visible');
  };

  const handleDeleteProperty = async (propertyId: string) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        console.log('Deleting property from database:', propertyId);
        await propertiesService.delete(Number(propertyId));
        
        // Reload properties to get updated data
        await loadProperties();
        
        alert('Property deleted successfully!');
      } catch (error) {
        console.error('Error deleting property:', error);
        alert('Failed to delete property. Please try again.');
      }
    }
  };

  const handleClearAllProperties = async () => {
    if (window.confirm('Are you sure you want to clear ALL properties? This cannot be undone!')) {
      try {
        console.log('Clearing all properties from database...');
        // Delete all properties
        for (const property of properties) {
          await propertiesService.delete(property.id);
        }
        
        setProperties([]);
        alert('All properties cleared successfully!');
      } catch (error) {
        console.error('Error clearing properties:', error);
        alert('Failed to clear properties. Please try again.');
      }
    }
  };

  const handleAddNewProperty = () => {
    setEditingProperty(null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProperty(null);
  };

  const filteredProperties = selectedCategory === 'All Properties' 
    ? properties 
    : properties.filter(p => p.type === selectedCategory);

  const categoryCounts = {
    'All Properties': properties.length,
    'Residential': properties.filter(p => p.type === 'Residential').length,
    'Commercial': properties.filter(p => p.type === 'Commercial').length,
    'Land': properties.filter(p => p.type === 'Land').length,
    'Rentals': properties.filter(p => p.type === 'Rentals').length,
  };

  if (showLeadManager) {
    return <LeadManager onBack={() => setShowLeadManager(false)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Property Management</h1>
              <p className="text-gray-600 mt-1">Manage your real estate listings</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={()=>setActiveAdminTab('properties')}
                className={`px-4 py-2 font-bold ${activeAdminTab==='properties'?'bg-cabernet text-white':'bg-white border'}`}
              >Properties</button>
              <button
                onClick={()=>{setActiveAdminTab('imports'); loadImports();}}
                className={`px-4 py-2 font-bold ${activeAdminTab==='imports'?'bg-cabernet text-white':'bg-white border'}`}
              >Imports</button>
              <button
                onClick={() => setShowLeadManager(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300"
              >
                📊 Lead Manager
              </button>
              <button
                onClick={onLogout}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeAdminTab==='imports' && (
          <div>
            <h2 className="text-2xl font-serif mb-4">Pending Imports</h2>
            {imports.length===0 && <div className="text-gray-600">No pending imports yet.</div>}
            <div className="space-y-3">
              {imports.map((imp:any)=> (
                <div key={imp.id} className="bg-white border p-4 flex justify-between items-center">
                  <div>
                    <div className="font-semibold">{imp.listingDraft?.address}</div>
                    <div className="text-sm text-gray-600">{imp.listingDraft?.type} · {imp.listingDraft?.mlsId} · ${imp.listingDraft?.price || imp.listingDraft?.rentMonthly}</div>
                    <div className="text-xs text-gray-500">From: {imp.sourceUrl}</div>
                  </div>
                  <div className="flex space-x-2">
                    <button onClick={()=>approveImport(imp)} className="bg-green-600 text-white px-4 py-2">Approve</button>
                    <button onClick={()=>rejectImport(imp)} className="bg-gray-200 px-4 py-2">Reject</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Action Buttons */}
        <div className="mb-8 flex flex-wrap gap-4">
          <button
            onClick={handleAddNewProperty}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg"
          >
            ➕ Add New Property
          </button>
          <button
            onClick={handleClearAllProperties}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg"
          >
            🗑️ Clear All Properties
          </button>
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {Object.entries(categoryCounts).map(([category, count]) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-300 ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                {category} ({count})
              </button>
            ))}
          </div>
        </div>

        {activeAdminTab==='properties' && (
        /* Properties Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <div key={property.id} className="relative">
              <PropertyCard 
                listing={property} 
                onOpenQuickView={setQuickViewListing}
              />
              <div className="absolute top-2 right-2 flex space-x-2">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Edit button clicked, property:', property);
                    handleEditProperty(property);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors duration-300"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteProperty(property.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors duration-300"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        )}

        {activeAdminTab==='properties' && filteredProperties.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-4">
              No properties found in this category.
            </div>
            <button
              onClick={handleAddNewProperty}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300"
            >
              Add Your First Property
            </button>
          </div>
        )}
      </div>

      {/* Property Form Modal */}
      {showForm && (
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.5)', 
          zIndex: 9999,
          overflow: 'auto'
        }}>
          {console.log('Rendering form with property:', editingProperty)}
          <EnhancedPropertyForm
            property={editingProperty as any}
            onSave={handleSaveProperty}
            onCancel={handleCloseForm}
            isAddingNew={!editingProperty}
          />
        </div>
      )}

      {/* Quick View Modal */}
      <PropertyQuickViewModal
        listing={quickViewListing}
        isOpen={!!quickViewListing}
        onClose={() => setQuickViewListing(null)}
      />
    </div>
  );
};