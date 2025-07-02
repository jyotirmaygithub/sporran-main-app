import { Blockchain } from "@kiltprotocol/chain-helpers";
import * as Kilt from "@kiltprotocol/sdk-js";
import { ConfigService } from "@kiltprotocol/sdk-js";
import type { SubmittableExtrinsic } from "@polkadot/api/types";
import { Keyring } from "@polkadot/keyring";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BN from "bn.js";
import { RefObject } from "react";
import { WebView } from "react-native-webview";

export async function paymentProcessing(
  amount: BN,
  to: string,
  tip: bigint,
  webviewRef: RefObject<WebView<{}> | null>
): Promise<{ status: "success" | "error"; message: string; txHash?: string }> {
  try {
    console.log(
      `💰 Processing payment of ${amount} femtoKILT to ${to} with tip ${tip}...`
    );

    await Kilt.connect("wss://peregrine.kilt.io/");
    console.log("✅ Connected to KILT network");

    const holderMnemonic = await AsyncStorage.getItem("userMnemonic");
    console.log("🔑 Holder mnemonic retrieved:", holderMnemonic);

    if (!holderMnemonic) throw new Error("No holder mnemonic found.");
    console.log("🔑 Holder mnemonic retrieved");

    const keyring = new Keyring({ type: "sr25519", ss58Format: 38 });
    const keypair = keyring.addFromMnemonic(holderMnemonic);
    const senderAddress = keypair.address;
    console.log("🔐 Sender Address:", senderAddress);

    const api = ConfigService.get("api");
    if (!api) throw new Error("API not initialized.");
    console.log("🔌 API ready");

    const {
      data: { free: freeBalance },
    } = await api.query.system.account(senderAddress);
    console.log(`💸 Sender free balance: ${freeBalance.toHuman()}`);

    const tx = api.tx.balances.transferAllowDeath(to, amount);
    const signedTx = await tx.signAsync(keypair, { tip });
    const hash = signedTx.hash.toHex();
    const currentTx: Record<string, SubmittableExtrinsic<"promise">> = {};
    currentTx[hash] = signedTx;

    await Blockchain.submitSignedTx(currentTx[hash]);
    console.log(`✅ Transaction submitted with hash: ${hash}`);
    delete currentTx[hash];

    const response_payload = {
      status: "success",
      transaction_status: "submitted",
      transaction_id: hash,
      reference: hash,
      from: senderAddress,
      chain: "klit",
      timestamp: new Date().toISOString(),
      version: 1,
    };
    const jsCode = `
                        window.MiniKit.trigger('miniapp-payment', ${JSON.stringify(
                          response_payload
                        )});
                        true;
                    `;
    webviewRef.current?.injectJavaScript(jsCode);

    return {
      status: "success",
      message: "Transaction submitted successfully",
      txHash: hash,
    };
  } catch (error: any) {
    let errorMessage = "Unknown error occurred";

    if (typeof error === "string") {
      errorMessage = error;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    } else if (error?.toString) {
      errorMessage = error.toString();
    }
    const response_payload = {
      status: "error",
      message: `You must authenticate the app before using it.`,
    };
    const jsCode = `
        window.MiniKit.trigger('miniapp-payment', ${JSON.stringify(response_payload)});
        true;
      `;
    webviewRef.current?.injectJavaScript(jsCode);

    console.error("❌ Transaction error:", error);
    return { status: "error", message: errorMessage };
  }
}
