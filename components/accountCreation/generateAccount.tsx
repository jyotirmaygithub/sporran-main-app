import * as Kilt from "@kiltprotocol/sdk-js";
import type { MultibaseKeyPair } from "@kiltprotocol/types";
import * as kiltUtils from "@kiltprotocol/utils";
import { Keyring } from "@polkadot/keyring/cjs/keyring";
import type { KeyringPair } from "@polkadot/keyring/types";

interface GeneratedAccounts {
  holderAccount?: MultibaseKeyPair;
  holderMnemonic?: string;
  holderWallet?: KeyringPair;
  resolvedDid?: string;
  web3Name?: string;
}

export async function generateAccounts(
  holdMnemonic?: string
): Promise<GeneratedAccounts> {
  const keyring = new Keyring({ type: "sr25519", ss58Format: 38 });
  let resolvedDid: string | null = null;
  let web3Name: string | null = null;
  const api = Kilt.ConfigService.get("api");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const did_1 = require("@kiltprotocol/did");

  // const holderMnemonic = mnemonicGenerate();
  const holderMnemonic = "robot resource sugar labor link affair among divide group crawl connect crop";
  console.log("Holder Mnemonic:", holderMnemonic);

  const authKeypair = kiltUtils.Crypto.makeKeypairFromUri(
    `${holderMnemonic}//did//0`,
    "sr25519"
  );
  const didUri = `did:kilt:${authKeypair.address}`;
  console.log("🔍 Checking DID URI:", didUri);

  const derivation = "//did//0";
  console.log("Derivation path:", derivation);

  try {
    const { didDocument } = await did_1.resolver.resolve(didUri);
    if (didDocument) {
      console.log("Did:- ", didDocument);
      resolvedDid = didDocument.id;
    }
  } catch (err) {
    console.warn("⚠ DID resolution error (likely not found):", err);
  }

  try {
    if (resolvedDid) {
      const key = resolvedDid.replace("did:kilt:", "");
      const w3n = await api.query.web3Names.names(key);
      web3Name = w3n.toHuman() as string | null;
    }
  } catch (err) {
    console.log("W3N check failed:", err);
  }

  // === If both DID + Web3Name exist → no need to regenerate ===
  if (resolvedDid && web3Name) {
    console.log("🚀 Identity exists. Returning DID + Web3Name only");
    return {
      resolvedDid,
      web3Name,
    };
  }

  const holderAccount = Kilt.generateKeypair({
    seed: `${holderMnemonic}${derivation}`,
    type: "sr25519",
  });
  console.log("holder Account:", holderAccount);

  const holderWallet = keyring.addFromMnemonic(holderMnemonic);
  console.log("holder Wallet:", holderWallet);

  return {
    holderAccount,
    holderMnemonic,
    holderWallet,
  };
}
