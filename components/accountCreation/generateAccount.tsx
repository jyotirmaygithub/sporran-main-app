import * as Kilt from "@kiltprotocol/sdk-js";
import type { MultibaseKeyPair } from "@kiltprotocol/types";
import { Keyring } from "@polkadot/keyring/cjs/keyring";
import type { KeyringPair } from "@polkadot/keyring/types";

interface GeneratedAccounts {
  // issuerAccount: MultibaseKeyPair;
  holderAccount: MultibaseKeyPair;
  // issuerMnemonic: string;
  holderMnemonic: string;
  // issuerWallet: KeyringPair;
  holderWallet: KeyringPair;
}

export function generateAccounts(holdMnemonic?: string): GeneratedAccounts {
  const keyring = new Keyring({ type: 'sr25519', ss58Format: 38 }); 

  // const holderMnemonic = mnemonicGenerate();
  const holderMnemonic = "ignore response magic carbon leopard dune embrace lottery slight viable fiction oven";
  console.log("Holder Mnemonic:", holderMnemonic);
  const derivation='//did//0';
  console.log("Derivation path:", derivation);

  // const issuerAccount = Kilt.generateKeypair({ 
  //   type: "sr25519", 
  //   seed: `${issuerMnemonic}${derivation}`, 
  // });
  const holderAccount = Kilt.generateKeypair({ 
    seed: `${holderMnemonic}${derivation}`, 
    type: "sr25519", 
  });
  console.log("holder Account:", holderAccount);

  // const issuerWallet = keyring.addFromMnemonic(issuerMnemonic);
  const holderWallet = keyring.addFromMnemonic(holderMnemonic);
  console.log("holder Wallet:", holderWallet);


  // console.log("=== ISSUER ===");
  // console.log("Mnemonic:", issuerMnemonic);
  // console.log("DID publicKey:", issuerAccount.publicKeyMultibase);
  // console.log("Wallet Address:", issuerWallet.address);

  console.log("=== HOLDER ===");
  console.log("Mnemonic:", holderMnemonic);
  console.log("DID publicKey:", holderAccount.publicKeyMultibase);
  console.log("Wallet Address:", holderWallet.address);

  // console.log("Issuer:-")
  // console.log("Public Key: "+issuerAccount.publicKeyMultibase);
  // console.log("Secret Key: "+issuerAccount.secretKeyMultibase);
  
  // const issuerMultibaseKeyToDidKey = multibaseKeyToDidKey(
  //   issuerAccount.publicKeyMultibase,
  // );
  // console.log('issuer publicKey:', issuerMultibaseKeyToDidKey.publicKey);
  // console.log('issuer publicKey type:', issuerMultibaseKeyToDidKey.keyType);

  // const hexIssuer = u8aToHex(issuerMultibaseKeyToDidKey.publicKey);
  // console.log('issuer publicKey hex:', hexIssuer);
  // const issuerEncodedAddhress = encodeAddress(hexIssuer, 38);
  // console.log('issuer publicKey address:', issuerEncodedAddhress);

  return { 
    holderAccount,
    // issuerAccount,
    holderMnemonic,
    // issuerMnemonic,
    holderWallet,
    // issuerWallet,
  };
}