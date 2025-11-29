import React, { useState, useCallback } from 'react';
import { Listing } from '../types';

interface PropertyEditFormProps {
  property: Listing & { aiPrompt?: string };
  onSave: (property: Listing & { aiPrompt?: string }) => void;
  onCancel: () => void;
  isAddingNew: boolean;
}

export const PropertyEditForm: React.FC<PropertyEditFormProps> = ({
  property,
  onSave,
  onCancel,
  isAddingNew
}) => {
  const [formData, setFormData] = useState({
    ...property,
    aiPrompt: property.aiPrompt || ''
  });

  // File upload states
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [uploadedVideos, setUploadedVideos] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [videoPreviews, setVideoPreviews] = useState<string[]>([]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // File handling functions
  const createFilePreview = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.readAsDataURL(file);
    });
  };

  const handleImageDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    );
    
    if (files.length > 0) {
      const newImages = [...uploadedImages, ...files];
      setUploadedImages(newImages);
      
      // Create previews
      const previews = await Promise.all(files.map(createFilePreview));
      setImagePreviews(prev => [...prev, ...previews]);
      
      // Update form data with image URLs (using object URLs for now)
      const imageUrls = files.map(file => URL.createObjectURL(file));
      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), ...imageUrls]
      }));
    }
  }, [uploadedImages]);

  const handleVideoDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('video/')
    );
    
    if (files.length > 0) {
      const newVideos = [...uploadedVideos, ...files];
      setUploadedVideos(newVideos);
      
      // Create previews
      const previews = await Promise.all(files.map(createFilePreview));
      setVideoPreviews(prev => [...prev, ...previews]);
      
      // Update form data with video URLs
      const videoUrls = files.map(file => URL.createObjectURL(file));
      setFormData(prev => ({
        ...prev,
        videos: [...(prev.videos || []), ...videoUrls]
      }));
    }
  }, [uploadedVideos]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const files = Array.from(e.target.files || []);
    
    if (files.length > 0) {
      if (type === 'image') {
        handleImageDrop({ preventDefault: () => {}, dataTransfer: { files } } as any);
      } else {
        handleVideoDrop({ preventDefault: () => {}, dataTransfer: { files } } as any);
      }
    }
  };

  const removeImage = (index: number) => {
    const newImages = uploadedImages.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    const newUrls = formData.images?.filter((_, i) => i !== index) || [];
    
    setUploadedImages(newImages);
    setImagePreviews(newPreviews);
    setFormData(prev => ({ ...prev, images: newUrls }));
  };

  const removeVideo = (index: number) => {
    const newVideos = uploadedVideos.filter((_, i) => i !== index);
    const newPreviews = videoPreviews.filter((_, i) => i !== index);
    const newUrls = formData.videos?.filter((_, i) => i !== index) || [];
    
    setUploadedVideos(newVideos);
    setVideoPreviews(newPreviews);
    setFormData(prev => ({ ...prev, videos: newUrls }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const inputStyle = { width: '100%', padding: '8px 12px', border: '1px solid #D1D5DB', borderRadius: '6px', outline: 'none', marginBottom: '16px' };
  const labelStyle = { display: 'block', fontSize: '14px', fontWeight: '500', color: '#333333', marginBottom: '8px' };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F7F1EB', padding: '32px 0' }}>
      <div style={{ maxWidth: '896px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', padding: '32px' }}>
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '24px', fontFamily: 'Playfair Display, serif', fontWeight: 'bold', color: '#552448', marginBottom: '8px', margin: '0 0 8px 0' }}>
              {isAddingNew ? 'Add New Property' : 'Edit Property'}
            </h2>
            <p style={{ color: '#555555', margin: 0 }}>
              {isAddingNew ? 'Add a new property to the website' : `Editing: ${property.address}`}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '24px' }}>
              <div>
                <label style={labelStyle}>Property Address *</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>

              <div>
                <label style={labelStyle}>City *</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '24px' }}>
              <div>
                <label style={labelStyle}>Price *</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', parseInt(e.target.value) || 0)}
                  style={inputStyle}
                  required
                />
              </div>

              <div>
                <label style={labelStyle}>Property Type *</label>
                <select
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  style={inputStyle}
                  required
                >
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Land">Land</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Square Feet *</label>
                <input
                  type="number"
                  value={formData.sqft}
                  onChange={(e) => handleInputChange('sqft', parseInt(e.target.value) || 0)}
                  style={inputStyle}
                  required
                />
              </div>
            </div>

            {formData.type === 'Residential' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '24px' }}>
                <div>
                  <label style={labelStyle}>Bedrooms</label>
                  <input
                    type="number"
                    value={formData.beds || 0}
                    onChange={(e) => handleInputChange('beds', parseInt(e.target.value) || 0)}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Bathrooms</label>
                  <input
                    type="number"
                    value={formData.baths || 0}
                    onChange={(e) => handleInputChange('baths', parseInt(e.target.value) || 0)}
                    style={inputStyle}
                  />
                </div>
              </div>
            )}

            {formData.type === 'Land' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '24px' }}>
                <div>
                  <label style={labelStyle}>Lot Size (sqft)</label>
                  <input
                    type="number"
                    value={formData.lotSize || 0}
                    onChange={(e) => handleInputChange('lotSize', parseInt(e.target.value) || 0)}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Land Use</label>
                  <input
                    type="text"
                    value={formData.landUse || ''}
                    onChange={(e) => handleInputChange('landUse', e.target.value)}
                    style={inputStyle}
                    placeholder="e.g., Residential Development"
                  />
                </div>

                <div>
                  <label style={labelStyle}>Zoning</label>
                  <input
                    type="text"
                    value={formData.zoning || ''}
                    onChange={(e) => handleInputChange('zoning', e.target.value)}
                    style={inputStyle}
                    placeholder="e.g., R-2, C-1"
                  />
                </div>
              </div>
            )}

            {/* Media Section */}
            <div style={{ marginBottom: '32px', padding: '24px', backgroundColor: '#F9FAFB', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#374151', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                📸 Media
              </h3>

              {/* Property Images */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ ...labelStyle, fontSize: '16px' }}>Property Images</label>
                <div
                  onDrop={handleImageDrop}
                  onDragOver={(e) => e.preventDefault()}
                  onDragEnter={(e) => e.preventDefault()}
                  style={{
                    border: '2px dashed #D1D5DB',
                    borderRadius: '8px',
                    padding: '32px',
                    textAlign: 'center',
                    backgroundColor: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#552448';
                    e.currentTarget.style.backgroundColor = '#FEF7F0';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#D1D5DB';
                    e.currentTarget.style.backgroundColor = 'white';
                  }}
                  onClick={() => document.getElementById('image-upload')?.click()}
                >
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>📷</div>
                  <p style={{ fontSize: '16px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Drop image files here or click to browse
                  </p>
                  <p style={{ fontSize: '14px', color: '#6B7280' }}>
                    Supports JPG, PNG, GIF, WebP (Max 10MB each)
                  </p>
                  <input
                    id="image-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleFileInput(e, 'image')}
                    style={{ display: 'none' }}
                  />
                </div>

                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '12px' }}>
                    {imagePreviews.map((preview, index) => (
                      <div key={index} style={{ position: 'relative' }}>
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          style={{
                            width: '100%',
                            height: '80px',
                            objectFit: 'cover',
                            borderRadius: '6px',
                            border: '1px solid #D1D5DB'
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          style={{
                            position: 'absolute',
                            top: '4px',
                            right: '4px',
                            backgroundColor: '#EF4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '20px',
                            height: '20px',
                            fontSize: '12px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Property Videos */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ ...labelStyle, fontSize: '16px' }}>Property Videos</label>
                <div
                  onDrop={handleVideoDrop}
                  onDragOver={(e) => e.preventDefault()}
                  onDragEnter={(e) => e.preventDefault()}
                  style={{
                    border: '2px dashed #D1D5DB',
                    borderRadius: '8px',
                    padding: '32px',
                    textAlign: 'center',
                    backgroundColor: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#552448';
                    e.currentTarget.style.backgroundColor = '#FEF7F0';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#D1D5DB';
                    e.currentTarget.style.backgroundColor = 'white';
                  }}
                  onClick={() => document.getElementById('video-upload')?.click()}
                >
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎥</div>
                  <p style={{ fontSize: '16px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Drop video files here or click to browse
                  </p>
                  <p style={{ fontSize: '14px', color: '#6B7280' }}>
                    Supports MP4, MOV, AVI (Max 100MB each)
                  </p>
                  <input
                    id="video-upload"
                    type="file"
                    multiple
                    accept="video/*"
                    onChange={(e) => handleFileInput(e, 'video')}
                    style={{ display: 'none' }}
                  />
                </div>

                {/* Video Previews */}
                {videoPreviews.length > 0 && (
                  <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '12px' }}>
                    {videoPreviews.map((preview, index) => (
                      <div key={index} style={{ position: 'relative' }}>
                        <video
                          src={preview}
                          style={{
                            width: '100%',
                            height: '80px',
                            objectFit: 'cover',
                            borderRadius: '6px',
                            border: '1px solid #D1D5DB'
                          }}
                          controls
                        />
                        <button
                          type="button"
                          onClick={() => removeVideo(index)}
                          style={{
                            position: 'absolute',
                            top: '4px',
                            right: '4px',
                            backgroundColor: '#EF4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '20px',
                            height: '20px',
                            fontSize: '12px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Virtual Tour URL */}
              <div>
                <label style={labelStyle}>Virtual Tour URL (Optional)</label>
                <input
                  type="url"
                  value={formData.virtualTour || ''}
                  onChange={(e) => handleInputChange('virtualTour', e.target.value)}
                  style={inputStyle}
                  placeholder="Matterport, Zillow 3D, etc."
                />
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>AI Assistant Prompt</label>
              <p style={{ fontSize: '14px', color: '#555555', marginBottom: '8px' }}>
                Add detailed information about this property that the AI assistant can use to provide better responses to visitors.
              </p>
              <textarea
                value={formData.aiPrompt}
                onChange={(e) => handleInputChange('aiPrompt', e.target.value)}
                rows={6}
                style={{ ...inputStyle, resize: 'vertical' }}
                placeholder="Example: This charming 3-bedroom home in Lawrenceville features original hardwood floors, a renovated kitchen with quartz counters, and a private backyard..."
              />
            </div>

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
