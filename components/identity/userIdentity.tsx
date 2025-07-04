import * as Kilt from "@kiltprotocol/sdk-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Button, Text, View } from "react-native";
import { generateAccounts } from "../accountCreation/generateAccount";
import { generateDid } from "../did/generateDid";
import { claimWeb3Name } from "../web3name/claimweb3name";

export function MainAppUserDID() {
  const [didUri, setDidUri] = useState<string | null>(null);
  const [web3Name, setWeb3Name] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const setupUserIdentity = async () => {
    setIsLoading(true);
    try {
      await Kilt.connect("wss://peregrine.kilt.io/");
      console.log("✅ Connected to KILT network");

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

      console.log("✅ Faucet submitter address:", submitter);

      const result = await generateAccounts();
      if (result.resolvedDid && result.web3Name, result.walletAddress) {
        console.log("✅ Existing identity found");
        setDidUri(result.resolvedDid ?? null);
        setWeb3Name(result.web3Name ?? null);
        setWalletAddress(result.walletAddress ?? null);
        await AsyncStorage.setItem("walletAddress", result.walletAddress ?? "");
        await AsyncStorage.setItem("userDID", result.resolvedDid ?? "");
        await AsyncStorage.setItem("userWeb3Name", result.web3Name ?? "");
        return;
      }

      let { holderAccount, holderMnemonic, holderWallet } = result;
      console.log("✅ Holder account generated:", holderAccount);
      console.log("✅ Holder mnemonic:", holderMnemonic);
      console.log("✅ Holder wallet address:", holderWallet);

      if (!holderAccount) {
        throw new Error("❌ Holder account is undefined.");
      }

      const holderDidResponse = await generateDid(holderAccount, submitter);
      console.log("✅ Holder DID generated:", holderDidResponse);

      const username = `user${Math.floor(Math.random() * 10000)}`;
      await claimWeb3Name(
        username,
        holderDidResponse.didDocument,
        holderDidResponse.signers,
        submitter
      );

      if (!holderMnemonic) {
        throw new Error("❌ Holder Mnemonic is undefined.");
      }

      if (!holderWallet) {
        throw new Error("❌ Holder address is undefined.");
      }

      console.log("storing new user into the lcoal storage");
      await AsyncStorage.setItem("userMnemonic", holderMnemonic);
      await AsyncStorage.setItem(
        "signers",
        holderDidResponse.signers.toString()
      );
      await AsyncStorage.setItem("userDID", holderDidResponse.didDocument.id);
      await AsyncStorage.setItem("walletAddress", holderWallet.address);
      await AsyncStorage.setItem("userWeb3Name", username);

      setDidUri(holderDidResponse.didDocument.id);
      setWeb3Name(username);
      setWalletAddress(holderWallet.address);
    } catch (error) {
      console.error("❌ Error setting up user identity:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadStoredIdentity = async () => {
      const storedDID = await AsyncStorage.getItem("userDID");
      const storedWeb3Name = await AsyncStorage.getItem("userWeb3Name");
      const walletAddress = await AsyncStorage.getItem("walletAddress");

      if (storedDID) setDidUri(storedDID);
      if (storedWeb3Name) setWeb3Name(storedWeb3Name);
      if (walletAddress) setWalletAddress(walletAddress);
    };

    loadStoredIdentity();
  }, []);

  return (
    <View style={{ padding: 20 }}>
      { !isLoading && (
        <>
          <Text style={{ color: "black", marginBottom: 10 }}>
            DID: {didUri || "Not generated"}
          </Text>
          <Text style={{ color: "black", marginBottom: 10 }}>
            Web3Name: {web3Name || "Not registered"}
          </Text>
          <Text style={{ color: "black", marginBottom: 10 }}>
            walletAddress: {walletAddress || "Not registered"}
          </Text>
        </>
      )}
      
      {isLoading ? (
        <ActivityIndicator size="large" color="#007AFF" style={{ marginRight: 10 }} />
      ) : (
        <Button title="Setup Identity" onPress={setupUserIdentity} />
      )}
    </View>
  );
}