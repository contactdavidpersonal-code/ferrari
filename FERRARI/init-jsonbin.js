#!/usr/bin/env node

/**
 * Initialize JSONBin with the correct data structure
 * Run this after setting up your JSONBin credentials
 */

import { createClient } from '@supabase/supabase-js';

// You'll need to replace these with your actual JSONBin credentials
const JSONBIN_API_KEY = process.env.VITE_JSONBIN_API_KEY;
const JSONBIN_BIN_ID = process.env.VITE_JSONBIN_BIN_ID;

// Initial empty data structure for the JSONBin
const initialData = {
  properties: [],
  leads: [],
  communications: [],
  notes: []
};

async function initializeJsonBin() {
  console.log('🚀 Initializing JSONBin with empty data structure...\n');
  
  if (!JSONBIN_API_KEY || !JSONBIN_BIN_ID) {
    console.log('❌ Please set your JSONBin credentials first:');
    console.log('1. Get your API key from JSONBin dashboard');
    console.log('2. Get your Bin ID from your JSONBin URL');
    console.log('3. Set environment variables:');
    console.log('   VITE_JSONBIN_API_KEY=your-api-key');
    console.log('   VITE_JSONBIN_BIN_ID=your-bin-id');
    console.log('\n📋 Your JSONBin should have this structure:');
    console.log(JSON.stringify(initialData, null, 2));
    return;
  }

  try {
    const response = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`, {
      method: 'PUT',
      headers: { 
        'X-Master-Key': JSONBIN_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(initialData)
    });

    if (response.ok) {
      console.log('✅ JSONBin initialized successfully!');
      console.log('📊 Data structure created with empty arrays for:');
      console.log('  - properties');
      console.log('  - leads');
      console.log('  - communications');
      console.log('  - notes');
      console.log('\n🎯 Your application is now ready to use JSONBin!');
    } else {
      console.error('❌ Failed to initialize JSONBin:', response.status, response.statusText);
      console.log('\n💡 Make sure your API key and Bin ID are correct');
    }
  } catch (error) {
    console.error('❌ Error initializing JSONBin:', error.message);
    console.log('\n💡 Check your internet connection and API credentials');
  }
}

initializeJsonBin();
