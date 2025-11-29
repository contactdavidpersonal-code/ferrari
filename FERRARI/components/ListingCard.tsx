import React from 'react';
import type { Listing } from '../types';
import { BedIcon, BathIcon, SqftIcon, UnitsIcon, GarageIcon, YearIcon, MLSIcon, LotSizeIcon } from '../constants';

interface PropertyCardProps {
  listing: Listing;
  onOpenQuickView?: (listing: Listing) => void;
  onOpenContact?: () => void;
}

declare global { interface Window { setAIContext?: (context: any) => void } }

export const PropertyCard: React.FC<PropertyCardProps> = ({ listing, onOpenQuickView, onOpenContact }) => {
  const generatePropertyTabHTML = (property: Listing): string => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    });

    const renderStats = () => {
      const stats = [];
      
      if (property.beds !== undefined && property.beds !== null) {
        stats.push(`<div class="stat-item"><span class="stat-icon">🛏️</span> <span class="stat-text">${property.beds} Beds</span></div>`);
      }
      if (property.baths !== undefined && property.baths !== null) {
        stats.push(`<div class="stat-item"><span class="stat-icon">🚿</span> <span class="stat-text">${property.baths} Baths</span></div>`);
      }
      if (property.sqft !== undefined && property.sqft !== null) {
        stats.push(`<div class="stat-item"><span class="stat-icon">📐</span> <span class="stat-text">${property.sqft.toLocaleString()} sqft</span></div>`);
      }
      if (property.lotSize !== undefined && property.lotSize !== null && String(property.lotSize).trim() !== '') {
        stats.push(`<div class="stat-item"><span class="stat-icon">🏞️</span> <span class="stat-text">${property.lotSize} acres</span></div>`);
      }
      if (property.yearBuilt !== undefined && property.yearBuilt !== null) {
        stats.push(`<div class="stat-item"><span class="stat-icon">📅</span> <span class="stat-text">Built ${property.yearBuilt}</span></div>`);
      }
      if (property.garageSpaces !== undefined && property.garageSpaces !== null && property.garageSpaces > 0) {
        stats.push(`<div class="stat-item"><span class="stat-icon">🚗</span> <span class="stat-text">${property.garageSpaces} Garage</span></div>`);
      }
      if (property.mlsId && String(property.mlsId).trim() !== '') {
        stats.push(`<div class="stat-item"><span class="stat-icon">🏷️</span> <span class="stat-text">MLS ${property.mlsId}</span></div>`);
      }
      
      return stats.join('');
    };

    const renderImages = () => {
      if (!property.images || !Array.isArray(property.images) || property.images.length === 0) {
        return '<div class="no-images">🏠 No Images Available</div>';
      }
      
      return property.images.map((image, index) => 
        `<div class="image-slide ${index === 0 ? 'active' : ''}">
          <img src="${image}" alt="Property view ${index + 1}" />
        </div>`
      ).join('');
    };

    const renderVideos = () => {
      if (!property.videos || !Array.isArray(property.videos) || property.videos.length === 0) {
        return '';
      }
      
      return property.videos.map((video, index) => 
        `<a href="${video}" target="_blank" class="video-link">
          📹 Watch Video ${index + 1}
        </a>`
      ).join('');
    };

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${property.address} - ${property.city}, ${property.state} | Nicole Marie Severson</title>
        <meta name="description" content="Professional real estate listing for ${property.address} in ${property.city}, ${property.state}. ${property.type} property listed by Nicole Marie Severson.">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Lato:wght@400;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'Lato', sans-serif;
            background: #F7F1EB;
            color: #333333;
            line-height: 1.5;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
          .container { 
            max-width: 1600px; 
            margin: 20px auto; 
            background: white; 
            min-height: 100vh;
            box-shadow: 0 0 25px rgba(0,0,0,0.15);
            border-radius: 15px;
            overflow: hidden;
          }
          .brand-header { 
            background: #000000; 
            color: white; 
            padding: 35px 50px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 4px solid #1a1a1a;
          }
          .brand-info { 
            display: flex;
            align-items: center;
            gap: 20px;
          }
          .brand-info h1 { 
            font-size: 24px; 
            font-weight: bold; 
            margin-bottom: 5px;
            font-family: 'Playfair Display', serif;
          }
          .brand-info p { 
            opacity: 0.9; 
            font-size: 14px;
            font-style: italic;
          }
          .agent-info { 
            text-align: right; 
            font-size: 14px;
          }
          .agent-info .agent-name { 
            font-weight: bold; 
            font-size: 16px; 
            margin-bottom: 2px;
          }
          .listing-header { 
            background: #F7F1EB; 
            padding: 50px; 
            text-align: center;
            border-bottom: 2px solid #E5D5C8;
          }
          .listing-header h2 { 
            font-size: 32px; 
            color: #000000; 
            margin-bottom: 10px;
            font-family: 'Playfair Display', serif;
            font-weight: 700;
          }
          .listing-header .address { 
            font-size: 20px; 
            color: #555555; 
            font-weight: 400;
          }
          .content { padding: 60px; }
          .price-section { 
            text-align: center; 
            margin-bottom: 60px;
            padding: 50px;
            background: #F7F1EB;
            border-radius: 15px;
            border: 2px solid #000000;
          }
          .price { 
            font-size: 48px; 
            font-weight: bold; 
            color: #000000; 
            margin-bottom: 15px;
            font-family: 'Playfair Display', serif;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
          }
          .price-label { 
            font-size: 16px; 
            color: #555555; 
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 10px;
          }
          .type-badge { 
            background: #000000; 
            color: white; 
            padding: 12px 24px; 
            border-radius: 25px; 
            font-size: 16px; 
            font-weight: bold;
            display: inline-block;
            margin-bottom: 20px;
            text-transform: uppercase;
            letter-spacing: 1px;
            box-shadow: 0 4px 8px rgba(85, 36, 72, 0.3);
          }
          .image-gallery { 
            position: relative; 
            margin-bottom: 50px; 
            border-radius: 15px; 
            overflow: hidden;
            box-shadow: 0 6px 20px rgba(0,0,0,0.15);
          }
          .image-slide { 
            display: none; 
            width: 100%; 
            height: 500px;
          }
          .image-slide.active { display: block; }
          .image-slide img { 
            width: 100%; 
            height: 100%; 
            object-fit: cover; 
          }
          .no-images { 
            height: 400px; 
            background: #f0f0f0; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            font-size: 18px; 
            color: #666;
          }
          .image-nav { 
            position: absolute; 
            top: 50%; 
            transform: translateY(-50%);
            background: rgba(0,0,0,0.5); 
            color: white; 
            border: none; 
            padding: 10px; 
            cursor: pointer;
            border-radius: 50%;
            font-size: 18px;
          }
          .image-nav:hover { background: rgba(0,0,0,0.7); }
          .nav-left { left: 15px; }
          .nav-right { right: 15px; }
          .image-counter { 
            position: absolute; 
            bottom: 15px; 
            right: 15px; 
            background: rgba(0,0,0,0.7); 
            color: white; 
            padding: 5px 10px; 
            border-radius: 15px; 
            font-size: 14px;
          }
          .stats-grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); 
            gap: 30px; 
            margin-bottom: 60px;
          }
          .stat-item { 
            display: flex; 
            align-items: center; 
            gap: 20px; 
            padding: 30px; 
            background: white; 
            border-radius: 15px;
            font-size: 20px;
            border: 2px solid #E5D5C8;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            transition: transform 0.2s, box-shadow 0.2s;
          }
          .stat-item:hover { 
            transform: translateY(-2px); 
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          }
          .stat-icon { 
            font-size: 24px; 
            color: #000000;
          }
          .stat-text { 
            font-weight: 600; 
            color: #333333;
          }
          .details-section { 
            margin-bottom: 50px; 
            padding: 40px; 
            background: white; 
            border-radius: 15px;
            border: 2px solid #E5D5C8;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          }
          .details-section h3 { 
            color: #000000; 
            margin-bottom: 20px; 
            font-size: 24px;
            font-family: 'Playfair Display', serif;
            font-weight: 700;
            border-bottom: 2px solid #000000;
            padding-bottom: 10px;
          }
          .professional-footer { 
            background: #000000; 
            color: white; 
            padding: 60px 50px; 
            text-align: center;
            margin-top: 80px;
          }
          .footer-content { 
            max-width: 800px; 
            margin: 0 auto;
          }
          .footer-content h3 { 
            font-size: 24px; 
            margin-bottom: 15px;
            font-family: 'Playfair Display', serif;
            font-weight: 700;
          }
          .contact-info { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
            gap: 20px; 
            margin: 20px 0;
          }
          .contact-item { 
            font-size: 16px;
          }
          .contact-item strong { 
            display: block; 
            margin-bottom: 5px;
            font-size: 18px;
          }
          .disclaimer { 
            font-size: 12px; 
            opacity: 0.8; 
            margin-top: 20px;
            font-style: italic;
          }
          .features { 
            display: flex; 
            flex-wrap: wrap; 
            gap: 10px; 
            margin-top: 10px;
          }
          .feature-tag { 
            background: #e9ecef; 
            padding: 8px 12px; 
            border-radius: 20px; 
            font-size: 14px;
          }
          .video-links { 
            margin-top: 20px; 
            display: flex; 
            flex-wrap: wrap; 
            gap: 15px;
          }
          .video-link { 
            background: #000000; 
            color: white; 
            padding: 12px 20px; 
            text-decoration: none; 
            border-radius: 8px; 
            font-weight: bold;
            transition: background 0.3s;
          }
          .video-link:hover { background: #1a1a1a; }
          .virtual-tour { 
            background: #D4AF37; 
            color: white; 
            padding: 12px 20px; 
            text-decoration: none; 
            border-radius: 8px; 
            font-weight: bold;
            display: inline-block;
            margin-top: 15px;
            transition: background 0.3s;
          }
          .virtual-tour:hover { background: #B8860B; }
          .description { 
            font-size: 16px; 
            line-height: 1.7; 
            color: #555;
          }
          @media (max-width: 768px) {
            .container { margin: 10px; }
            .content { padding: 30px; }
            .brand-header { padding: 25px 30px; }
            .listing-header { padding: 30px; }
            .price-section { padding: 30px; margin-bottom: 40px; }
            .price { font-size: 36px; }
            .stats-grid { 
              grid-template-columns: 1fr; 
              gap: 20px; 
              margin-bottom: 40px;
            }
            .stat-item { padding: 20px; font-size: 18px; }
            .details-section { padding: 25px; margin-bottom: 30px; }
            .image-slide { height: 300px; }
            .brand-header { 
              flex-direction: column; 
              text-align: center; 
              gap: 20px;
            }
            .brand-info { 
              flex-direction: column; 
              gap: 10px;
            }
          }
          
          @media print {
            body { background: white; }
            .container { box-shadow: none; max-width: none; }
            .brand-header, .professional-footer { 
              background: #000000 !important; 
              -webkit-print-color-adjust: exact;
              color-adjust: exact;
            }
            .image-nav, .image-counter { display: none; }
            .stat-item:hover { transform: none; }
            .video-link { 
              background: #000000 !important; 
              -webkit-print-color-adjust: exact;
              color-adjust: exact;
            }
            .virtual-tour { 
              background: #D4AF37 !important; 
              -webkit-print-color-adjust: exact;
              color-adjust: exact;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="brand-header">
            <div class="brand-info">
              <h1>eXp Realty</h1>
              <p>Pittsburgh, PA</p>
            </div>
            <div class="agent-info">
              <div class="agent-name">Nicole Marie Severson</div>
              <div>Licensed Real Estate Agent</div>
              <div>Pittsburgh, Pennsylvania</div>
            </div>
          </div>
          
          <div class="listing-header">
            <h2>Property Listing</h2>
            <div class="address">${property.address}, ${property.city}, ${property.state}</div>
          </div>
          
          <div class="content">
            <div class="price-section">
              <div class="price-label">Listed Price</div>
              <div class="price">${formatter.format(property.price)}</div>
              <div class="type-badge">${property.type}</div>
            </div>
            
            <div class="image-gallery">
              ${renderImages()}
              ${property.images && property.images.length > 1 ? `
                <button class="image-nav nav-left" onclick="previousImage()">‹</button>
                <button class="image-nav nav-right" onclick="nextImage()">›</button>
                <div class="image-counter">
                  <span id="current-image">1</span> / <span id="total-images">${property.images.length}</span>
                </div>
              ` : ''}
            </div>
            
            <div class="stats-grid">
              ${renderStats()}
            </div>
            
            ${property.propertyStyle ? `
              <div class="details-section">
                <h3>Property Style</h3>
                <p>${property.propertyStyle}</p>
              </div>
            ` : ''}
            
            ${property.features && Array.isArray(property.features) && property.features.length > 0 ? `
              <div class="details-section">
                <h3>Features</h3>
                <div class="features">
                  ${property.features.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
                </div>
              </div>
            ` : ''}
            
            ${property.aiPrompt ? `
              <div class="details-section">
                <h3>Description</h3>
                <div class="description">${property.aiPrompt}</div>
              </div>
            ` : ''}
            
            ${renderVideos() || property.virtualTour ? `
              <div class="details-section">
                <h3>Media & Tours</h3>
                <div class="video-links">
                  ${renderVideos()}
                </div>
                ${property.virtualTour ? `
                  <a href="${property.virtualTour}" target="_blank" class="virtual-tour">
                    🏠 View Virtual Tour
                  </a>
                ` : ''}
              </div>
            ` : ''}
          </div>
          
          <div class="professional-footer">
            <div class="footer-content">
              <h3>Contact Your Real Estate Professional</h3>
              <div class="contact-info">
                <div class="contact-item">
                  <strong>Nicole Marie Severson</strong>
                  Licensed Real Estate Agent<br>
                  eXp Realty<br>
                  Pittsburgh, PA
                </div>
                <div class="contact-item">
                  <strong>Phone</strong>
                  (412) 555-0123<br>
                  <strong>Email</strong>
                  nicole@preferredrealty.com
                </div>
                <div class="contact-item">
                  <strong>Office</strong>
                  Pittsburgh, Pennsylvania<br>
                  <strong>License</strong>
                  PA License #12345
                </div>
              </div>
              <div class="disclaimer">
                Equal Housing Opportunity. All information deemed reliable but not guaranteed. 
                Subject to errors, omissions, prior sale, change or withdrawal without notice.
              </div>
            </div>
          </div>
        </div>
        
        <script>
          let currentImageIndex = 0;
          const totalImages = ${property.images ? property.images.length : 0};
          
          function showImage(index) {
            const slides = document.querySelectorAll('.image-slide');
            slides.forEach((slide, i) => {
              slide.classList.toggle('active', i === index);
            });
            document.getElementById('current-image').textContent = index + 1;
          }
          
          function nextImage() {
            if (totalImages > 1) {
              currentImageIndex = (currentImageIndex + 1) % totalImages;
              showImage(currentImageIndex);
            }
          }
          
          function previousImage() {
            if (totalImages > 1) {
              currentImageIndex = (currentImageIndex - 1 + totalImages) % totalImages;
              showImage(currentImageIndex);
            }
          }
          
          // Keyboard navigation
          document.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft') previousImage();
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'Escape') window.close();
          });
        </script>
      </body>
      </html>
    `;
  };

  const openPropertyInNewTab = (property: Listing) => {
    // Create new tab
    const newTab = window.open('', '_blank');
    
    if (!newTab) {
      alert('Unable to open new tab. Please check your browser settings.');
      return;
    }

    // Generate HTML content for the new tab
    const htmlContent = generatePropertyTabHTML(property);
    
    newTab.document.write(htmlContent);
    newTab.document.close();
  };
  
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  });

  const renderStats = () => {
    const iconClasses = "w-4 h-4 text-charcoal-light"; // kept for compatibility, emojis below provide full-color icons
    const textClasses = "text-charcoal-light";

    // Helper function to format lot size (acres)
    const formatLotSize = (lotSize: string | number | undefined) => {
      if (lotSize === undefined || lotSize === null || String(lotSize).trim() === '') return null;
      return `${String(lotSize).trim()} acres`;
    };

    // Helper function to create a stat item
    const createStat = (icon: React.ReactNode, text: string) => (
      <div className="flex items-center space-x-2 py-1">
        <div className="flex-shrink-0">
          {icon}
              </div>
        <span className={textClasses} style={{ fontSize: '13px', lineHeight: '1.4' }}>{text}</span>
              </div>
    );

    // Helper function to check if a value should be displayed
    const shouldShow = (value: any, allowZero: boolean = false) => {
      if (value === undefined || value === null || value === '') return false;
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === 'string') return value.trim() !== '';
      if (typeof value === 'number') return allowZero ? true : value > 0;
      return true;
    };

    // Build stats array with ALL filled-in details
    const stats: React.ReactNode[] = [];

    // Basic Information (always show if available)
    if (shouldShow(listing.sqft, true)) {
      stats.push(createStat(<span className="text-lg">📐</span>, `${listing.sqft.toLocaleString()} sqft`));
    }
    if (shouldShow(listing.lotSize)) {
      stats.push(createStat(<span className="text-lg">🏞️</span>, formatLotSize(listing.lotSize) || ''));
    }
    if (shouldShow(listing.yearBuilt)) {
      stats.push(createStat(<span className="text-lg">📅</span>, `Built ${listing.yearBuilt}`));
    }
    if (shouldShow(listing.propertyStyle)) {
      stats.push(createStat(<span className="text-lg">🏠</span>, listing.propertyStyle));
    }
    if (shouldShow(listing.stories)) {
      stats.push(createStat(<span className="text-lg">🏢</span>, `${listing.stories} Stories`));
    }
    if (shouldShow(listing.condition)) {
      stats.push(createStat(<span className="text-lg">✨</span>, listing.condition));
    }

    // Residential Details
    if (shouldShow(listing.beds, true)) {
      stats.push(createStat(<span className="text-lg">🛏️</span>, `${listing.beds} Beds`));
    }
    if (shouldShow(listing.baths, false)) {
      stats.push(createStat(<span className="text-lg">🛁</span>, `${listing.baths} Baths`));
    }
    if (shouldShow(listing.halfBaths, true)) {
      stats.push(createStat(<span className="text-lg">🚿</span>, `${listing.halfBaths} Half Baths`));
    }
    if (shouldShow(listing.garageSpaces, true)) {
      stats.push(createStat(<span className="text-lg">🚗</span>, `${listing.garageSpaces} Garage`));
    }
    if (shouldShow(listing.garageType)) {
      stats.push(createStat(<span className="text-lg">🚗</span>, listing.garageType));
    }

    // Commercial Details
    if (shouldShow(listing.parkingSpaces, true)) {
      stats.push(createStat(<span className="text-lg">🅿️</span>, `${listing.parkingSpaces} Parking`));
    }
    if (shouldShow(listing.zoning)) {
      stats.push(createStat(<span className="text-lg">📋</span>, `Zoned ${listing.zoning}`));
    }

    // Land Details
    if (shouldShow(listing.landUse)) {
      stats.push(createStat(<span className="text-lg">🏗️</span>, listing.landUse));
    }
    if (shouldShow(listing.utilities) && Array.isArray(listing.utilities) && listing.utilities.length > 0) {
      stats.push(createStat(<span className="text-lg">⚡</span>, `${listing.utilities.length} Utilities`));
    }

    // Location & School Information
    if (shouldShow(listing.schoolDistrict)) {
      stats.push(createStat(<span className="text-lg">🎓</span>, listing.schoolDistrict));
    }
    if (shouldShow(listing.township)) {
      stats.push(createStat(<span className="text-lg">🏘️</span>, listing.township));
    }

    // Property Condition & Age
    if (shouldShow(listing.roofAge)) {
      stats.push(createStat(<span className="text-lg">🏠</span>, `Roof: ${listing.roofAge}yr`));
    }
    if (shouldShow(listing.hvacAge)) {
      stats.push(createStat(<span className="text-lg">🌡️</span>, `HVAC: ${listing.hvacAge}yr`));
    }

    // Features & Amenities
    if (shouldShow(listing.features) && Array.isArray(listing.features) && listing.features.length > 0) {
      stats.push(createStat(<span className="text-lg">⭐</span>, `${listing.features.length} Features`));
    }
    if (shouldShow(listing.appliances) && Array.isArray(listing.appliances) && listing.appliances.length > 0) {
      stats.push(createStat(<span className="text-lg">🛠️</span>, `${listing.appliances.length} Appliances`));
    }
    if (shouldShow(listing.flooring) && Array.isArray(listing.flooring) && listing.flooring.length > 0) {
      stats.push(createStat(<span className="text-lg">🪵</span>, `${listing.flooring.length} Floor Types`));
    }
    if (shouldShow(listing.heating)) {
      stats.push(createStat(<span className="text-lg">🔥</span>, listing.heating));
    }
    if (shouldShow(listing.cooling)) {
      stats.push(createStat(<span className="text-lg">❄️</span>, listing.cooling));
    }

    // Financial Information
    if (shouldShow(listing.propertyTaxes)) {
      stats.push(createStat(<span className="text-lg">💰</span>, `Taxes: $${listing.propertyTaxes.toLocaleString()}`));
    }
    if (shouldShow(listing.estimatedTaxes)) {
      stats.push(createStat(<span className="text-lg">📊</span>, `Est. Taxes: $${listing.estimatedTaxes.toLocaleString()}`));
    }
    if (shouldShow(listing.hoaFees)) {
      stats.push(createStat(<span className="text-lg">🏘️</span>, `HOA: $${listing.hoaFees}/${listing.hoaFrequency || 'mo'}`));
    }

    // Investment Information
    if (shouldShow(listing.rentalIncome)) {
      stats.push(createStat(<span className="text-lg">💵</span>, `Rent: $${listing.rentalIncome.toLocaleString()}/mo`));
    }
    if (shouldShow(listing.capRate)) {
      stats.push(createStat(<span className="text-lg">📈</span>, `${listing.capRate}% Cap Rate`));
    }
    if (shouldShow(listing.occupancyRate)) {
      stats.push(createStat(<span className="text-lg">📊</span>, `${listing.occupancyRate}% Occupancy`));
    }

    // MLS Information
    if (shouldShow(listing.mlsId)) {
      stats.push(createStat(<span className="text-lg">🏷️</span>, `MLS ${listing.mlsId}`));
    }

    // Always show property type as fallback if no other stats
    if (stats.length === 0) {
      stats.push(createStat(<span className="text-lg">🏠</span>, listing.type));
    }

    // Return all stats (no limit) - Updated to show all filled details - FORCE DEPLOY
    return <>{stats}</>;
  };

  return (
    <div className="bg-white border border-charcoal/10 overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_28px_rgba(0,0,0,0.12)] transition-shadow transition-transform duration-300 hover:-translate-y-0.5 will-change-transform flex flex-col group h-full">
      <div
        className="relative overflow-hidden cursor-pointer"
        style={{ height: 'clamp(180px, 40vw, 240px)' }}
        onClick={() => {
          // Open the same big details modal as the "Learn more" button
          if (onOpenQuickView) onOpenQuickView(listing);
        }}
      >
        {listing.images && Array.isArray(listing.images) && listing.images.length > 0 ? (
          <img src={listing.images[0]} alt={`View of ${listing.address}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" loading="lazy" referrerPolicy="no-referrer" onError={(e)=>{ (e.currentTarget as HTMLImageElement).src = 'https://picsum.photos/seed/fallback/600/400'; }} />
        ) : (
          <div className="w-full h-full bg-charcoal/5 flex items-center justify-center hover:bg-charcoal/10 transition-colors duration-300">
            <span className="text-charcoal/40" style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)' }}>🏠</span>
          </div>
        )}
        <span className="absolute top-2 sm:top-3 md:top-4 left-2 sm:left-3 md:left-4 bg-cream text-primary font-semibold px-2 sm:px-2.5 md:px-3 py-0.5 sm:py-1 uppercase tracking-[0.12em] border border-charcoal/10" style={{ fontSize: 'clamp(0.625rem, 1.2vw, 0.75rem)' }}>{listing.type}</span>
        {listing.images && Array.isArray(listing.images) && listing.images.length > 1 && (
          <span className="pointer-events-none select-none absolute top-2 sm:top-3 right-2 sm:right-3 bg-white/90 text-charcoal font-medium px-1.5 sm:px-2 py-0.5 sm:py-1 border border-charcoal/10" style={{ fontSize: 'clamp(0.625rem, 1.2vw, 0.75rem)' }}>
            +{listing.images.length - 1} more
          </span>
        )}
        {listing.videos && Array.isArray(listing.videos) && listing.videos.length > 0 && (
          <span className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 bg-white/90 text-charcoal font-medium px-1.5 sm:px-2 py-0.5 sm:py-1 border border-charcoal/10 flex items-center gap-1" style={{ fontSize: 'clamp(0.625rem, 1.2vw, 0.75rem)' }}>
            📹 {listing.videos.length} video{listing.videos.length > 1 ? 's' : ''}
          </span>
        )}
        {listing.virtualTour && (
          <span className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 bg-white/90 text-charcoal font-medium px-1.5 sm:px-2 py-0.5 sm:py-1 border border-charcoal/10 flex items-center gap-1" style={{ fontSize: 'clamp(0.625rem, 1.2vw, 0.75rem)' }}>
            🏠 Virtual Tour
          </span>
        )}
      </div>
      <div className="p-3 sm:p-4 md:p-6 flex flex-col flex-grow">
        <div className="mb-2 sm:mb-3">
          <p className="font-serif font-bold text-charcoal" style={{ fontSize: 'clamp(1.125rem, 3vw, 1.875rem)' }}>{formatter.format(listing.price)}</p>
          <p className="text-charcoal-light mt-1" style={{ fontSize: 'clamp(0.75rem, 1.8vw, 0.9375rem)' }}>{listing.address}, {listing.city}</p>
        </div>
        <div className="border-t border-charcoal/10 pt-2 sm:pt-3 md:pt-4">
          <div className="grid grid-cols-2 gap-2 sm:gap-3 text-charcoal" style={{ fontSize: 'clamp(0.75rem, 1.8vw, 0.875rem)' }}>
          {renderStats()}
          </div>
        </div>
        
        {/* Feature Badges (up to 8) */}
        {(() => {
          const features: string[] = [];
          
          // Add features array
          if (listing.features && Array.isArray(listing.features) && listing.features.length > 0) {
            features.push(...listing.features.slice(0, 6)); // Reserve space for other features
          }
          
          // Add key amenities
          if (listing.heating) features.push(`Heating: ${listing.heating}`);
          if (listing.cooling) features.push(`Cooling: ${listing.cooling}`);
          if (listing.garageSpaces && listing.garageSpaces > 0) features.push(`${listing.garageSpaces} Car Garage`);
          if (listing.schoolDistrict) features.push(`${listing.schoolDistrict} Schools`);
          
          const displayFeatures = features.slice(0, 8);
          const hasMoreFeatures = features.length > 8;
          
          if (displayFeatures.length > 0) {
            return (
              <div className="mt-2 sm:mt-3 md:mt-4">
                <div className="flex flex-wrap gap-1">
                  {displayFeatures.map((feature, index) => (
                    <span key={index} className="bg-gray-100 text-gray-600 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded" style={{ fontSize: 'clamp(0.625rem, 1.2vw, 0.75rem)' }}>
                      {feature.length > 20 ? `${feature.substring(0, 20)}...` : feature}
                    </span>
                  ))}
                  {hasMoreFeatures && (
                    <span className="bg-primary/10 text-primary px-1.5 sm:px-2 py-0.5 sm:py-1 rounded" style={{ fontSize: 'clamp(0.625rem, 1.2vw, 0.75rem)' }}>
                      +{features.length - 8} more
                    </span>
                  )}
                </div>
              </div>
            );
          }
          return null;
        })()}
        
        <div className="mt-auto pt-3 sm:pt-4 flex flex-col gap-2">
          <button
            onClick={() => {
              console.log('Learn more clicked, onOpenQuickView:', !!onOpenQuickView);
              if (onOpenQuickView) {
                onOpenQuickView(listing);
              } else {
                console.log('No onOpenQuickView prop provided');
              }
            }}
            className="text-primary border border-charcoal/20 px-4 sm:px-5 py-2 hover:bg-primary hover:text-white focus:outline-none focus:ring-2 focus:ring-primary/40 font-semibold tracking-wide uppercase transition-colors duration-200 min-h-[44px]"
            style={{ fontSize: 'clamp(0.75rem, 1.8vw, 0.875rem)' }}
          >
            Learn more about this opportunity
          </button>
          {listing.virtualTour && (
            <button
              onClick={() => window.open(listing.virtualTour, '_blank')}
              className="text-charcoal border border-charcoal/20 px-4 sm:px-5 py-2 hover:bg-charcoal hover:text-white focus:outline-none focus:ring-2 focus:ring-charcoal/30 flex items-center justify-center gap-2 font-semibold tracking-wide uppercase transition-colors duration-200 min-h-[44px]"
              style={{ fontSize: 'clamp(0.75rem, 1.8vw, 0.875rem)' }}
            >
              🏠 View Virtual Tour
            </button>
          )}
        </div>
      </div>
      
    </div>
  );
};