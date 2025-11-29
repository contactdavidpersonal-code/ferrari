(function(){
  function text(el){ return (el?.textContent||'').trim(); }
  function num(s){ if(s==null) return undefined; const t=(s+'').replace(/[$,]/g,'').trim(); const n=parseFloat(t); return isNaN(n)?undefined:n; }
  function int(s){ const n=num(s); return n!=null?Math.round(n):undefined; }
  function acresFrom(s){ if(!s) return undefined; const m=(s+"").match(/([\d.,]+)\s*acres?/i); return m?parseFloat(m[1].replace(/,/g,'')):undefined; }
  function detectType(raw){ const r=(raw||document.body.innerText).toLowerCase();
    if(/rental|rent|lease/.test(r)) return 'Rentals';
    if(/commercial|warehouse|office|retail/.test(r)) return 'Commercial';
    if(/land|lot|acres?\b/.test(r)) return 'Land';
    return 'Residential';
  }

  function normalizeType(v){
    const s=(v||'').toString().toLowerCase();
    if(/rent/.test(s)) return 'Rentals';
    if(/land|farm/.test(s)) return 'Land';
    if(/commercial|office|retail|industrial/.test(s)) return 'Commercial';
    return 'Residential';
  }

  function canonicalAddress(full){
    const m = (full||'').match(/^(.*)\s+-\s+([^,]+),?\s*([A-Z]{2})?\s*(\d{5})?/); // "123 St - City, PA 15222"
    if(m){ return { address: m[1].trim(), city: m[2].trim(), state: m[3]||'', zip: m[4]||'' }; }
    const n=(full||'').match(/^(.*?),\s*([^,]+),\s*([A-Z]{2})\s*(\d{5})?/);
    if(n){ return { address: n[1].trim(), city: n[2].trim(), state: n[3]||'', zip: n[4]||'' }; }
    return { address: full||'', city:'', state:'', zip:'' };
  }

  function collectPairs(root){
    const pairs = {};
    if(!root) return pairs;
    root.querySelectorAll('dt, .c-key, .label').forEach((dl)=>{
      const label = text(dl).replace(/:$/, '').toLowerCase();
      let valEl = dl.nextElementSibling;
      const val = text(valEl);
      if(label && val) pairs[label] = val;
    });
    const rows = Array.from(root.querySelectorAll('[class*="grid"],[class*="row"]'));
    rows.forEach(row=>{
      const cells = Array.from(row.children).map(text).filter(Boolean);
      if(cells.length===2){ pairs[cells[0].toLowerCase()] = cells[1]; }
    });
    return pairs;
  }

  function mapPairs(pairs){
    const g = (k)=> pairs[k] || pairs[k.toLowerCase()];
    const toInt = (v)=> v==null?undefined:int(v);
    const utilList = (v)=> (v||'').split(/,|\n/).map(s=>s.trim()).filter(Boolean);
    return {
      mlsId: g('mls id')||g('mls'),
      beds: toInt(g('bedrooms')||g('bedrooms?')),
      baths: toInt(g('bathrooms')||g('full bathrooms')||g('baths')),
      halfBaths: toInt(g('half bathrooms')||g('half-baths')||g('half baths')),
      yearBuilt: toInt(g('year built')),
      propertyStyle: g('style')||g('property style')||(/story/i.test(g('type')||'')?g('type'):undefined),
      stories: toInt(g('stories')||g('floors')),
      garageSpaces: toInt(g('garage spaces')||g('garage')||g('car spaces')),
      garageType: g('garage type'),
      township: g('township'),
      schoolDistrict: g('school')||g('school district'),
      estimatedTaxes: toInt(g('estimated taxes')||g('taxes')),
      zoning: g('zoning'),
      landUse: g('land use')||g('use'),
      utilities: utilList(g('utilities available')||g('utilities')),
      status: g('status'),
      type: normalizeType(g('property type')||g('type')),
      lotSizeAcres: acresFrom(g('lot size')||g('lot size (acres)')||g('acres')),
      sqft: toInt(g('square feet')||g('sqft')||g('living area'))
    };
  }

  function extractPreferredRealty(){
    const title = document.querySelector('h1, .title, .c-title');
    const priceEl = document.querySelector('.box-price, .price, [class*="price"]');
    const overview = document.body.innerText;
    const gallery = Array.from(document.querySelectorAll('img')).map(i=>i.src).filter(u=>/\.(jpg|jpeg|png|webp)/i.test(u));

    const t = text(title);
    const p = num(text(priceEl));
    const {address, city, state, zip} = canonicalAddress(t);
    const mlsMatch = overview.match(/MLS\s*ID\s*[:#]?\s*(\d{5,})/i);
    const beds = int((overview.match(/(\d+)\s*Bed/i)||[])[1]);
    const baths = int((overview.match(/(\d+)\s*Bath/i)||[])[1]);
    const sqft = int((overview.match(/([\d,]+)\s*sq\s*ft/i)||[])[1]);
    const lotSizeAcres = acresFrom(overview);
    const yearBuilt = int((overview.match(/Year Built\s*[:]?\s*(\d{4})/i)||[])[1]);
    const taxesAnnual = int((overview.match(/Estimated Taxes\s*[:$]?\s*([\d,]+)/i)||[])[1]);
    // Collect structured overview/details
    const overviewSection = Array.from(document.querySelectorAll('section, div')).find(s=>/\bOverview\b/i.test(text(s.querySelector('h2,h3'))));
    const detailsSection = Array.from(document.querySelectorAll('section, div')).find(s=>/Property\s+Details/i.test(text(s.querySelector('h2,h3'))));
    const pairs = { ...collectPairs(overviewSection), ...collectPairs(detailsSection) };
    const mapped = mapPairs(pairs);
    const type = mapped.type || detectType(overview);
    const desc = text(document.querySelector('.description, #description, [data-section="Description"], [id*="Description"]')) || '';
    const vtEl = Array.from(document.querySelectorAll('a')).find(a=>/virtual\s*tour|matterport|3d/i.test(text(a)));
    const virtualTour = vtEl?.href;

    return {
      sourceUrl: location.href,
      address, city, state, zip, price:p, type,
      beds: mapped.beds, baths: mapped.baths, halfBaths: mapped.halfBaths,
      sqft: mapped.sqft, lotSizeAcres: mapped.lotSizeAcres, yearBuilt: mapped.yearBuilt,
      mlsId: mlsMatch?mlsMatch[1]:(mapped.mlsId||undefined),
      description: desc,
      images: Array.from(new Set(gallery)).slice(0, 24),
      propertyStyle: mapped.propertyStyle,
      stories: mapped.stories,
      garageSpaces: mapped.garageSpaces,
      garageType: mapped.garageType,
      township: mapped.township,
      schoolDistrict: mapped.schoolDistrict,
      estimatedTaxes: mapped.estimatedTaxes,
      zoning: mapped.zoning,
      landUse: mapped.landUse,
      utilities: mapped.utilities,
      status: mapped.status,
      virtualTour: virtualTour || undefined,
      extra: pairs,
      extractedAt: new Date().toISOString()
    };
  }

  function extractPPM(){
    const title = document.querySelector('h1, .title');
    const pageTxt = document.body.innerText;
    const gallery = Array.from(document.querySelectorAll('img')).map(i=>i.src).filter(u=>/\.(jpg|jpeg|png|webp)/i.test(u));
    const t = text(title);
    const price = int((pageTxt.match(/\$[\d,]+/)||[])[0]);
    const {address, city, state, zip} = canonicalAddress(t);
    const mlsMatch = pageTxt.match(/MLS\s*ID\s*(\d{5,})/i);
    const beds = int((pageTxt.match(/Bedrooms?\s*(\d+)/i)||[])[1]);
    const baths = int((pageTxt.match(/Bathrooms?\s*(\d+)/i)||[])[1]);
    const type = 'Rentals';
    const desc = text(document.querySelector('#property-description, .description, [data-section="Property Description"]')) || '';
    return {
      sourceUrl: location.href,
      address, city, state, zip, rentMonthly: price, type, beds, baths,
      mlsId: mlsMatch?mlsMatch[1]:undefined,
      description: desc,
      images: Array.from(new Set(gallery)).slice(0, 24),
      extractedAt: new Date().toISOString()
    };
  }

  function extract(){
    const host = location.hostname;
    try{
      if(/thepreferredrealty\.com$/i.test(host) || /thepreferredrealty\.com$/i.test(host.replace(/^www\./,''))){
        return extractPreferredRealty();
      }
      if(/bhhspreferredpropertymgt\.com$/i.test(host) || /bhhspreferredpropertymgt\.com$/i.test(host.replace(/^www\./,''))){
        return extractPPM();
      }
      return { error: 'Unsupported domain' };
    }catch(e){
      return { error: e.message };
    }
  }

  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse)=>{
    if(msg.action==='extract'){
      sendResponse(extract());
    }
  });
})();


