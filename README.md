# 🏥 Digital Health Records System (Web3 Prescription Storage)

A decentralized, secure prescription storage system that encrypts medical documents and stores them on IPFS with metadata recorded on the Algorand blockchain.

## 🌟 Overview

This project implements a Web3-based prescription storage system that provides:
- **End-to-end encryption** of medical documents using AES-GCM 256-bit encryption
- **Decentralized storage** on IPFS via Pinata
- **Immutable records** on the Algorand blockchain
- **Secure key management** with client-side encryption keys

## 🏗️ System Architecture

```
[User] → [Frontend] → [Pinata/IPFS] → [Backend] → [Algorand Testnet]
   ↓         ↓              ↓           ↓             ↓
 Selects   Encrypts      Stores      Records       Confirms
  File      File       Encrypted    Metadata      Transaction
```

### Core Components

1. **Frontend (React/TypeScript)**
   - User interface for uploading prescriptions
   - Client-side AES-GCM encryption
   - Wallet integration (Algorand wallets)
   - IPFS upload via Pinata
   - Blockchain transaction verification

2. **Backend (Node.js/Express)**
   - REST API for blockchain interactions
   - Algorand transaction processing
   - Health checks and account management
   - Fallback mechanisms for network issues

3. **Smart Contracts (Algorand TypeScript)**
   - Generated with AlgoKit
   - Deployable to localnet/testnet/mainnet

## 🔐 Security Features

- **Client-side encryption**: Files encrypted before leaving user's device
- **Key separation**: Encryption keys never stored on servers
- **Immutable records**: Blockchain provides tamper-proof metadata storage
- **Decentralized storage**: IPFS ensures no single point of failure
- **Wallet integration**: Secure user authentication via Algorand wallets

## 🚀 Quick Start

### Prerequisites

1. **Node.js** (v18+)
2. **Pinata Account** (for IPFS uploads) - [Get free account](https://pinata.cloud)
3. **Algorand Testnet Account** (for blockchain transactions)

### Setup Instructions

#### 1. Backend Setup

```bash
cd projects/dr-backend
npm install
cp .env.example .env
# Configure environment variables in `.env`
npm run dev
```

#### 2. Frontend Setup

```bash
cd projects/dr-frontend
npm install
cp .env.example .env
# Configure environment variables in `.env`
npm run dev
```

### Environment Configuration

#### Backend (.env)
```env
PORT=3001
# Get a testnet account and mnemonic from https://testnet.algoexplorer.io/
# Fund it with testnet ALGOs from https://testnet-algo-faucet.vercel.app/
SERVER_MNEMONIC="your 25 word mnemonic phrase here"
```

#### Frontend (.env)
```env
# Get token from https://pinata.cloud/ (create free account)
VITE_PINATA_JWT=your_pinata_jwt_token_here
VITE_API_URL=http://localhost:3001
VITE_ALGOD_NETWORK=testnet
VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

## 🧪 Testing the System

### 1. Backend Health Check

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

### 2. Complete Upload Flow

1. Open frontend: http://localhost:5173
2. Connect your Algorand wallet
3. Navigate to Prescription Upload page
4. Upload a medical document (PDF/image)
5. Pay 0.01 ALGO fee
6. Watch the encryption and upload process

### 3. Verification

1. **Verify IPFS upload**: Click "View on IPFS" link (shows encrypted file)
2. **Verify blockchain transaction**: Click "View Transaction" link (opens AlgoExplorer)
3. **Decrypt file**: Use the downloaded encryption key with browser console utilities

## 📊 Upload Process

1. **File Selection**: User selects a medical document (PDF/image)
2. **Wallet Connection**: User connects Algorand wallet (MetaMask/Lute)
3. **Payment**: User pays 0.01 ALGO upload fee
4. **Encryption**: Document encrypted locally with AES-GCM
5. **IPFS Upload**: Encrypted file uploaded to IPFS via Pinata
6. **Blockchain Recording**: Metadata recorded on Algorand blockchain
7. **Key Download**: Encryption key provided for secure access

## 🛠️ Technical Details

### Encryption Process

- **Algorithm**: AES-GCM 256-bit encryption
- **Key Generation**: Cryptographically secure random key
- **IV**: 96-bit initialization vector
- **Processing**: Entirely client-side, never leaves user's device unencrypted

### Blockchain Integration

- **Network**: Algorand Testnet
- **Transaction Type**: Payment transaction with metadata note
- **Metadata**: Includes IPFS CID, filename, uploader address, IV, timestamp
- **Verification**: Transactions viewable on AlgoExplorer

### Storage Architecture

- **Primary**: IPFS via Pinata for encrypted file storage
- **Metadata**: Algorand blockchain for immutable record keeping
- **Keys**: Client-side storage only (user responsibility)

## 📋 Supported Document Types

- PDF Documents
- JPEG Images
- PNG Images
- Maximum file size: 10MB

## 🔧 Troubleshooting

### Backend Issues

**Error: "SERVER_MNEMONIC environment variable is required"**
- Ensure you've created `.env` file in `dr-backend/`
- Add valid 25-word Algorand testnet mnemonic

**Error: "Invalid SERVER_MNEMONIC provided"**
- Check mnemonic format (25 words separated by spaces)
- Ensure it's for Algorand (not other blockchain)

### Frontend Issues

**Error: "Pinata JWT not configured"**
- Create account at https://pinata.cloud/
- Get API token and add to `.env` as `VITE_PINATA_JWT`

**Error: "Failed to record on chain"**
- Ensure backend is running on port 3001
- Check backend logs for detailed error information
- Verify server account has sufficient ALGO balance

## 🚀 Production Deployment

### Backend Deployment

1. Set up production environment variables
2. Deploy to cloud provider (AWS, GCP, Azure)
3. Configure domain and SSL certificates
4. Set up monitoring and logging

### Frontend Deployment

1. Update environment variables for production
2. Build production bundle: `npm run build`
3. Deploy to CDN or static hosting (Vercel, Netlify, etc.)
4. Configure custom domain

## 📈 Future Enhancements

1. **Wallet Integration**: Full user wallet integration instead of server account
2. **Access Control**: Patient/doctor permission system
3. **Decryption Interface**: UI for accessing stored prescriptions
4. **AI Integration**: Prescription analysis features
5. **Mobile App**: Native mobile applications
6. **Multi-chain Support**: Integration with other blockchain networks

## 📚 Documentation

- [Setup Guide](SETUP_GUIDE.md) - Detailed setup instructions
- [Backend API](projects/dr-backend/README.md) - Backend API documentation
- [Frontend Components](projects/dr-frontend/README.md) - Frontend architecture
- [Smart Contracts](projects/dr-contracts/README.md) - Smart contract documentation

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter issues:

1. Check console logs in both frontend and backend
2. Verify all environment variables are set correctly
3. Ensure network connectivity to IPFS and Algorand
4. Check account balances and API token validity
