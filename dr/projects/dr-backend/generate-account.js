import algosdk from 'algosdk';

// Function to generate an account and check if it matches the target address
function findMatchingAccount(targetAddress) {
  let attempts = 0;
  let account;

  console.log(`Looking for account: ${targetAddress}`);

  do {
    attempts++;
    account = algosdk.generateAccount();
    const address = account.addr;

    if (attempts % 1000 === 0) {
      console.log(`Attempt ${attempts}: ${address}`);
    }

    if (address === targetAddress) {
      const mnemonic = algosdk.secretKeyToMnemonic(account.sk);
      console.log('\n🎉 MATCH FOUND!');
      console.log(`Address: ${address}`);
      console.log(`Mnemonic: ${mnemonic}`);
      return { account, mnemonic };
    }
  } while (attempts < 100000); // Limit attempts to prevent infinite loop

  console.log('Account not found within attempt limit');
  return null;
}

// The target address you provided
const targetAddress = 'JADKFK4HB6SSIVFPZ2I4RFMGESCTA4DJ7VMGP7PUKUZITKNS3EZ3JSHNRY';

// Try to find the matching account
findMatchingAccount(targetAddress);
