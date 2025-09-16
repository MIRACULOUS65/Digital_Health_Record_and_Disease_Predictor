/**
 * Simple test utilities for Web3 Prescription Storage System
 * Copy and paste these functions into browser console for testing
 */

// Test backend connectivity
async function testBackendConnection() {
  console.log('🌐 Testing backend connection...');

  try {
    const response = await fetch('http://localhost:3001/health');

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Backend connection successful:', data);
      return true;
    } else {
      console.error('❌ Backend responded with error:', response.status, response.statusText);
      return false;
    }
  } catch (error) {
    console.error('❌ Backend connection failed:', error);
    console.log('💡 Make sure the backend server is running on http://localhost:3001');
    return false;
  }
}

// Test IPFS connectivity
async function testIPFSConnectivity() {
  console.log('🌍 Testing IPFS connectivity...');

  try {
    // Test by fetching a known IPFS resource
    const testCID = 'QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG';
    const response = await fetch(`https://w3s.link/ipfs/${testCID}`, { method: 'HEAD' });

    if (response.ok) {
      console.log('✅ IPFS gateway connectivity successful');
      return true;
    } else {
      console.error('❌ IPFS gateway responded with error:', response.status);
      return false;
    }
  } catch (error) {
    console.error('❌ IPFS connectivity test failed:', error);
    return false;
  }
}

// Test crypto functions
async function testCryptoFunctions() {
  console.log('🧪 Testing crypto utilities...');

  try {
    // Test basic Web Crypto API availability
    if (!window.crypto || !window.crypto.subtle) {
      console.error('❌ Web Crypto API not available');
      return false;
    }

    // Test key generation
    const key = await window.crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );

    // Test encryption/decryption
    const testData = new TextEncoder().encode('Test prescription content');
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    const encrypted = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      testData
    );

    const decrypted = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      encrypted
    );

    const decryptedText = new TextDecoder().decode(decrypted);

    if (decryptedText === 'Test prescription content') {
      console.log('✅ Crypto utilities test successful');
      return true;
    } else {
      console.error('❌ Decryption failed - content mismatch');
      return false;
    }

  } catch (error) {
    console.error('❌ Crypto test failed:', error);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting Web3 Prescription Storage System Tests...\n');

  const results = {
    backend: await testBackendConnection(),
    ipfs: await testIPFSConnectivity(),
    crypto: await testCryptoFunctions()
  };

  console.log('\n📊 Test Results Summary:');
  console.log(`Backend Connection: ${results.backend ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`IPFS Connectivity: ${results.ipfs ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Crypto Functions: ${results.crypto ? '✅ PASS' : '❌ FAIL'}`);

  const allPassed = Object.values(results).every(result => result === true);
  console.log(`\n${allPassed ? '🎉 All tests passed!' : '⚠️ Some tests failed. Check the logs above.'}`);

  return results;
}

console.log('🧪 Test utilities loaded!');
console.log('Run runAllTests() to test the entire system');
console.log('Or run individual tests: testBackendConnection(), testIPFSConnectivity(), testCryptoFunctions()');

// Export for ES modules (optional)
export { testBackendConnection, testIPFSConnectivity, testCryptoFunctions, runAllTests };
