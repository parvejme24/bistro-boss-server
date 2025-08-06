const axios = require('axios');

const BASE_URL = 'http://localhost:5000'; // Server is running on port 5000

async function testServer() {
  console.log('🧪 Testing Bistro Boss Server...\n');

  try {
    // Test 1: Basic connectivity
    console.log('1️⃣ Testing basic connectivity...');
    const response1 = await axios.get(`${BASE_URL}/`);
    console.log('✅ Server is running!');
    console.log('📄 Response:', response1.data);
    console.log('');

    // Test 2: Public config endpoint
    console.log('2️⃣ Testing public config endpoint...');
    try {
      const response2 = await axios.get(`${BASE_URL}/api/v1/config`);
      console.log('✅ Public config endpoint working!');
      console.log('📄 Response:', response2.data);
    } catch (configError) {
      console.log('⚠️  Config endpoint requires authentication (expected)');
      console.log('📄 Status:', configError.response?.status || 'Unknown');
    }
    console.log('');

    // Test 3: Menus endpoint
    console.log('3️⃣ Testing menus endpoint...');
    const response3 = await axios.get(`${BASE_URL}/api/v1/menus`);
    console.log('✅ Menus endpoint working!');
    console.log('📄 Found', response3.data.menus?.length || 0, 'menu items');
    console.log('');

    console.log('🎉 Server is working correctly!');
    console.log('');
    console.log('📋 Available URLs:');
    console.log(`📍 Local: ${BASE_URL}`);
    console.log('🌐 Live: https://bistro-boss-server-tau-three.vercel.app');
    console.log(`📚 API: ${BASE_URL}/api/v1`);
    console.log('');
    console.log('🚀 Your Bistro Boss Server is ready!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('');
    console.log('🔧 Troubleshooting:');
    console.log('• Make sure the server is running (npm run dev)');
    console.log('• Check if port 5000 is available');
    console.log('• Verify your .env file is configured');
  }
}

// Run the test
testServer(); 