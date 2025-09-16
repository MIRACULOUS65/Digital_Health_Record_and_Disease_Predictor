# Web3 Prescription Storage System

This directory contains the backend server for the AI-powered decentralized healthcare platform's Web3 prescription storage system.

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
```bash
# Copy the environment template
cp .env.example .env

# Edit .env and add your configuration:
# - SERVER_MNEMONIC: 25-word Algorand testnet account mnemonic
# - PORT: Server port (default: 3001)
```

### 3. Get Algorand Testnet Account
1. Create a new account at [https://testnet.algoexplorer.io/](https://testnet.algoexplorer.io/)
2. Fund it with testnet Algos from [https://testnet-algorand.sandbox.coinsmith.org/](https://testnet-algorand.sandbox.coinsmith.org/)
3. Add the 25-word mnemonic to your `.env` file

### 4. Start the Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### Health Check
- **GET** `/health`
- Returns server status and account information

### Record Prescription on Blockchain
- **POST** `/api/record-on-chain`
- Body: `{ cid, filename, uploaderAddress, iv, timestamp }`
- Records prescription metadata on Algorand blockchain
- Returns transaction ID and confirmation details

### Get Transaction Details
- **GET** `/api/transaction/:txId`
- Returns transaction information and decoded metadata

### Get Account Balance
- **GET** `/api/account/balance`
- Returns server account balance and information

## How It Works

1. **Frontend uploads encrypted file** to IPFS and gets CID
2. **Backend receives metadata** including CID, filename, IV, timestamp
3. **Creates 0-ALGO transaction** to itself with metadata in note field
4. **Submits to Algorand testnet** and waits for confirmation
5. **Returns transaction ID** for verification

## Security Features

- Client-side encryption before upload
- Metadata-only storage on blockchain
- Encrypted files on IPFS
- Transaction verification on public blockchain

## Environment Variables

- `SERVER_MNEMONIC`: 25-word mnemonic for Algorand account
- `PORT`: Server port (default: 3001)
- `ALGORAND_SERVER`: Custom Algorand node (optional)
- `ALGORAND_PORT`: Custom port (optional)
- `ALGORAND_TOKEN`: Custom token (optional)

## Technology Stack

- **Express.js**: Web server framework
- **algosdk**: Algorand JavaScript SDK
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment variable management
