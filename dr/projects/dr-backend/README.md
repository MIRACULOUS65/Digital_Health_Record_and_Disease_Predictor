# DR Backend Server

This is the backend server for the Digital Health Records system that handles:
- IPFS file storage via Pinata
- Algorand blockchain transaction recording
- Prescription metadata management

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables in `.env`:
   - Set `SERVER_MNEMONIC` to a valid 25-word Algorand mnemonic
   - Ensure the account has sufficient ALGO for transactions

3. Start the server:
   ```bash
   npm start
   ```

## Funding the Server Account

The server account needs to be funded with ALGO to perform blockchain transactions.

1. Get the server account address from the console when starting the server:
   ```
   Server Account Address: MPUGPI43QBAHNCMAMUBQ4WZQ6OBNUUGQVG46JF6ANJXHXY7GS4EUTHMZWU
   ```

2. Visit the [Algorand TestNet Dispenser](https://dispenser.testnet.aws.algodev.network/) to fund the account:
   - Enter the server account address
   - Request 10-20 ALGO for testing

3. Alternatively, visit [AlgoExplorer TestNet](https://testnet.algoexplorer.io/) and use their faucet

## API Endpoints

- `GET /health` - Health check endpoint
- `POST /api/record-on-chain` - Record prescription metadata on blockchain
- `GET /api/transaction/:txId` - Get transaction details
- `GET /api/account/balance` - Get server account balance

## Account Information

Current server account: MPUGPI43QBAHNCMAMUBQ4WZQ6OBNUUGQVG46JF6ANJXHXY7GS4EUTHMZWU

This account needs to be funded with ALGO for blockchain transactions.
Minimum balance requirement: 0.1 ALGO
Recommended funding: 10+ ALGO for testing

## Testing

To test the upload functionality:
1. Make sure the frontend is running
2. Navigate to the patient dashboard
3. Use the prescription upload feature
4. Check the console for transaction details
