import algosdk from 'algosdk';

// Generate a new test account
const account = algosdk.generateAccount();
const mnemonic = algosdk.secretKeyToMnemonic(account.sk);

console.log('Generated Test Account:');
console.log('Address:', account.addr);
console.log('Mnemonic:', mnemonic);
console.log('\nAdd this to your .env file:');
console.log(`SERVER_MNEMONIC="${mnemonic}"`);
console.log('\n⚠️ Fund this account at: https://testnet-algorand.sandbox.coinsmith.org/');
