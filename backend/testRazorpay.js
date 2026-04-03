// Test script to check Razorpay integration
require('dotenv').config();
const Razorpay = require('razorpay');

async function testRazorpay() {
  try {
    console.log('🔍 Checking Razorpay configuration...\n');

    // Check environment variables
    console.log('Environment Variables:');
    console.log('RAZORPAY_KEY_ID:', process.env.RAZORPAY_KEY_ID ? '✅ Set' : '❌ Not set');
    console.log('RAZORPAY_KEY_SECRET:', process.env.RAZORPAY_KEY_SECRET ? '✅ Set' : '❌ Not set');
    console.log('');

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error('❌ Razorpay keys are not set in .env file');
      process.exit(1);
    }

    // Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    console.log('✅ Razorpay instance created\n');

    // Try to create a test order
    console.log('🧪 Creating test order...');
    const testOrder = await razorpay.orders.create({
      amount: 100 * 100, // ₹100 in paise
      currency: 'INR',
      receipt: `test_${Date.now()}`,
      notes: {
        test: true,
      },
    });

    console.log('✅ Test order created successfully!');
    console.log('Order ID:', testOrder.id);
    console.log('Amount:', testOrder.amount / 100, 'INR');
    console.log('Status:', testOrder.status);
    console.log('\n✅ Razorpay integration is working correctly!');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Razorpay Error:', error.message);
    if (error.error) {
      console.error('Error Details:', error.error);
    }
    console.error('\n💡 Possible solutions:');
    console.error('1. Check if Razorpay keys are correct');
    console.error('2. Ensure you are using Test keys (rzp_test_...)');
    console.error('3. Check your internet connection');
    console.error('4. Verify Razorpay account is active');
    process.exit(1);
  }
}

testRazorpay();
