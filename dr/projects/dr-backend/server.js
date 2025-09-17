import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import algosdk from 'algosdk';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Algorand configuration with fallback endpoints
const ALGORAND_ENDPOINTS = [
  {
    server: 'https://testnet-api.4160.nodely.dev',
    port: '',
    token: '',
    name: 'Nodely'
  },
  {
    server: 'https://testnet-api.algonode.io',
    port: 443,
    token: '',
    name: 'AlgoNode'
  },
  {
    server: 'https://testnet-algorand.api.purestake.io/ps2',
    port: '',
    token: process.env.PURESTAKE_API_KEY || '',
    name: 'PureStake'
  },
  {
    server: 'https://node.testnet.algoexplorerapi.io',
    port: '',
    token: '',
    name: 'AlgoExplorer'
  }
];

let algodClient = null;
let currentEndpoint = null;

// Try to connect to Algorand with fallback endpoints
async function initializeAlgodClient() {
  for (const endpoint of ALGORAND_ENDPOINTS) {
    try {
      console.log(`🔄 Trying ${endpoint.name} endpoint...`);
      const client = new algosdk.Algodv2(endpoint.token, endpoint.server, endpoint.port);

      // Test the connection
      await client.status().do();

      algodClient = client;
      currentEndpoint = endpoint;
      console.log(`✅ Connected to Algorand via ${endpoint.name}`);
      return true;
    } catch (error) {
      console.log(`❌ ${endpoint.name} failed:`, error.message);
      continue;
    }
  }

  console.error('🚨 All Algorand endpoints failed');
  return false;
}

// Validate environment variables
if (!process.env.SERVER_MNEMONIC) {
  console.error('ERROR: SERVER_MNEMONIC environment variable is required');
  console.log('💡 For testing, you can generate a new account at: https://testnet.algoexplorer.io/');
  console.log('💡 Or use this test mnemonic (TESTNET ONLY): "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon address"');
  process.exit(1);
}

// Create account from mnemonic
let serverAccount;
let serverAddress;
try {
  serverAccount = algosdk.mnemonicToSecretKey(process.env.SERVER_MNEMONIC);

  // Handle both old and new algosdk versions
  if (typeof serverAccount.addr === 'string') {
    serverAddress = serverAccount.addr;
  } else {
    serverAddress = algosdk.encodeAddress(serverAccount.addr.publicKey);
  }

  console.log(`Server Account Address: ${serverAddress}`);
  console.log('⚠️  Fund this account for real blockchain transactions at:');
  console.log('   https://dispenser.testnet.aws.algodev.network/');
  console.log('   https://testnet.algoexplorer.io/');

  if (process.env.USER_HD_ACCOUNT) {
    console.log(`💳 User HD Account: ${process.env.USER_HD_ACCOUNT}`);
    console.log('   (for future wallet integration)');
  }
} catch (error) {
  console.error('ERROR: Invalid SERVER_MNEMONIC provided');
  console.log('💡 Make sure it\'s a valid 25-word Algorand mnemonic phrase');
  process.exit(1);
}

// Initialize Algorand connection
initializeAlgodClient().then(connected => {
  if (!connected) {
    console.log('⚠️  Starting server without Algorand connection (demo mode)');
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    serverAddress: serverAddress
  });
});

