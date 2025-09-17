import algosdk from 'algosdk';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Function to get address from mnemonic
function getAddressFromMnemonic(mnemonic) {
  try {
    const account = algosdk.mnemonicToSecretKey(mnemonic);
    const address = account.addr;
    return address;
  } catch (error) {
    console.error('Error getting address from mnemonic:', error.message);
    return null;
  }
}

// Get the current mnemonic from .env
const currentMnemonic = process.env.SERVER_MNEMONIC;

if (currentMnemonic) {
  console.log('Current mnemonic in .env:');
  console.log(currentMnemonic);

  const address = getAddressFromMnemonic(currentMnemonic);
  if (address) {
    console.log('\nGenerated Address:', address);
  }
} else {
  console.log('No SERVER_MNEMONIC found in .env');
}
