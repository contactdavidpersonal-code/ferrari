# 🚀 Quick Database Setup Instructions

## Option 1: Copy-Paste Method (Fastest)

1. **Go to**: https://supabase.com/dashboard
2. **Click**: Your project `bbroowfsxdgawbevadqg`
3. **Click**: "SQL Editor" in the left sidebar
4. **Click**: "New query"
5. **Copy and paste** this entire SQL script:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create properties table
CREATE TABLE IF NOT EXISTS properties (
    id SERIAL PRIMARY KEY,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    zip_code VARCHAR(10) NOT NULL,
    price INTEGER NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('Residential', 'Commercial', 'Land', 'Rentals')),
    sqft INTEGER NOT NULL,
    
    -- Property details
    lot_size VARCHAR(50),
    year_built INTEGER,
    property_style VARCHAR(100),
    stories INTEGER,
    condition VARCHAR(50),
    
    -- Residential details
    beds INTEGER,
    baths DECIMAL(3,1),
    half_baths INTEGER,
    
    -- Berkshire Hathaway specific fields
    mls_id VARCHAR(50),
    estimated_taxes INTEGER,
    garage_spaces INTEGER,
    garage_type VARCHAR(50),
    school_district VARCHAR(100),
    township VARCHAR(100),
    
    -- Land details
    land_use VARCHAR(100),
    utilities TEXT[],
    zoning VARCHAR(50),
    
    -- Commercial details
    parking_spaces INTEGER,
    
    -- Features & amenities
    features TEXT[],
    appliances TEXT[],
    heating VARCHAR(100),
    cooling VARCHAR(100),
    flooring TEXT[],
    
    -- Financial information
    property_taxes INTEGER,
    hoa_fees INTEGER,
    hoa_frequency VARCHAR(20),
    rental_income INTEGER,
    cap_rate DECIMAL(5,2),
    
    -- Media
    images TEXT[],
    videos TEXT[],
    virtual_tour TEXT,
    
    -- Listing status & dates
    listing_date DATE NOT NULL,
    last_updated DATE NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('Active', 'Inactive', 'Pending', 'Sold')),
    
    -- AI integration
    ai_prompt TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    source VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('New', 'Contacted', 'Qualified', 'Proposal', 'Closed')) DEFAULT 'New',
    score INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create communications table
CREATE TABLE IF NOT EXISTS communications (
    id SERIAL PRIMARY KEY,
    lead_id INTEGER NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('Email', 'Phone', 'Text', 'In Person', 'Other')),
    content TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notes table
