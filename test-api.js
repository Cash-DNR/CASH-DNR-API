// API Test Script for CASH-DNR API
// Run this after starting the server to test the functionality

const API_BASE = 'http://localhost:4000/api';

// Helper function to make API calls
async function apiCall(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    }
  };
  
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, options);
    const data = await response.json();
    
    console.log(`\n${method} ${endpoint}`);
    console.log(`Status: ${response.status}`);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    return { status: response.status, data };
  } catch (error) {
    console.error(`Error calling ${endpoint}:`, error.message);
    return { error: error.message };
  }
}

// Test sequence
async function runTests() {
  console.log('🚀 Starting CASH-DNR API Tests...\n');
  
  // 1. Health Check
  await apiCall('/health');
  
  // 2. Register a citizen
  const citizenRegistration = await apiCall('/register/citizen', 'POST', {
    idNumber: '9001015009087',
    contactInfo: {
      phone: '+27 82 123 4567',
      email: 'john.doe@example.com'
    }
  });
  
  let userId = null;
  if (citizenRegistration.status === 201) {
    userId = citizenRegistration.data.userId;
    console.log(`✅ Citizen registered with userId: ${userId}`);
  }
  
  // 3. Register a business
  const businessRegistration = await apiCall('/register/business', 'POST', {
    businessRegNumber: '2022/123456/07',
    representativeIdNumber: '9001015009087',
    contactInfo: {
      phone: '+27 11 123 4567',
      email: 'business@acme.com'
    }
  });
  
  let businessUserId = null;
  if (businessRegistration.status === 201) {
    businessUserId = businessRegistration.data.userId;
    console.log(`✅ Business registered with userId: ${businessUserId}`);
  }
  
  // 4. Get user profile
  if (userId) {
    await apiCall(`/users/${userId}`);
  }
  
  // 5. Create transactions
  if (userId) {
    // Small transaction (should be Non-Taxable)
    await apiCall('/transactions', 'POST', {
      amount: 500.00,
      purpose: 'Coffee purchase',
      userId: userId,
      transactionType: 'manual',
      cashNoteSerial: 'ZAR500001'
    });
    
    // Medium transaction (should be Review-Required)
    await apiCall('/transactions', 'POST', {
      amount: 5000.00,
      purpose: 'Equipment purchase',
      userId: userId,
      transactionType: 'digital',
      digitalReference: 'EFT-REF-12345'
    });
    
    // Large transaction (should be Taxable-HighValue)
    await apiCall('/transactions', 'POST', {
      amount: 30000.00,
      purpose: 'Vehicle purchase',
      userId: userId,
      transactionType: 'manual'
    });
    
    // Business transaction (should be Taxable-Business)
    await apiCall('/transactions', 'POST', {
      amount: 2500.00,
      purpose: 'Business service invoice payment',
      userId: userId,
      transactionType: 'digital',
      digitalReference: 'EFT-BUSINESS-789'
    });
  }
  
  // 6. Get transaction history
  if (userId) {
    await apiCall(`/users/${userId}/transactions?limit=10`);
  }
  
  // 7. Get tax summary
  if (userId) {
    await apiCall(`/users/${userId}/tax-summary?year=2025`);
  }
  
  // 8. Test duplicate transaction prevention
  if (userId) {
    console.log('\n🔄 Testing duplicate prevention...');
    await apiCall('/transactions', 'POST', {
      amount: 1000.00,
      purpose: 'Duplicate test',
      userId: userId,
      digitalReference: 'EFT-REF-12345' // Same reference as before
    });
  }
  
  // 9. Admin statistics
  await apiCall('/admin/statistics');
  
  // 10. Flagged transactions
  await apiCall('/admin/flagged-transactions?limit=5');
  
  // 11. Audit logs
  await apiCall('/admin/audit-logs?limit=10');
  
  // 12. Test Home Affairs verification
  await apiCall('/citizens/9001015009087');
  
  // 13. Test CIPC verification
  await apiCall('/businesses/2022/123456/07');
  
  console.log('\n✅ All tests completed!');
  console.log('\n📋 Test Summary:');
  console.log('- User registration (Individual & Business)');
  console.log('- Transaction creation with tax classification');
  console.log('- Duplicate prevention');
  console.log('- Transaction history retrieval');
  console.log('- Tax summary generation');
  console.log('- Admin dashboard functionality');
  console.log('- Audit logging');
  console.log('- Home Affairs & CIPC verification');
}

// Run tests if this file is executed directly
if (typeof window === 'undefined') {
  // Node.js environment
  const fetch = require('node-fetch');
  runTests().catch(console.error);
} else {
  // Browser environment
  console.log('Copy and paste the runTests() function into your browser console to run tests');
}

// Export for use in other scripts
if (typeof module !== 'undefined') {
  module.exports = { runTests, apiCall };
}
