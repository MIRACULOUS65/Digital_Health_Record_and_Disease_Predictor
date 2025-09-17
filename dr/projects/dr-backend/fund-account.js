import algosdk from 'algosdk';

// Function to fund an account
async function fundAccount() {
  try {
    // Use the default testnet account that has funds
    // This is a standard testnet account mnemonic - DO NOT USE IN PRODUCTION
    const faucetMnemonic = "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon art";
    const faucetAccount = algosdk.mnemonicToSecretKey(faucetMnemonic);

    console.log(`Faucet account address: ${faucetAccount.addr}`);

    // The account to fund
    const recipientAddress = "MPUGPI43QBAHNCMAMUBQ4WZQ6OBNUUGQVG46JF6ANJXHXY7GS4EUTHMZWU";

    // Configure Algod client for TestNet
    const algodClient = new algosdk.Algodv2('', 'https://testnet-api.4160.nodely.dev', '');

    // Check faucet account balance
    const faucetInfo = await algodClient.accountInformation(faucetAccount.addr).do();
    console.log(`Faucet account balance: ${faucetInfo.amount / 1000000} ALGO`);

    // Get suggested parameters
    const suggestedParams = await algodClient.getTransactionParams().do();

    // Create payment transaction
    const amount = 10000000; // 10 ALGO in microAlgos
    const txn = algosdk.makePaymentTxnWithSuggestedParams(
      faucetAccount.addr,
      recipientAddress,
      amount,
      undefined,
      new Uint8Array(0),
      suggestedParams
    );

    // Sign the transaction
    const signedTxn = txn.signTxn(faucetAccount.sk);

    // Submit the transaction
    const { txId } = await algodClient.sendRawTransaction(signedTxn).do();
    console.log(`Transaction submitted with ID: ${txId}`);

    // Wait for confirmation
    const confirmedTxn = await algosdk.waitForConfirmation(algodClient, txId, 4);
    console.log(`Transaction confirmed in round: ${confirmedTxn['confirmed-round']}`);

    console.log(`Successfully funded account ${recipientAddress} with 10 ALGO`);

    // Check recipient account balance
    const recipientInfo = await algodClient.accountInformation(recipientAddress).do();
    console.log(`Recipient account balance: ${recipientInfo.amount / 1000000} ALGO`);
  } catch (error) {
    console.error('Error funding account:', error);
  }
}

fundAccount();
