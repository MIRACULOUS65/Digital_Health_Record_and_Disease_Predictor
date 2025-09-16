const mnemonic = "alert coin penalty penalty turn license awake people rent secret pond emotion battle talk flat add hurdle family link general hamster key clip doll";
const words = mnemonic.split(' ');
console.log('Word count:', words.length);
console.log('Words:', words);

// Let's also verify if this generates a valid Algorand account
import algosdk from 'algosdk';

try {
  const account = algosdk.mnemonicToSecretKey(mnemonic);
  console.log('✅ Valid mnemonic!');
  console.log('Address:', account.addr);
} catch (error) {
  console.log('❌ Invalid mnemonic:', error.message);
}