CREATE TABLE IF NOT EXISTS notes (
    id SERIAL PRIMARY KEY,
    lead_id INTEGER NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    category VARCHAR(100),
    importance VARCHAR(10) NOT NULL CHECK (importance IN ('Low', 'Medium', 'High')) DEFAULT 'Medium',
    property_ids INTEGER[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(type);
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);
CREATE INDEX IF NOT EXISTS idx_communications_lead_id ON communications(lead_id);
CREATE INDEX IF NOT EXISTS idx_notes_lead_id ON notes(lead_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_properties_updated_at 
    BEFORE UPDATE ON properties 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at 
    BEFORE UPDATE ON leads 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (you can restrict these later)
CREATE POLICY "Allow public read access to properties" ON properties
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert access to properties" ON properties
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access to properties" ON properties
    FOR UPDATE USING (true);

CREATE POLICY "Allow public delete access to properties" ON properties
    FOR DELETE USING (true);

CREATE POLICY "Allow public read access to leads" ON leads
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert access to leads" ON leads
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access to leads" ON leads
    FOR UPDATE USING (true);

CREATE POLICY "Allow public delete access to leads" ON leads
    FOR DELETE USING (true);

CREATE POLICY "Allow public read access to communications" ON communications
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert access to communications" ON communications
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access to notes" ON notes
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert access to notes" ON notes
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access to notes" ON notes
    FOR UPDATE USING (true);

CREATE POLICY "Allow public delete access to notes" ON notes
    FOR DELETE USING (true);

-- Insert some sample data
INSERT INTO properties (
    address, city, state, zip_code, price, type, sqft, lot_size, year_built, 
    property_style, beds, baths, features, images, listing_date, last_updated, status, ai_prompt
) VALUES 
(
    '123 Main St', 'Lawrenceville', 'Pennsylvania', '15201', 350000, 'Residential', 1800, '0.25', 1955,
    'Colonial', 3, 2, ARRAY['Hardwood Floors', 'Updated Kitchen', 'Fireplace'], 
    ARRAY['https://picsum.photos/seed/lawrenceville-colonial/800/600'],
    CURRENT_DATE, CURRENT_DATE, 'Active',
    'Charming 3-bedroom colonial in the heart of Lawrenceville with original hardwood floors, updated kitchen featuring granite counters and stainless appliances, cozy fireplace in the living room, and a private backyard perfect for entertaining. Walking distance to Butler Street restaurants and shops.'
),
(
    '456 Butler St', 'Squirrel Hill', 'Pennsylvania', '15217', 425000, 'Residential', 2400, '0.3', 1920,
    'Tudor', 4, 3, ARRAY['Original Details', 'Sunroom', 'Walk-in Closets'], 
    ARRAY['https://picsum.photos/seed/squirrel-hill-tudor/800/600'],
    CURRENT_DATE, CURRENT_DATE, 'Active',
    'Elegant Tudor home in Squirrel Hill featuring original architectural details, spacious sunroom, and modern updates throughout. Prime location near universities and cultural attractions.'
),
(
    '789 Penn Ave', 'Downtown', 'Pennsylvania', '15222', 275000, 'Rentals', 1200, '0.1', 2010,
    'Modern Condo', 2, 2, ARRAY['Granite Counters', 'In-Unit Laundry', 'Parking Spot'], 
    ARRAY['https://picsum.photos/seed/downtown-condo/800/600'],
    CURRENT_DATE, CURRENT_DATE, 'Active',
    'Modern downtown condo perfect for rental investment. Features granite counters, in-unit laundry, and assigned parking. Prime location near business district and entertainment venues.',
    2200, 9.6
),
(
    '321 Carson St', 'South Side', 'Pennsylvania', '15203', 195000, 'Rentals', 1800, '0.2', 1985,
    'Duplex', 3, 2, ARRAY['Hardwood Floors', 'Updated Bathrooms', 'Private Yard'], 
    ARRAY['https://picsum.photos/seed/southside-duplex/800/600'],
    CURRENT_DATE, CURRENT_DATE, 'Active',
    'Charming duplex in South Side with hardwood floors and updated bathrooms. Great rental potential with private yard and close to Carson Street nightlife.',
    1800, 11.1
),
(
    '654 Forbes Ave', 'Oakland', 'Pennsylvania', '15213', 320000, 'Rentals', 1600, '0.15', 2005,
    'Townhouse', 3, 2.5, ARRAY['Stainless Appliances', 'Walk-in Closets', 'Balcony'], 
    ARRAY['https://picsum.photos/seed/oakland-townhouse/800/600'],
    CURRENT_DATE, CURRENT_DATE, 'Active',
    'Modern townhouse in Oakland near universities. Perfect for student rentals with stainless appliances, walk-in closets, and private balcony.',
    2500, 9.4
)
ON CONFLICT DO NOTHING;
```

6. **Click**: "Run" button
7. **Wait**: For the script to complete (should take 10-30 seconds)
8. **Done!** ✅

## Option 2: File Upload Method

1. **Go to**: https://supabase.com/dashboard
2. **Click**: Your project `bbroowfsxdgawbevadqg`
3. **Click**: "SQL Editor" in the left sidebar
4. **Click**: "New query"
5. **Click**: "Upload file" button
6. **Select**: The `supabase/schema.sql` file from your project
7. **Click**: "Run" button

## After Setup

Once you've run the SQL script, run this command to verify everything is working:

```bash
node setup_database.js
```

You should see:
- ✅ Database connection successful
- ✅ Rentals type is supported
- ✅ Sample rental properties inserted
- ✅ Property type distribution showing all types

## What You'll Get

- 🏠 **2 Residential properties** (sample data)
- 🏢 **3 Rental properties** (sample data)
- 📊 **Property Management page** with Rentals category
- 🎯 **Rentals tab** on frontend showing rental properties
- ✅ **Full functionality** for creating/editing rental properties

## Troubleshooting

If you get any errors:
1. Make sure you're in the correct Supabase project
2. Try running the script in smaller chunks
3. Check the Supabase logs for specific error messages
4. Contact me if you need help!

---

**Total time needed: 2-3 minutes** ⏱️
