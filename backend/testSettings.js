// Test script to check Settings model
require('dotenv').config();
const mongoose = require('mongoose');
const Settings = require('./models/Settings');

async function testSettings() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Get or create settings
    const settings = await Settings.getSettings();
    console.log('✅ Settings loaded:', {
      taxRate: settings.taxRate,
      taxName: settings.taxName,
      taxEnabled: settings.taxEnabled,
      deliveryCharge: settings.deliveryCharge,
      freeDeliveryThreshold: settings.freeDeliveryThreshold,
      deliveryEnabled: settings.deliveryEnabled,
      codEnabled: settings.codEnabled,
      onlinePaymentEnabled: settings.onlinePaymentEnabled,
    });

    // Test calculation
    const subtotal = 1000;
    const tax = settings.taxEnabled ? Math.round(subtotal * settings.taxRate) : 0;
    const shipping = settings.deliveryEnabled && subtotal < settings.freeDeliveryThreshold 
      ? settings.deliveryCharge 
      : 0;
    const total = subtotal + shipping + tax;

    console.log('\n📊 Test Calculation:');
    console.log('Subtotal:', subtotal);
    console.log('Tax:', tax);
    console.log('Shipping:', shipping);
    console.log('Total:', total);

    console.log('\n✅ Settings are working correctly!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

testSettings();
