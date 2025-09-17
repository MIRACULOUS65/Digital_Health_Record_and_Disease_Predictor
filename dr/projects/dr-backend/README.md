# DR Backend Server

Backend server for the Digital Health Records system that handles blockchain interactions and metadata recording.

## 🌟 Overview

The backend server provides REST API endpoints for:
- Recording prescription metadata on the Algorand blockchain
- Retrieving transaction details
- Account balance information
- Health checks

## 🚀 Setup

### Prerequisites
- Node.js (v18+)
- Algorand Testnet account with funded ALGOs

### Installation
```bash
npm install
```

### Configuration
Create a `.env` file with the following variables:
```env
PORT=3001
SERVER_MNEMONIC="your 25-word Algorand mnemonic"
```

### Running the Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## 📡 API Endpoints

### GET /health
Health check endpoint to verify server status.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-XX...",
  "serverAddress": "YOUR_ALGORAND_ADDRESS"
}
```

### POST /api/record-on-chain
Records prescription metadata on the Algorand blockchain.

**Request Body:**
```json
{
  "cid": "IPFS content identifier",
  "filename": "original filename",
  "uploaderAddress": "user's Algorand address",
  "iv": "initialization vector (base64)",
  "timestamp": "upload timestamp"
}
```

**Response:**
```json
{
  "success": true,
  "txId": "Algorand transaction ID",
  "confirmedRound": "block number",
  "explorerUrl": "AlgoExplorer URL",
  "metadata": {
    "type": "prescription_upload",
    "cid": "IPFS content identifier",
    "filename": "original filename",
    "uploaderAddress": "user's Algorand address",
    "iv": "initialization vector (base64)",
    "timestamp": "upload timestamp",
    "serverAddress": "server's Algorand address"
  }
}
```

### GET /api/transaction/:txId
Retrieves details of a specific blockchain transaction.

**Response:**
```json
{
  "txId": "transaction ID",
  "confirmedRound": "block number",
  "metadata": "parsed transaction note",
  "explorerUrl": "AlgoExplorer URL"
}
```

### GET /api/account/balance
Retrieves the server account's ALGO balance.

**Response:**
```json
{
  "address": "account address",
  "balance": "ALGO balance",
  "minBalance": "minimum required balance",
  "totalAssets": "number of assets opted in",
  "totalAppsOptedIn": "number of apps opted in"
}
```

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port (default: 3001) | No |
| `SERVER_MNEMONIC` | 25-word Algorand account mnemonic | Yes |
| `PURESTAKE_API_KEY` | PureStake API key (optional) | No |

## 🛡️ Security

- All blockchain interactions are signed with the server's private key
- Metadata is stored in transaction notes (visible on blockchain)
- Server requires a funded Algorand account for transaction fees

## 🔄 Algorand Endpoints

The server automatically tries multiple Algorand endpoints:
1. Nodely Testnet
2. AlgoNode Testnet
3. PureStake Testnet
4. AlgoExplorer Testnet

## 📈 Demo Mode

If blockchain connectivity fails, the server operates in demo mode:
- Returns mock transaction IDs
- No real blockchain transactions occur
- Useful for development and testing

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License

This project is licensed under the MIT License.
