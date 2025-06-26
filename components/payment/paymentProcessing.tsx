import * as Kilt from "@kiltprotocol/sdk-js";
import { ConfigService } from "@kiltprotocol/sdk-js";
import { Keyring } from "@polkadot/keyring";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function paymentProcessing(amount: any, to: string, tip: any) {
  console.log(
    `💰 Processing payment of ${amount} KILT to ${to} with tip ${tip}...`
  );
  await Kilt.connect("wss://peregrine.kilt.io/");
  console.log("✅ Connected to KILT network");
  const holderMnemonic = await AsyncStorage.getItem("userMnemonic");
  console.log("Holder Mnemonic:", holderMnemonic);
  if (!holderMnemonic) throw new Error("No holder mnemonic found.");

  const keyring = new Keyring({ type: "sr25519", ss58Format: 38 });
  const keypair = keyring.addFromMnemonic(holderMnemonic);
  console.log("Holder Keypair:", keypair.address);
  const api = ConfigService.get("api");
  console.log("API is ready");
  if (!api) throw new Error("API not initialized.");
  console.log("API initialized successfully.");
  const tx = api.tx.balances.transferAllowDeath(to, amount);
  console.log(`💰 Sending ${amount} KILT to ${to} with tip ${tip}...`);

  const paymentInfo = await tx.paymentInfo(keypair);
  console.log(
    `💡 Estimated fee (without tip): ${paymentInfo.partialFee.toHuman()}`
  );

  const signedTx = await tx.signAsync(keypair, { tip });
  console.log(`🚀 Submitting transaction...`);
  await api.rpc.author.submitExtrinsic(signedTx);
  console.log(
    `✅ Payment of ${amount} KILT to ${to} with tip ${tip} processed successfully!`
  );
}
