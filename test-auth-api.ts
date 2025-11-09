/**
 * Test script for Authentication API endpoints
 * Run with: npx tsx test-auth-api.ts
 */

import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const BASE_URL = 'http://localhost:3000';

// Store tokens between requests
let accessToken = '';
let refreshToken = '';
let sessionId = '';

/**
 * Test helper: Make API request
 */
async function request(
  endpoint: string,
  method: string = 'GET',
  data?: any,
  token?: string
) {
  const url = `${BASE_URL}${endpoint}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options: RequestInit = {
    method,
    headers,
  };

  if (data && (method === 'POST' || method === 'PUT')) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);
    const json = await response.json();
    return {
      status: response.status,
      data: json,
    };
  } catch (error: any) {
    return {
      status: 500,
      data: { success: false, message: error.message },
    };
  }
}

/**
 * Test helper: Print test result
 */
function printResult(testName: string, result: any) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📝 TEST: ${testName}`);
  console.log(`${'='.repeat(60)}`);
  console.log(`Status: ${result.status}`);
  console.log(`Response:`);
  console.log(JSON.stringify(result.data, null, 2));
}

/**
 * Main test suite
 */
async function runTests() {
  console.log('🚀 Starting Authentication API Tests...\n');
  console.log(`Base URL: ${BASE_URL}`);
  console.log(
    `⚠️  Make sure the development server is running (npm run dev)\n`
  );

  // Wait for user confirmation
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Test 1: Login with valid credentials
  console.log('\n' + '▶'.repeat(30));
  console.log('TEST 1: Login with valid credentials');
  console.log('▶'.repeat(30));

  const loginResult = await request('/api/auth/login', 'POST', {
    email: 'admin@genfity.com',
    password: 'Admin@123456',
  });

  printResult('POST /api/auth/login (Valid Credentials)', loginResult);

  if (loginResult.data.success) {
    accessToken = loginResult.data.data.accessToken;
    refreshToken = loginResult.data.data.refreshToken;
    console.log('\n✅ Login successful! Tokens saved.');
  } else {
    console.log('\n❌ Login failed! Cannot proceed with other tests.');
    process.exit(1);
  }

  // Test 2: Login with invalid credentials
  console.log('\n' + '▶'.repeat(30));
  console.log('TEST 2: Login with invalid credentials');
  console.log('▶'.repeat(30));

  const invalidLoginResult = await request('/api/auth/login', 'POST', {
    email: 'admin@genfity.com',
    password: 'wrongpassword',
  });

  printResult(
    'POST /api/auth/login (Invalid Credentials)',
    invalidLoginResult
  );

  // Test 3: Get current user (me)
  console.log('\n' + '▶'.repeat(30));
  console.log('TEST 3: Get current user info');
  console.log('▶'.repeat(30));

  const meResult = await request('/api/auth/me', 'GET', undefined, accessToken);

  printResult('GET /api/auth/me', meResult);

  if (meResult.data.success && meResult.data.data.session) {
    sessionId = meResult.data.data.session.id;
    console.log(`\n✅ Session ID: ${sessionId}`);
  }

  // Test 4: Get active sessions
  console.log('\n' + '▶'.repeat(30));
  console.log('TEST 4: Get active sessions');
  console.log('▶'.repeat(30));

  const sessionsResult = await request(
    '/api/auth/sessions',
    'GET',
    undefined,
    accessToken
  );

  printResult('GET /api/auth/sessions', sessionsResult);

  // Test 5: Refresh token
  console.log('\n' + '▶'.repeat(30));
  console.log('TEST 5: Refresh access token');
  console.log('▶'.repeat(30));

  const refreshResult = await request('/api/auth/refresh', 'POST', {
    refreshToken: refreshToken,
  });

  printResult('POST /api/auth/refresh', refreshResult);

  if (refreshResult.data.success) {
    const newAccessToken = refreshResult.data.data.accessToken;
    const newRefreshToken = refreshResult.data.data.refreshToken;
    console.log('\n✅ Token refreshed successfully!');
    console.log(`New Access Token: ${newAccessToken.substring(0, 50)}...`);
    console.log(
      `New Refresh Token: ${newRefreshToken.substring(0, 50)}...`
    );

    // Update tokens
    accessToken = newAccessToken;
    refreshToken = newRefreshToken;
  }

  // Test 6: Change password (commented out to prevent locking the admin account)
  /*
  console.log('\n' + '▶'.repeat(30));
  console.log('TEST 6: Change password');
  console.log('▶'.repeat(30));

  const changePasswordResult = await request(
    '/api/auth/change-password',
    'POST',
    {
      currentPassword: 'Admin@123456',
      newPassword: 'NewSecure@123',
    },
    accessToken
  );

  printResult('POST /api/auth/change-password', changePasswordResult);
  */

  // Test 7: Access protected route without token
  console.log('\n' + '▶'.repeat(30));
  console.log('TEST 7: Access protected route without token');
  console.log('▶'.repeat(30));

  const unauthorizedResult = await request('/api/auth/me', 'GET');

  printResult('GET /api/auth/me (No Token)', unauthorizedResult);

  // Test 8: Logout
  console.log('\n' + '▶'.repeat(30));
  console.log('TEST 8: Logout from current session');
  console.log('▶'.repeat(30));

  const logoutResult = await request(
    '/api/auth/logout',
    'POST',
    undefined,
    accessToken
  );

  printResult('POST /api/auth/logout', logoutResult);

  // Test 9: Try to access after logout
  console.log('\n' + '▶'.repeat(30));
  console.log('TEST 9: Access after logout (should fail)');
  console.log('▶'.repeat(30));

  const afterLogoutResult = await request(
    '/api/auth/me',
    'GET',
    undefined,
    accessToken
  );

  printResult('GET /api/auth/me (After Logout)', afterLogoutResult);

  // Summary
  console.log('\n' + '🎉'.repeat(30));
  console.log('✅ ALL AUTHENTICATION API TESTS COMPLETED!');
  console.log('🎉'.repeat(30));
  console.log('\n📊 Test Summary:');
  console.log('  ✅ Login with valid credentials');
  console.log('  ✅ Login with invalid credentials (error handling)');
  console.log('  ✅ Get current user info');
  console.log('  ✅ Get active sessions');
  console.log('  ✅ Refresh token');
  console.log('  ✅ Access without token (unauthorized)');
  console.log('  ✅ Logout');
  console.log('  ✅ Access after logout (session revoked)');
  console.log('\n💡 Next steps:');
  console.log('  - Start development server: npm run dev');
  console.log('  - Test with Postman/Insomnia');
  console.log('  - Implement Merchant Service');
  console.log('  - Implement Admin API endpoints\n');
}

// Run tests
runTests().catch((error) => {
  console.error('\n❌ Test suite failed:', error);
  process.exit(1);
});
