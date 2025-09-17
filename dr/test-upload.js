// Test script for prescription upload functionality
async function testUpload() {
  try {
    console.log('Testing prescription upload functionality...');

    // Test data for blockchain recording
    const testData = {
      cid: 'test-cid-12345',
      filename: 'test-prescription.pdf',
      uploaderAddress: 'MPUGPI43QBAHNCMAMUBQ4WZQ6OBNUUGQVG46JF6ANJXHXY7GS4EUTHMZWU',
      iv: 'test-iv-base64',
      timestamp: new Date().toISOString()
    };

    console.log('Sending test data to backend...');
    const response = await fetch('http://localhost:3001/api/record-on-chain', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Backend response:', result);

    if (result.success) {
      console.log('✅ Blockchain recording test successful!');
      console.log(`Transaction ID: ${result.txId}`);
    } else {
      console.log('⚠️ Backend returned success=false');
    }
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testUpload();
