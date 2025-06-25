import * as Kilt from "@kiltprotocol/sdk-js";
import type { MultibaseKeyPair } from "@kiltprotocol/types";
import { Keyring } from "@polkadot/keyring/cjs/keyring";
import type { KeyringPair } from "@polkadot/keyring/types";
import { mnemonicGenerate } from "@polkadot/util-crypto";

interface GeneratedAccounts {
  holderAccount: MultibaseKeyPair;
  holderMnemonic: string;
  holderWallet: KeyringPair;
}

export function generateAccounts(holdMnemonic?: string): GeneratedAccounts {
  const keyring = new Keyring({ type: 'sr25519', ss58Format: 38 }); 

  const holderMnemonic = mnemonicGenerate();
  console.log("Holder Mnemonic:", holderMnemonic);
  const derivation='//did//0';
  console.log("Derivation path:", derivation);

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