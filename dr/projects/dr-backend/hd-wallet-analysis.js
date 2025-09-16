import algosdk from 'algosdk';
import { Buffer } from 'buffer';

// Your HD wallet mnemonic (24 words)
const hdMnemonic = "alert coin penalty penalty turn license awake people rent secret pond emotion battle talk flat add hurdle family link general hamster key clip doll";

console.log('HD Wallet Mnemonic Analysis:');
console.log('Word count:', hdMnemonic.split(' ').length);

// Try to derive Algorand account from HD wallet
// This might not work directly since HD wallets use different derivation paths

// Let's try a different approach - convert your existing account
const targetAddress = "EW4PKJZGAPH6C5QQWJJLN2H776MF6WH7B4V3EXUW3ASGEXUZ7FDMXU3DAU";

// Generate a new 25-word Algorand mnemonic for the backend
const newAccount = algosdk.generateAccount();
const newMnemonic = algosdk.secretKeyToMnemonic(newAccount.sk);

console.log('\nFor backend server (new account):');
console.log('Address:', newAccount.addr);
console.log('Mnemonic:', newMnemonic);

console.log('\nYour HD wallet account:');
console.log('Address:', targetAddress);
console.log('Mnemonic (24 words):', hdMnemonic);

console.log('\nRecommendation:');
console.log('1. Use the new 25-word mnemonic for the backend server');
console.log('2. Fund the new backend account for blockchain transactions');
console.log('3. Keep your HD wallet for user transactions when we add wallet integration');
