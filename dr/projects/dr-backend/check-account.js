import algosdk from 'algosdk';

// Function to check if a mnemonic generates the target address
async function checkMnemonic(mnemonic, targetAddress) {
  try {
    const account = algosdk.mnemonicToSecretKey(mnemonic);
    const address = account.addr;

    console.log(`Generated Address: ${address}`);
    console.log(`Target Address: ${targetAddress}`);

    if (address === targetAddress) {
      console.log('✅ MATCH FOUND!');
      console.log(`Mnemonic: ${mnemonic}`);
      return true;
    } else {
      console.log('❌ No match');
      return false;
    }
  } catch (error) {
    console.error('Error checking mnemonic:', error.message);
    return false;
  }
}

// The target address you provided
const targetAddress = 'JADKFK4HB6SSIVFPZ2I4RFMGESCTA4DJ7VMGP7PUKUZITKNS3EZ3JSHNRY';

// A known testnet mnemonic
const testMnemonic = "brand globe reason enough ripple balcony act fun scout symbol rookie rescue law brother lottery foil bronze hurt congress setup fatal case thought absent nuclear";

console.log('Checking known testnet mnemonic...');
checkMnemonic(testMnemonic, targetAddress);
