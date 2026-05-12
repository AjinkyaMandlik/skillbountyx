import * as StellarSdk from '@stellar/stellar-sdk';

const server = new StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org');

const ESCROW_SECRET = process.env.ESCROW_SECRET_KEY; // The platform's simulated escrow wallet
const ESCROW_PUBLIC = process.env.ESCROW_PUBLIC_KEY;

export const releasePayment = async (destinationAddress, amountStr) => {
  if (!ESCROW_SECRET) {
    console.warn("No ESCROW_SECRET_KEY found, simulating payment for dev environment");
    return "simulated_tx_hash_" + Date.now();
  }

  try {
    const sourceKeypair = StellarSdk.Keypair.fromSecret(ESCROW_SECRET);
    const sourceAccount = await server.loadAccount(sourceKeypair.publicKey());

    const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: StellarSdk.Networks.TESTNET
    })
    .addOperation(StellarSdk.Operation.payment({
      destination: destinationAddress,
      asset: StellarSdk.Asset.native(),
      amount: amountStr,
    }))
    .setTimeout(30)
    .build();

    transaction.sign(sourceKeypair);

    const response = await server.submitTransaction(transaction);
    return response.hash;
  } catch (error) {
    console.error("Error releasing Stellar payment:", error);
    throw new Error('Failed to release Stellar payment');
  }
};
