# Web3 Prescription Storage System - Setup Guide

## 🚀 Quick Start Guide

This guide will help you set up and test the Web3 prescription storage system that encrypts prescription files and stores them on IPFS with metadata recorded on the Algorand blockchain.

## 📋 Prerequisites

1. **Node.js** (v18+)
2. **Web3.Storage Account** (for IPFS uploads)
3. **Algorand Testnet Account** (for blockchain transactions)

## 🛠️ Setup Instructions

### Step 1: Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd projects/dr-backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables in `.env`:**
   ```bash
   PORT=3001
   # Get a testnet account and mnemonic from https://testnet.algoexplorer.io/
   # Fund it with testnet ALGOs from https://testnet-algorand.sandbox.coinsmith.org/
   SERVER_MNEMONIC="your 25 word mnemonic phrase here"
   ```

5. **Start the backend server:**
   ```bash
   npm run dev
   ```

### Step 2: Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd ../dr-frontend
   ```

2. **Install additional dependencies** (if not already done):
   ```bash
   npm install web3.storage
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables in `.env`:**
   ```bash
   # Get token from https://web3.storage/ (create free account)
   VITE_WEB3STORAGE_TOKEN=your_web3_storage_token_here
   VITE_API_URL=http://localhost:3001
   ```

5. **Start the frontend:**
   ```bash
   npm run dev
   ```

## 🧪 Testing the System

### Test 1: Backend Health Check

1. **Check backend is running:**
   ```bash
   curl http://localhost:3001/health
   ```

   Should return:
   ```json
   {
     "status": "healthy",
     "timestamp": "2024-01-XX...",
     "serverAddress": "YOUR_ALGORAND_ADDRESS"
   }
   ```

### Test 2: Frontend Upload Interface

1. **Open frontend:** http://localhost:5173
2. **Click "📋 Web3 Prescription Upload" button**
3. **Upload flow should show:**
   - File selection interface
   - Encryption process explanation
   - Upload button

### Test 3: Complete Upload Flow

1. **Prepare test file:**
   - Use any image (.jpg, .png) or PDF file
   - Max 10MB size
   - Name it something like `test-prescription.jpg`

2. **Upload process:**
   - Select file → File validates successfully
   - Click "Upload & Encrypt" → Shows "Processing..."
   - **Expected flow:**
     ```
     1. File → Encrypted locally with AES-GCM
     2. Encrypted file → Uploaded to IPFS
     3. Metadata → Sent to backend
     4. Backend → Creates Algorand transaction
     5. Result → Shows CID, TX ID, and encryption key
     ```

3. **Success indicators:**
   - ✅ IPFS CID displayed
   - ✅ Algorand transaction ID shown
   - ✅ Encryption key download available
   - ✅ Links to verify on IPFS and AlgoExplorer

### Test 4: Verification

1. **Verify IPFS upload:**
   - Click "View on IPFS" link
   - Should show encrypted file (unreadable content)

2. **Verify blockchain transaction:**
   - Click "View Transaction" link
   - Should open AlgoExplorer with transaction details
   - Check transaction note contains metadata

3. **Test decryption (optional):**
   - Save the encryption key file
   - Use browser console to test decryption utilities

## 🔧 Troubleshooting

### Backend Issues

**Error: "SERVER_MNEMONIC environment variable is required"**
- Ensure you've created `.env` file in `dr-backend/`
- Add valid 25-word Algorand testnet mnemonic

**Error: "Invalid SERVER_MNEMONIC provided"**
- Check mnemonic format (25 words separated by spaces)
- Ensure it's for Algorand (not other blockchain)

**Error: Network connection issues**
- Check internet connection
- Verify AlgoNode testnet is accessible

### Frontend Issues

**Error: "Web3.Storage token not configured"**
- Create account at https://web3.storage/
- Get API token and add to `.env` as `VITE_WEB3STORAGE_TOKEN`

**Error: "Failed to record on chain"**
- Ensure backend is running on port 3001
- Check backend logs for detailed error information
- Verify server account has sufficient ALGO balance

**File upload fails**
- Check file size (max 10MB)
- Verify file type (images or PDF only)
- Check browser console for detailed errors

## 📊 System Architecture

```
[User] → [Frontend] → [Web3.Storage/IPFS] → [Backend] → [Algorand Testnet]
   ↓         ↓              ↓                ↓             ↓
 Selects   Encrypts      Stores           Records       Confirms
  File      File       Encrypted        Metadata      Transaction
```

## 🔐 Security Features

- **Client-side encryption:** Files encrypted before leaving user's device
- **Key separation:** Encryption keys never stored on servers
- **Immutable records:** Blockchain provides tamper-proof metadata storage
- **Decentralized storage:** IPFS ensures no single point of failure

## 📝 Next Steps

After successful testing:

1. **Production deployment:** Configure with mainnet Algorand
2. **Wallet integration:** Connect with user wallets instead of server account
3. **AI integration:** Add prescription analysis features
4. **Access control:** Implement patient/doctor permission system
5. **Decryption interface:** Build UI for accessing stored prescriptions

## 🆘 Support

If you encounter issues:

1. Check console logs in both frontend and backend
2. Verify all environment variables are set correctly
3. Ensure network connectivity to IPFS and Algorand
4. Check account balances and API token validity
