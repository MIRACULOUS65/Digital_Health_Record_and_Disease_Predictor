// Test upload script to verify the upload process
import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';

async function testUpload() {
  console.log('🧪 Testing upload process...');

  // Test backend health
  try {
    const healthResponse = await fetch('http://localhost:3001/health');
    const healthData = await healthResponse.json();
    console.log('✅ Backend health:', healthData);
  } catch (error) {
    console.log('❌ Backend health check failed:', error.message);
    return;
  }

  // Test account balance
  try {
    const balanceResponse = await fetch('http://localhost:3001/api/account/balance');
    const balanceData = await balanceResponse.json();
    console.log('✅ Account balance:', balanceData);
  } catch (error) {
    console.log('❌ Account balance check failed:', error.message);
    return;
  }

  // Test blockchain recording with mock data
  const testMetadata = {
    cid: 'test_cid_12345',
    filename: 'test-prescription.pdf',
    uploaderAddress: 'test_uploader_address',
    iv: 'test_iv_base64',
    timestamp: new Date().toISOString(),
  };

  try {
    console.log('🔄 Testing blockchain recording...');
    const recordResponse = await fetch('http://localhost:3001/api/record-on-chain', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testMetadata),
    });

    if (!recordResponse.ok) {
      const errorText = await recordResponse.text();
      console.log('❌ Blockchain recording failed:', recordResponse.status, errorText);
      return;
    }

    const recordData = await recordResponse.json();
    console.log('✅ Blockchain recording successful:', recordData);

    if (recordData.txId && !recordData.txId.startsWith('mock_') && !recordData.txId.startsWith('demo_')) {
      console.log('🎉 Real blockchain transaction created!');
      console.log('🔗 Transaction URL:', recordData.explorerUrl);
    } else {
      console.log('⚠️ Demo/mock transaction created');
    }

  } catch (error) {
    console.log('❌ Blockchain recording error:', error.message);
  }
}

testUpload();
