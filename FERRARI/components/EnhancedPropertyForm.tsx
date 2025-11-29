import React, { useState } from 'react';
import { Listing } from '../types';
import { propertiesService } from '../lib/jsonbinService';

interface EnhancedPropertyFormProps {
  property: Listing;
  onSave: (property: Listing) => void;
  onCancel: () => void;
  isAddingNew: boolean;
}

export const EnhancedPropertyForm: React.FC<EnhancedPropertyFormProps> = ({
  property,
  onSave,
  onCancel,
  isAddingNew
}) => {
  const [formData, setFormData] = useState<Listing>({
    ...property,
    images: property?.images || [],
    videos: property?.videos || [],
    features: property?.features || [],
    appliances: property?.appliances || [],
    flooring: property?.flooring || [],
    listingDate: property?.listingDate || new Date().toISOString().split('T')[0],
    lastUpdated: new Date().toISOString().split('T')[0],
    status: property?.status || 'Active',
    state: property?.state || 'Pennsylvania',
    zipCode: property?.zipCode || ''
  });

  const handleInputChange = (field: keyof Listing, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  const handleArrayChange = (field: keyof Listing, value: string) => {
    const items = value.split(',').map(item => item.trim()).filter(item => item);
    handleInputChange(field, items);
  };

  const handleMediaAdd = (type: 'images' | 'videos', url: string) => {
    if (url.trim()) {
      handleInputChange(type, [...formData[type], url.trim()]);
    }
  };

  // Upload helper: convert file to data URL for storage
  const uploadOrEncodeFile = async (file: File, folder: 'images' | 'videos'): Promise<string> => {
    // Convert to data URL for persistence in JSONBin/localStorage
    const toDataUrl = (file: File) => new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    return await toDataUrl(file);
  };

  // Drag-and-drop handlers for media
  const handleDropMedia = async (e: React.DragEvent<HTMLDivElement>, type: 'images' | 'videos') => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files || []);
    if (files.length === 0) return;

    const uploads = await Promise.all(files.map((f) => uploadOrEncodeFile(f, type)));
    const newUrls: string[] = uploads.filter(Boolean) as string[];

    if (newUrls.length > 0) {
      handleInputChange(type, [...formData[type], ...newUrls]);
    }
  };

  const preventDefaults = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleMediaRemove = (type: 'images' | 'videos', index: number) => {
    const newMedia = formData[type].filter((_, i) => i !== index);
    handleInputChange(type, newMedia);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const inputStyle = { width: '100%', padding: '8px 12px', border: '1px solid #D1D5DB', borderRadius: '6px', outline: 'none', marginBottom: '16px' };
  const labelStyle = { display: 'block', fontSize: '14px', fontWeight: '500', color: '#333333', marginBottom: '8px' };
  const sectionStyle = { marginBottom: '32px', padding: '20px', backgroundColor: '#F9FAFB', borderRadius: '8px', border: '1px solid #E5E7EB' };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F7F1EB', padding: '32px 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', padding: '32px' }}>
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <h2 style={{ fontSize: '28px', fontFamily: 'Playfair Display, serif', fontWeight: 'bold', color: '#552448', marginBottom: '8px', margin: '0 0 8px 0' }}>
                  {isAddingNew ? 'Add New Property' : 'Edit Property'}
                </h2>
                <p style={{ color: '#555555', margin: 0 }}>
                  {isAddingNew ? 'Create a comprehensive property listing' : `Editing: ${property?.address || 'Property'}`}
                </p>
              </div>
              {/* Status toggle removed to keep frontend/backoffice mirrored */}
            </div>
            {/* Informational alert removed to keep experience simpler */}
          </div>

          <form onSubmit={handleSubmit}>
            {/* Basic Information */}
            <div style={sectionStyle}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#333333', marginBottom: '16px' }}>📍 Basic Information</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Property Address</label>
                  <input type="text" value={formData.address} onChange={(e) => handleInputChange('address', e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>City</label>
                  <input type="text" value={formData.city} onChange={(e) => handleInputChange('city', e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>State</label>
                  <input type="text" value={formData.state} onChange={(e) => handleInputChange('state', e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>ZIP Code</label>
                  <input type="text" value={formData.zipCode} onChange={(e) => handleInputChange('zipCode', e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Price</label>
                  <input type="number" value={formData.price} onChange={(e) => handleInputChange('price', parseInt(e.target.value) || 0)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Property Type</label>
                  <select value={formData.type} onChange={(e) => handleInputChange('type', e.target.value)} style={inputStyle} required>
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Land">Land</option>
                    <option value="Rentals">Rentals</option>
                  </select>
                </div>
                {/* Listing status selector removed - listings always visible */}
                <div>
                  <label style={labelStyle}>MLS Number</label>
                  <input type="text" value={formData.mlsNumber || ''} onChange={(e) => handleInputChange('mlsNumber', e.target.value)} style={inputStyle} />
                </div>
              </div>
            </div>

            {/* Property Details */}
            <div style={sectionStyle}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#333333', marginBottom: '16px' }}>🏠 Property Details</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Square Feet</label>
                  <input type="number" value={formData.sqft} onChange={(e) => handleInputChange('sqft', parseInt(e.target.value) || 0)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Lot Size (acres)</label>
                  <input 
                    type="text" 
                    value={formData.lotSize || ''} 
                    onChange={(e) => {
                      // Accept any character input - no validation
                      handleInputChange('lotSize', e.target.value);
                    }}
                    style={inputStyle} 
                    placeholder="Enter lot size in acres (0-1, e.g., 0.0765)" 
                  />
                  <p style={{ fontSize: '12px', color: '#6B7280', margin: '4px 0 0 0' }}>
                    Lot size in acres (typically 0-1 acre)
                  </p>
                </div>
                <div>
                  <label style={labelStyle}>Year Built</label>
                  <input type="number" value={formData.yearBuilt || ''} onChange={(e) => handleInputChange('yearBuilt', parseInt(e.target.value) || undefined)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Property Style</label>
                  <input type="text" value={formData.propertyStyle || ''} onChange={(e) => handleInputChange('propertyStyle', e.target.value)} style={inputStyle} placeholder="e.g., Colonial, Ranch, Modern" />
                </div>
                <div>
                  <label style={labelStyle}>Stories</label>
                  <input type="number" value={formData.stories || ''} onChange={(e) => handleInputChange('stories', parseInt(e.target.value) || undefined)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Condition</label>
                  <select value={formData.condition || ''} onChange={(e) => handleInputChange('condition', e.target.value)} style={inputStyle}>
                    <option value="">Select Condition</option>
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Needs Work">Needs Work</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Residential Details */}
            {formData.type === 'Residential' && (
              <div style={sectionStyle}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#333333', marginBottom: '16px' }}>🛏️ Residential Details</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  <div>
                    <label style={labelStyle}>Bedrooms</label>
                    <input type="number" value={formData.beds || ''} onChange={(e) => handleInputChange('beds', parseInt(e.target.value) || undefined)} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Full Bathrooms</label>
                    <input type="number" value={formData.baths || ''} onChange={(e) => handleInputChange('baths', parseInt(e.target.value) || undefined)} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Half Bathrooms</label>
                    <input type="number" value={formData.halfBaths || ''} onChange={(e) => handleInputChange('halfBaths', parseInt(e.target.value) || undefined)} style={inputStyle} />
                  </div>
                </div>
              </div>
            )}

            {/* Land Details */}
            {formData.type === 'Land' && (
              <div style={sectionStyle}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#333333', marginBottom: '16px' }}>🏞️ Land Details</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
                  <div>
                    <label style={labelStyle}>Land Use</label>
                    <input type="text" value={formData.landUse || ''} onChange={(e) => handleInputChange('landUse', e.target.value)} style={inputStyle} placeholder="Residential, Commercial, Industrial, Agricultural" />
                  </div>
                  <div>
                    <label style={labelStyle}>Zoning</label>
                    <input type="text" value={formData.zoning || ''} onChange={(e) => handleInputChange('zoning', e.target.value)} style={inputStyle} placeholder="R-1, C-1, I-1, etc." />
                  </div>
                  <div>
                    <label style={labelStyle}>Utilities Available (comma-separated)</label>
                    <textarea value={formData.utilities?.join(', ') || ''} onChange={(e) => handleArrayChange('utilities', e.target.value)} rows={3} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Electric, Gas, Water, Sewer, Cable" />
                  </div>
                </div>
              </div>
            )}

            {/* Commercial Details */}
            {formData.type === 'Commercial' && (
              <div style={sectionStyle}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#333333', marginBottom: '16px' }}>🏪 Commercial Details</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  <div>
                    <label style={labelStyle}>Parking Spaces</label>
                    <input type="number" value={formData.parkingSpaces || ''} onChange={(e) => handleInputChange('parkingSpaces', parseInt(e.target.value) || undefined)} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Zoning</label>
                    <input type="text" value={formData.zoning || ''} onChange={(e) => handleInputChange('zoning', e.target.value)} style={inputStyle} />
                  </div>
                </div>
              </div>
            )}

            {/* eXp Realty Specific Fields */}
            <div style={sectionStyle}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#333333', marginBottom: '16px' }}>🏢 eXp Realty Details</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>MLS ID</label>
                  <input type="text" value={formData.mlsId || ''} onChange={(e) => handleInputChange('mlsId', e.target.value)} style={inputStyle} placeholder="e.g., 1724613" />
                </div>
                <div>
                  <label style={labelStyle}>Estimated Taxes</label>
                  <input type="number" value={formData.estimatedTaxes || ''} onChange={(e) => handleInputChange('estimatedTaxes', parseInt(e.target.value) || undefined)} style={inputStyle} placeholder="Annual property taxes" />
                </div>
                <div>
                  <label style={labelStyle}>Garage Spaces</label>
                  <input type="number" value={formData.garageSpaces || ''} onChange={(e) => handleInputChange('garageSpaces', parseInt(e.target.value) || undefined)} style={inputStyle} placeholder="Number of garage spaces" />
                </div>
                <div>
                  <label style={labelStyle}>Garage Type</label>
                  <select value={formData.garageType || ''} onChange={(e) => handleInputChange('garageType', e.target.value)} style={inputStyle}>
                    <option value="">Select Type</option>
                    <option value="Attached">Attached</option>
                    <option value="Detached">Detached</option>
                    <option value="Carport">Carport</option>
                    <option value="None">None</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>School District</label>
                  <input type="text" value={formData.schoolDistrict || ''} onChange={(e) => handleInputChange('schoolDistrict', e.target.value)} style={inputStyle} placeholder="e.g., Pine-Richland" />
                </div>
                <div>
                  <label style={labelStyle}>Township</label>
                  <input type="text" value={formData.township || ''} onChange={(e) => handleInputChange('township', e.target.value)} style={inputStyle} placeholder="e.g., Pine Twp" />
                </div>
              </div>
            </div>

            {/* Features & Amenities */}
            <div style={sectionStyle}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#333333', marginBottom: '16px' }}>✨ Features & Amenities</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Features (comma-separated)</label>
                  <textarea value={formData.features?.join(', ') || ''} onChange={(e) => handleArrayChange('features', e.target.value)} rows={3} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Pool, Fireplace, Hardwood Floors, Updated Kitchen" />
                </div>
                <div>
                  <label style={labelStyle}>Appliances (comma-separated)</label>
                  <textarea value={formData.appliances?.join(', ') || ''} onChange={(e) => handleArrayChange('appliances', e.target.value)} rows={3} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Dishwasher, Refrigerator, Washer, Dryer" />
                </div>
                <div>
                  <label style={labelStyle}>Flooring (comma-separated)</label>
                  <textarea value={formData.flooring?.join(', ') || ''} onChange={(e) => handleArrayChange('flooring', e.target.value)} rows={3} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Hardwood, Tile, Carpet, Laminate" />
                </div>
                <div>
                  <label style={labelStyle}>Heating</label>
                  <input type="text" value={formData.heating || ''} onChange={(e) => handleInputChange('heating', e.target.value)} style={inputStyle} placeholder="Central Air, Gas, Electric" />
                </div>
                <div>
                  <label style={labelStyle}>Cooling</label>
                  <input type="text" value={formData.cooling || ''} onChange={(e) => handleInputChange('cooling', e.target.value)} style={inputStyle} placeholder="Central Air, Window Units, None" />
                </div>
              </div>
            </div>

            {/* Financial Information */}
            <div style={sectionStyle}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#333333', marginBottom: '16px' }}>💰 Financial Information</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Property Taxes (annual)</label>
                  <input type="number" value={formData.propertyTaxes || ''} onChange={(e) => handleInputChange('propertyTaxes', parseInt(e.target.value) || undefined)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>HOA Fees</label>
                  <input type="number" value={formData.hoaFees || ''} onChange={(e) => handleInputChange('hoaFees', parseInt(e.target.value) || undefined)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>HOA Frequency</label>
                  <select value={formData.hoaFrequency || ''} onChange={(e) => handleInputChange('hoaFrequency', e.target.value)} style={inputStyle}>
                    <option value="">Select Frequency</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Annually">Annually</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Rental Income (monthly)</label>
                  <input type="number" value={formData.rentalIncome || ''} onChange={(e) => handleInputChange('rentalIncome', parseInt(e.target.value) || undefined)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Cap Rate (%)</label>
                  <input type="number" step="0.1" value={formData.capRate || ''} onChange={(e) => handleInputChange('capRate', parseFloat(e.target.value) || undefined)} style={inputStyle} />
                </div>
              </div>
            </div>

            {/* Media Upload */}
            <div style={sectionStyle}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#333333', marginBottom: '16px' }}>📸 Media</h3>
              
              {/* Images */}
              <div style={{ marginBottom: '24px' }}>
                <label style={labelStyle}>Property Images</label>
                <div 
                  onDragEnter={preventDefaults}
                  onDragOver={preventDefaults}
                  onDrop={(e) => handleDropMedia(e, 'images')}
                  style={{ marginBottom: '12px', border: '1px dashed #D1D5DB', borderRadius: '6px', padding: '24px', background: '#FAFAFA', textAlign: 'center' }}
                >
                  <div style={{ color: '#6B7280', fontSize: '14px' }}>Drag & drop images here</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px' }}>
                  {formData.images.map((image, index) => (
                    <div key={index} style={{ position: 'relative' }}>
                      <img src={image} alt={`Property ${index + 1}`} style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #D1D5DB' }} />
                      <button type="button" onClick={() => handleMediaRemove('images', index)} style={{ position: 'absolute', top: '4px', right: '4px', backgroundColor: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', fontSize: '12px', cursor: 'pointer' }}>×</button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Videos */}
              <div style={{ marginBottom: '24px' }}>
                <label style={labelStyle}>Property Videos</label>
                <div 
                  onDragEnter={preventDefaults}
                  onDragOver={preventDefaults}
                  onDrop={(e) => handleDropMedia(e, 'videos')}
                  style={{ marginBottom: '12px', border: '1px dashed #D1D5DB', borderRadius: '6px', padding: '24px', background: '#FAFAFA', textAlign: 'center' }}
                >
                  <div style={{ color: '#6B7280', fontSize: '14px' }}>Drag & drop video files here</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                  {formData.videos.map((video, index) => (
                    <div key={index} style={{ position: 'relative' }}>
                      <div style={{ width: '100%', height: '120px', backgroundColor: '#F3F4F6', borderRadius: '6px', border: '1px solid #D1D5DB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: '12px', color: '#6B7280' }}>Video {index + 1}</span>
                      </div>
                      <button type="button" onClick={() => handleMediaRemove('videos', index)} style={{ position: 'absolute', top: '4px', right: '4px', backgroundColor: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', fontSize: '12px', cursor: 'pointer' }}>×</button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Virtual Tour */}
              <div>
                <label style={labelStyle}>Virtual Tour URL</label>
                <input type="url" value={formData.virtualTour || ''} onChange={(e) => handleInputChange('virtualTour', e.target.value)} style={inputStyle} placeholder="Matterport, Zillow 3D, etc." />
              </div>
            </div>

            {/* AI Prompt */}
            <div style={sectionStyle}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#333333', marginBottom: '16px' }}>🤖 AI Assistant Prompt</h3>
              <label style={labelStyle}>Detailed Property Information</label>
              <p style={{ fontSize: '14px', color: '#555555', marginBottom: '8px' }}>
                Add comprehensive information about this property that the AI assistant can use to provide better responses to visitors. Include unique features, neighborhood details, investment potential, recent updates, etc.
              </p>
              <textarea
                value={formData.aiPrompt || ''}
                onChange={(e) => handleInputChange('aiPrompt', e.target.value)}
                rows={8}
                style={{ ...inputStyle, resize: 'vertical' }}
                placeholder="Example: This stunning 4-bedroom colonial in the heart of Lawrenceville features a completely renovated kitchen with quartz countertops, stainless steel appliances, and custom cabinetry. The property includes original hardwood floors throughout, a finished basement with home theater, and a beautifully landscaped backyard with a deck perfect for entertaining. Located just 2 blocks from Butler Street's vibrant restaurant scene and within walking distance of Arsenal Park. Recent updates include a new roof (2023), HVAC system (2022), and updated electrical. Excellent investment opportunity with strong rental potential of $3,200/month based on comparable properties. The neighborhood has seen 18% appreciation over the past two years due to the growing tech sector and new developments..."
              />
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '16px', paddingTop: '24px', borderTop: '1px solid #E5E7EB' }}>
              <button
                type="submit"
                style={{ backgroundColor: '#552448', color: 'white', padding: '12px 24px', borderRadius: '6px', border: 'none', fontWeight: '600', cursor: 'pointer' }}
              >
                {isAddingNew ? 'Add Property' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={onCancel}
                style={{ backgroundColor: '#4B5563', color: 'white', padding: '12px 24px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
