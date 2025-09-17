import algosdk from 'algosdk';

// Generate a new account
const account = algosdk.generateAccount();
const mnemonic = algosdk.secretKeyToMnemonic(account.sk);
const address = account.addr;

console.log('New Account Details:');
console.log('Address:', address);
console.log('Mnemonic:', mnemonic);
console.log('\nUpdate your .env file with this mnemonic:');
console.log('SERVER_MNEMONIC="' + mnemonic + '"');
