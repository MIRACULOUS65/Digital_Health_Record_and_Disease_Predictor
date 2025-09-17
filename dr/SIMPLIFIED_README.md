# 🏥 Digital Health Records System

A decentralized prescription storage system that secures medical documents using blockchain and IPFS technology.

## 🌟 Key Features

- **🔐 End-to-End Encryption**: Files encrypted locally before upload
- **🌐 Decentralized Storage**: Files stored on IPFS network
- **⛓️ Blockchain Verification**: Metadata recorded on Algorand blockchain
- **💳 Wallet Integration**: Secure authentication with Algorand wallets

## 🏗️ Architecture

```
[User] → [Frontend] → [Pinata/IPFS] → [Backend] → [Algorand Testnet]
   ↓         ↓              ↓           ↓             ↓
 Selects   Encrypts      Stores      Records       Confirms
  File      File       Encrypted    Metadata      Transaction
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- Pinata account for IPFS storage
- Algorand Testnet account

### Backend Setup
```bash
cd projects/dr-backend
npm install
cp .env.example .env
# Add your Algorand mnemonic to .env
npm run dev
```

### Frontend Setup
```bash
cd projects/dr-frontend
npm install
cp .env.example .env
# Add your Pinata JWT to .env
npm run dev
```

## 📤 Upload Process

1. Connect your Algorand wallet
2. Select a medical document (PDF/image, max 10MB)
3. Pay 0.01 ALGO upload fee
4. File gets encrypted locally
5. Encrypted file uploaded to IPFS
6. Metadata recorded on blockchain
7. Download encryption key for future access

## 🔐 Security

- **Client-side encryption**: Files never leave your device unencrypted
- **Key management**: Encryption keys stored only on your device
- **Immutable records**: Blockchain ensures tamper-proof metadata
- **Decentralized storage**: No single point of failure

## 📋 Supported Formats

- PDF Documents
- JPEG Images
- PNG Images

## 🛠️ Technologies Used

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express
- **Blockchain**: Algorand Testnet
- **Storage**: IPFS via Pinata
- **Encryption**: AES-GCM 256-bit

## 📚 Documentation

- [Setup Guide](SETUP_GUIDE.md) - Complete setup instructions
- [Backend API](projects/dr-backend/README.md) - API documentation
- [Frontend](projects/dr-frontend/README.md) - Frontend details
- [Smart Contracts](projects/dr-contracts/README.md) - Contract information

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request
