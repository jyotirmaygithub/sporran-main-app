import * as Kilt from "@kiltprotocol/sdk-js";
import type {
  DidDocument,
  KiltAddress,
  MultibaseKeyPair,
  SignerInterface,
} from "@kiltprotocol/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { Button, Text, View } from "react-native";
import { generateAccounts } from "../accountCreation/generateAccount";

export function MainAppUserDID() {
  const [didUri, setDidUri] = useState<string | null>(null);
  const [web3Name, setWeb3Name] = useState<string | null>(null);

  const setupUserIdentity = async () => {
    console.log("🔄 Setting up user identity...");
    try {
      await Kilt.connect("wss://peregrine.kilt.io/");
      const faucet = {
        publicKey: new Uint8Array([
          238, 93, 102, 137, 215, 142, 38, 187, 91, 53, 176, 68, 23, 64, 160,
          101, 199, 189, 142, 253, 209, 193, 84, 34, 7, 92, 63, 43, 32, 33, 181,
          210,
        ]),
        secretKey: new Uint8Array([
          205, 253, 96, 36, 210, 176, 235, 162, 125, 84, 204, 146, 164, 76, 217,
          166, 39, 198, 155, 45, 189, 161, 94, 215, 229, 128, 133, 66, 81, 25,
          174, 3,
        ]),
      };

      const [submitter] = await Kilt.getSignersForKeypair({
        keypair: faucet,
        type: "Ed25519",
      });

      console.log("✅ Connected to KILT network");
      console.log("✅ Faucet submitter address:", submitter);

      let { holderAccount, holderMnemonic, holderWallet } = generateAccounts();
      console.log("✅ Holder account generated:", holderAccount);
      console.log("✅ Holder mnemonic:", holderMnemonic);
      console.log("✅ Holder wallet address:", holderWallet);
      // const storedDID = await AsyncStorage.getItem("userDID");
      // const storedWeb3Name = await AsyncStorage.getItem("userWeb3Name");
      console.log("Generating Holder Did");
      const holderDidResponse = await generateDid(holderAccount, submitter);
      console.log("✅ Holder DID generated:", holderDidResponse);
      // const holderDid = holderDidResponse.didDocument.id;

      const username = `user${Math.floor(Math.random() * 10000)}`;
      await claimWeb3Name(
        username,
        holderDidResponse.didDocument,
        holderDidResponse.signers,
        submitter
      );

      // const mnemonic = mnemonicGenerate(12);
      // console.log("✅ Generated mnemonic:", mnemonic);

      // const keypair = Kilt.generateKeypair({ seed: mnemonic });

      // console.log("✅ Submitter address:", submitter);

      // if (storedDID) {
      //   console.log("⚠ DID already exists:", storedDID);
      //   setDidUri(storedDID);
      // }

      // if (storedWeb3Name) {
      //   console.log("⚠ Web3Name already exists:", storedWeb3Name);
      //   setWeb3Name(storedWeb3Name);
      // }

      // If both exist, skip further setup
      // if (storedDID && storedWeb3Name) {
      //   console.log("✅ Identity already set up.");
      //   return;
      // }

      // const holderKeypair = Kilt.generateKeypair({
      //   seed: mnemonic,
      //   type: "ed25519",
      // });

      // console.log("✅ Holder keypair generated:", holderKeypair);

      // const { didDocument, signers } = await generateDid(
      //   holderKeypair,
      //   submitter
      // );
      // console.log("✅ DID created:", didDocument);
      // console.log("✅ Signers:", signers);

      // const generatedWeb3Name = `user${Math.floor(Math.random() * 10000)}`;
      // console.log("🔄 Claiming Web3Name:", generatedWeb3Name);
      // await claimWeb3Name(generatedWeb3Name, didDocument, signers, submitter);

      // console.log("✅ Web3Name registered:", generatedWeb3Name);

      await AsyncStorage.setItem("userMnemonic", holderMnemonic);
      await AsyncStorage.setItem("signers", holderDidResponse.signers.toString());
      await AsyncStorage.setItem("userDID", holderDidResponse.didDocument.id);
      await AsyncStorage.setItem("userWeb3Name", username);

      setDidUri(holderDidResponse.didDocument.id);
      setWeb3Name(username);
    } catch (error) {
      console.error("❌ Error setting up user identity:", error);
    }
  };

  useEffect(() => {
    const loadStoredIdentity = async () => {
      const storedDID = await AsyncStorage.getItem("userDID");
      const storedWeb3Name = await AsyncStorage.getItem("userWeb3Name");

      if (storedDID) setDidUri(storedDID);
      if (storedWeb3Name) setWeb3Name(storedWeb3Name);
    };

    loadStoredIdentity();
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ marginBottom: 10 }}>DID: {didUri || "Not generated"}</Text>
      <Text style={{ marginBottom: 10 }}>
        Web3Name: {web3Name || "Not registered"}
      </Text>
      <Button title="Setup Identity" onPress={setupUserIdentity} />
    </View>
  );
}

async function generateDid(
  keypair: MultibaseKeyPair,
  submitter: SignerInterface<"Ed25519", KiltAddress>
): Promise<{ didDocument: DidDocument; signers: SignerInterface[] }> {
  const api = Kilt.ConfigService.get("api");
  console.log("generating the did being inside the function")

  const txHandler = Kilt.DidHelpers.createDid({
    api,
    signers: [keypair],
    submitter,
    fromPublicKey: keypair.publicKeyMultibase,
  });
  console.log("txHandler created:", txHandler);

  const txResult = await txHandler.submit();
  console.log("Transaction result:", txResult);

  if (txResult.status !== "confirmed") {
    throw new Error(`❌ DID creation failed: ${txResult.status}`);
  }

  console.log(`✅ DID created: ${txResult.asConfirmed.didDocument.id}`);
  return {
    didDocument: txResult.asConfirmed.didDocument,
    signers: txResult.asConfirmed.signers,
  };
}

async function claimWeb3Name(
  name: string,
  didDocument: DidDocument,
  signers: SignerInterface[],
  submitter: SignerInterface<"Ed25519", KiltAddress>
): Promise<void> {
  const api = Kilt.ConfigService.get("api");

  const claimTx = api.tx.web3Names.claim(name);

  const txResult = await Kilt.DidHelpers.transact({
    api,
    call: claimTx,
    didDocument,
    signers: [...signers, submitter],
    submitter,
  }).submit();

  if (!txResult.asConfirmed) {
    throw new Error(`❌ Web3Name claim failed: ${txResult.status}`);
  }

  console.log(
    "✅ Web3Name claim confirmed:",
    txResult.asConfirmed.didDocument.alsoKnownAs
  );
}

async function deleteDid(
  didDocument: DidDocument,
  signers: SignerInterface[],
  submitter: SignerInterface<"Ed25519", KiltAddress>
): Promise<void> {
  const api = Kilt.ConfigService.get("api");

  const transactionHandler = Kilt.DidHelpers.deactivateDid({
    api,
    signers,
    submitter,
    didDocument,
  });

  const result = await transactionHandler.submit();
  if (result.status === "failed") {
    console.error("Error deleting DID:", result.asFailed);
    return;
  } else if (result.status === "confirmed") {
    console.log("Did deleted successfully");
    return;
  }
}