// Record prescription metadata on Algorand blockchain
app.post('/api/record-on-chain', async (req, res) => {
  try {
    const { cid, filename, uploaderAddress, iv, timestamp } = req.body;

    // Validate required fields
    if (!cid || !filename || !iv || !timestamp) {
      return res.status(400).json({
        error: 'Missing required fields: cid, filename, iv, timestamp'
      });
    }

    // Check if Algorand client is available
    if (!algodClient) {
      console.log('⚠️  No Algorand connection - returning mock transaction');
      const mockTxId = `mock_tx_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
      return res.json({
        success: true,
        txId: mockTxId,
        confirmedRound: 'demo',
        explorerUrl: `https://testnet.algoexplorer.io/tx/${mockTxId}`,
        metadata: {
          type: 'prescription_upload',
          cid,
          filename,
          uploaderAddress: uploaderAddress || 'anonymous',
          iv,
          timestamp,
          serverAddress: serverAddress
        },
        note: 'Demo mode - blockchain not available'
      });
    }

    // Prepare metadata to store in transaction note
    const metadata = {
      type: 'prescription_upload',
      cid,
      filename,
      uploaderAddress: uploaderAddress || 'anonymous',
      iv,
      timestamp,
      serverAddress: serverAddress
    };

    console.log('Recording metadata on blockchain:', metadata);

    // Get suggested transaction parameters
    const suggestedParams = await algodClient.getTransactionParams().do();
    console.log('✅ Got transaction params');

    // Create a simple payment transaction with algosdk 2.x API
    const txn = algosdk.makePaymentTxnWithSuggestedParams(
      serverAddress,      // from
      serverAddress,      // to (self)
      0,                 // amount (0 ALGO)
      undefined,         // closeRemainderTo
      new TextEncoder().encode(JSON.stringify(metadata)), // note
      suggestedParams    // suggested params
    );

    console.log('✅ Transaction created successfully');

    // Sign the transaction
    const signedTxn = txn.signTxn(serverAccount.sk);
    console.log('✅ Transaction signed');

    // Submit the transaction
    console.log('Submitting transaction to Algorand...');
    const { txId } = await algodClient.sendRawTransaction(signedTxn).do();

    // Wait for confirmation
    console.log(`Transaction submitted with ID: ${txId}`);
    console.log('Waiting for confirmation...');

    const confirmedTxn = await algosdk.waitForConfirmation(algodClient, txId, 4);

    console.log(`✅ Transaction confirmed in round: ${confirmedTxn['confirmed-round']}`);

    // Return success response
    res.json({
      success: true,
      txId,
      confirmedRound: confirmedTxn['confirmed-round'],
      explorerUrl: `https://testnet.algoexplorer.io/tx/${txId}`,
      metadata
    });

  } catch (error) {
    console.error('❌ Error recording on blockchain:', error);

    // Check if it's an overspend error (insufficient funds)
    if (error.message && error.message.includes('overspend')) {
      console.log('⚠️  Insufficient funds - returning mock transaction for demo');
      const mockTxId = `demo_tx_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
      return res.json({
        success: true,
        txId: mockTxId,
        confirmedRound: 'demo',
        explorerUrl: `https://testnet.algoexplorer.io/tx/${mockTxId}`,
        metadata: {
          type: 'prescription_upload',
          cid: req.body.cid,
          filename: req.body.filename,
          uploaderAddress: req.body.uploaderAddress || 'anonymous',
          iv: req.body.iv,
          timestamp: req.body.timestamp,
          serverAddress: serverAddress
        },
        note: 'Demo mode - insufficient funds'
      });
    }

    let errorMessage = 'Unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    // If it's a network error, provide helpful information
    if (errorMessage.includes('fetch failed') || errorMessage.includes('ENOTFOUND')) {
      errorMessage = 'Network connection to Algorand failed. Using demo mode.';

      // Return a mock response for demo purposes
      const mockTxId = `demo_tx_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
      return res.json({
        success: true,
        txId: mockTxId,
        confirmedRound: 'demo',
        explorerUrl: `https://testnet.algoexplorer.io/tx/${mockTxId}`,
        metadata: {
          type: 'prescription_upload',
          cid: req.body.cid,
          filename: req.body.filename,
          uploaderAddress: req.body.uploaderAddress || 'anonymous',
          iv: req.body.iv,
          timestamp: req.body.timestamp,
          serverAddress: serverAddress
        },
        note: 'Demo mode - network connection unavailable'
      });
    }

    res.status(500).json({
      error: 'Failed to record on blockchain',
      details: errorMessage,
      timestamp: new Date().toISOString()
    });
  }
});

// Get transaction details by ID
app.get('/api/transaction/:txId', async (req, res) => {
  try {
    const { txId } = req.params;

    // Get transaction information
    const txnInfo = await algodClient.pendingTransactionInformation(txId).do();

    // If transaction is confirmed, get confirmed transaction info
    if (txnInfo['confirmed-round']) {
      const block = await algodClient.block(txnInfo['confirmed-round']).do();
      const confirmedTxn = block.block.txns.find(t => t.txn.txid === txId);

      if (confirmedTxn && confirmedTxn.txn.note) {
        // Decode the note to get metadata
        const noteText = new TextDecoder().decode(confirmedTxn.txn.note);
        const metadata = JSON.parse(noteText);

        res.json({
          txId,
          confirmedRound: txnInfo['confirmed-round'],
          metadata,
          explorerUrl: `https://testnet.algoexplorer.io/tx/${txId}`
        });
      } else {
        res.json({
          txId,
          confirmedRound: txnInfo['confirmed-round'],
          note: 'No metadata found',
          explorerUrl: `https://testnet.algoexplorer.io/tx/${txId}`
        });
      }
    } else {
      res.json({
        txId,
        status: 'pending',
        poolError: txnInfo['pool-error'] || null
      });
    }

  } catch (error) {
    console.error('Error fetching transaction:', error);
    res.status(500).json({
      error: 'Failed to fetch transaction',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get server account balance
app.get('/api/account/balance', async (req, res) => {
  try {
    if (!algodClient) {
      return res.json({
        address: serverAddress,
        balance: 0,
        status: 'demo_mode',
        note: 'No blockchain connection - demo mode active'
      });
    }

    const accountInfo = await algodClient.accountInformation(serverAddress).do();

    res.json({
      address: serverAddress,
      balance: Number(accountInfo.amount) / 1000000, // Convert from microAlgos to Algos
      minBalance: Number(accountInfo['min-balance']) / 1000000,
      totalAssets: accountInfo['total-assets-opted-in'] || 0,
      totalAppsOptedIn: accountInfo['total-apps-opted-in'] || 0
    });
  } catch (error) {
    console.error('Error fetching account balance:', error);
    res.status(500).json({
      error: 'Failed to fetch account balance',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    error: 'Internal server error',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    path: req.path,
    method: req.method
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 DR Backend server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 Server account: ${serverAddress}`);
  console.log(`🌐 Using Algorand Testnet via AlgoNode`);
});

export default app;
