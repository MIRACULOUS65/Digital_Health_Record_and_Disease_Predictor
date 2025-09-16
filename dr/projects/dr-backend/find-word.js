import algosdk from 'algosdk';

// Try to add common 25th words to complete the mnemonic
const baseMnemonic = "alert coin penalty penalty turn license awake people rent secret pond emotion battle talk flat add hurdle family link general hamster key clip doll";
const commonWords = ["abandon", "ability", "able", "about", "above", "absent", "absorb", "abstract", "absurd", "abuse"];

console.log('Trying different 25th words...');

for (const word of commonWords) {
  const testMnemonic = baseMnemonic + " " + word;
  try {
    const account = algosdk.mnemonicToSecretKey(testMnemonic);
    console.log(`✅ Valid with "${word}": ${account.addr}`);

    // Check if this matches your provided address
    if (account.addr === "EW4PKJZGAPH6C5QQWJJLN2H776MF6WH7B4V3EXUW3ASGEXUZ7FDMXU3DAU") {
      console.log(`🎉 MATCH FOUND! Complete mnemonic: "${testMnemonic}"`);
      break;
    }
  } catch (error) {
    // Continue trying
  }
}

// Let's also try if the account address itself gives us clues
console.log('\nYour provided address: EW4PKJZGAPH6C5QQWJJLN2H776MF6WH7B4V3EXUW3ASGEXUZ7FDMXU3DAU');
