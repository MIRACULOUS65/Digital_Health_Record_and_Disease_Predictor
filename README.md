# Digital Health Records (DR) System 🏥

[![Algorand](https://img.shields.io/badge/Algorand-000000?style=for-the-badge&logo=algorand&logoColor=white)](https://www.algorand.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-039BE5?style=for-the-badge&logo=Firebase&logoColor=white)](https://firebase.google.com/)
[![IPFS](https://img.shields.io/badge/IPFS-65C2CB?style=for-the-badge&logo=ipfs&logoColor=white)](https://ipfs.tech/)

A full-stack decentralized application for securely storing and managing digital health records on the Algorand blockchain.

## 🌟 Project Overview

The Digital Health Records (DR) system is a decentralized application that enables secure storage and management of medical prescriptions using blockchain technology. This project leverages the Algorand blockchain for immutable record-keeping and IPFS for decentralized file storage.

### Key Features

- 🔐 *Secure Prescription Storage*: End-to-end encryption of medical documents
- ⛓ *Blockchain Verification*: Immutable records on the Algorand blockchain
- 🌐 *Decentralized Storage*: IPFS integration for file storage
- 💳 *Wallet Integration*: Algorand wallet support for transactions
- 👤 *User Authentication*: Clerk-based authentication system
- 📱 *Responsive UI*: Mobile-friendly interface with dark/light themes

## 🏗 Architecture


┌─────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│   Frontend      │    │    Backend       │    │   Blockchain     │
│   (React)       │◄──►│   (Node.js)      │◄──►│  (Algorand)      │
│                 │    │                  │    │                  │
│ • User Interface│    │ • API Endpoints  │    │ • Smart Contracts│
│ • Wallet Connect│    │ • Metadata Store │    │ • Transaction    │
│ • File Upload   │    │ • Balance Mgmt   │    │   Verification   │
└─────────────────┘    └──────────────────┘    └──────────────────┘
         │                         │                       │
         ▼                         ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│   IPFS Storage  │    │  Algorand Test   │    │  Algorand Main   │
│                 │    │      Net         │    │      Net         │
│ • File Storage  │    │ • Development    │    │ • Production     │
│ • CID Tracking  │    │ • Testing        │    │ • Deployment     │
└─────────────────┘    └──────────────────┘    └──────────────────┘


## 📁 Project Structure


dr/
├── projects/
│   ├── dr-backend/           # Node.js backend server
│   ├── dr-contracts/         # Algorand smart contracts
│   └── dr-frontend/          # React frontend application
├── README.md                 # Project overview
└── AWESOME_PROJECT_README.md # This file


## 🔧 Technologies Used

### Frontend
[![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=flat-square&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)

- *Framework*: React with TypeScript
- *UI Library*: Tailwind CSS with daisyUI components
- *State Management*: React Hooks
- *Routing*: React Router
- *Wallet Integration*: @txnlab/use-wallet-react
- *Authentication*: Clerk
- *Storage*: IPFS via Pinata
- *Build Tool*: Vite

### Backend
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-404D59?style=flat-square)](https://expressjs.com/)

- *Runtime*: Node.js
- *Framework*: Express.js
- *Blockchain SDK*: Algorand JavaScript SDK
- *Environment*: dotenv for configuration
- *Validation*: express-validator

### Smart Contracts
[![Algorand](https://img.shields.io/badge/Algorand-000000?style=flat-square&logo=algorand&logoColor=white)](https://www.algorand.com/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white)](https://www.python.org/)

- *Language*: Algorand TypeScript (PuyaTS)
- *Framework*: AlgoKit
- *Tools*: AlgoKit CLI, AlgoKit Utils

### DevOps & Tools
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)
[![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=flat-square&logo=github-actions&logoColor=white)](https://github.com/features/actions)

## 📜 Smart Contracts

### HelloWorld Contract

The project includes a sample HelloWorld smart contract to demonstrate the Algorand development workflow.

*Location*: [projects/dr-contracts/smart_contracts/hello_world/contract.algo.ts](projects/dr-contracts/smart_contracts/hello_world/contract.algo.ts)

typescript
import { Contract } from '@algorandfoundation/algorand-typescript'

export class HelloWorld extends Contract {
  hello(name: string): string {
    return `Hello, ${name}`
  }
}


*Features*:
- Simple greeting function that takes a name and returns a greeting
- Demonstrates basic smart contract structure
- Used for testing deployment workflows

*Deployment Configuration*: [projects/dr-contracts/smart_contracts/hello_world/deploy-config.ts](projects/dr-contracts/smart_contracts/hello_world/deploy-config.ts)

### Deployment Process

1. *Build Contracts*: algokit project run build
2. *Deploy*: algokit project deploy localnet
3. *Generated Clients*: TypeScript clients are automatically generated and placed in the frontend

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [AlgoKit CLI](https://github.com/algorandfoundation/algokit-cli)
- [Docker](https://www.docker.com/) (for LocalNet)
- [Puya Compiler](https://pypi.org/project/puyapy/)

### Installation

1. *Clone the repository*:
   bash
   git clone <repository-url>
   cd dr
   

2. *Bootstrap the project*:
   bash
   algokit project bootstrap all
   

3. *Generate environment files*:
   bash
   cd projects/dr-contracts
   algokit generate env-file -a target_network localnet
   

4. *Start LocalNet*:
   bash
   algokit localnet start
   

### Running the Applications

#### Smart Contracts

1. *Build contracts*:
   bash
   cd projects/dr-contracts
   algokit project run build
   

2. *Deploy contracts*:
   bash
   algokit project deploy localnet
   

#### Backend Server

1. *Install dependencies*:
   bash
   cd projects/dr-backend
   npm install
   

2. *Configure environment*:
   Create a .env file with your Algorand account mnemonic:
   env
   SERVER_MNEMONIC="your 25-word Algorand mnemonic"
   

3. *Run the server*:
   bash
   npm run dev
   

#### Frontend Application

1. *Install dependencies*:
   bash
   cd projects/dr-frontend
   npm install
   

2. *Configure environment*:
   Create a .env file with required variables:
   env
   VITE_PINATA_JWT=your_pinata_jwt_token
   VITE_API_URL=http://localhost:3001
   VITE_ALGOD_NETWORK=testnet
   VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   

3. *Run the application*:
   bash
   npm run dev
   

## 🎨 UI Components

### Prescription Upload
- Drag and drop file upload
- File validation (PDF, JPEG, PNG, max 10MB)
- Wallet connection status
- Payment processing (0.01 ALGO fee)
- Encryption and upload progress
- Success results with verification links

### Dashboard
- User role management
- Navigation to different sections
- Account information

### Authentication
- User login/signup with Clerk
- Role selection (patient/doctor/admin)

## 🔐 Security Features

### Client-Side Encryption
- AES-GCM 256-bit encryption performed in browser
- Encryption keys never leave the user's device
- Initialization vectors generated for each file

### Wallet Integration
- Support for multiple Algorand wallets
- Secure transaction signing
- Payment processing for upload fees

## 📡 API Integration

The frontend communicates with the backend server for:
- Blockchain transaction recording
- Transaction verification
- Account balance checks

## 🧪 Development Workflow

### Code Generation
bash
# Generate application clients from smart contracts
npm run generate:app-clients


### Linting and Formatting
bash
# Lint code
npm run lint

# Format code
npm run format


## 🌐 Environment Configuration

### Networks
- *LocalNet*: For local development and testing
- *TestNet*: For staging and user testing
- *MainNet*: For production deployment

### Environment Variables
Each component requires specific environment variables for proper operation. See individual README files for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.



# Smart Contracts Documentation

## Overview

This document provides detailed information about the smart contracts implemented in the Digital Health Records (DR) system. The project uses Algorand smart contracts written in TypeScript (PuyaTS) and deployed using AlgoKit.

## Contract Directory Structure

```
projects/dr-contracts/
├── smart_contracts/
│   ├── hello_world/
│   │   ├── contract.algo.ts
│   │   └── deploy-config.ts
│   └── index.ts
```

## HelloWorld Contract

### Location
`projects/dr-contracts/smart_contracts/hello_world/contract.algo.ts`

### Code
```typescript
import { Contract } from '@algorandfoundation/algorand-typescript'

export class HelloWorld extends Contract {
  hello(name: string): string {
    return `Hello, ${name}`
  }
}
```

### Description
This is a simple example contract that demonstrates the basic structure of an Algorand smart contract. It contains a single method `hello` that takes a string parameter and returns a greeting.

### Methods
| Method | Parameters | Return Type | Description |
|--------|------------|-------------|-------------|
| hello | name: string | string | Returns a greeting with the provided name |

### Deployment Configuration
Location: `projects/dr-contracts/smart_contracts/hello_world/deploy-config.ts`

The deployment configuration handles:
1. Contract deployment to the Algorand network
2. Funding the contract account
3. Testing the deployed contract with a sample call

### Deployment Process
1. The contract is compiled to TEAL (Transaction Execution Approval Language)
2. An application is created on the Algorand blockchain
3. The application is funded with ALGOs for operation
4. A test call is made to verify functionality

## Contract Management

### Index File
Location: `projects/dr-contracts/smart_contracts/index.ts`

This file orchestrates the deployment of all contracts in the project. It:
1. Dynamically imports all contract deployment configurations
2. Executes deployment for each contract
3. Handles error reporting for failed deployments

### Adding New Contracts
To add a new contract to the project:
1. Use the AlgoKit generator: `algokit generate smart-contract`
2. This creates a new folder under `smart_contracts/` with:
   - `contract.algo.ts`: The contract implementation
   - `deploy-config.ts`: Deployment configuration
3. The index.ts file automatically discovers and deploys the new contract

## Generated Clients

When contracts are built and deployed, TypeScript clients are automatically generated and placed in:
`projects/dr-frontend/src/contracts/`

These clients provide type-safe interfaces for interacting with the deployed contracts from the frontend application.

## Development Workflow

1. **Build Contracts**: `algokit project run build`
2. **Deploy Contracts**: `algokit project deploy localnet`
3. **Generate Clients**: Automatically done during frontend build
4. **Test Contracts**: Using deployment configuration scripts

## Tools and Technologies

- **Language**: Algorand TypeScript (PuyaTS)
- **Compiler**: Puya compiler
- **Framework**: AlgoKit
- **Deployment**: AlgoKit CLI
- **Testing**: Integrated deployment testing

## Future Considerations

For a production Digital Health Records system, additional contracts might include:
1. **Access Control Contract**: Managing permissions for medical records
2. **Audit Trail Contract**: Recording all access and modifications
3. **Consent Management Contract**: Handling patient consent for data sharing
4. **Identity Verification Contract**: Verifying healthcare provider credentials
## 🙏 Acknowledgments

- [Algorand Foundation](https://algorand.foundation/) for the blockchain platform
- [AlgoKit](https://github.com/algorandfoundation/algokit-cli) for development tools
- [Pinata](https://www.pinata.cloud/) for IPFS storage
- [Clerk](https://clerk.dev/) for authentication services
