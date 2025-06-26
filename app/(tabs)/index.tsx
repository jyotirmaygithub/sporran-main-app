import "react-native-get-random-values";

import { AuthGoogle } from "@/components/auth/google";
import { HelloWave } from "@/components/HelloWave";
import { MainAppUserDID } from "@/components/identity/userIdentity";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { paymentProcessing } from "@/components/payment/paymentProcessing";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import React, { useState } from "react";
import { Button, StyleSheet, View } from "react-native";

export default function HomeScreen() {
  const [did, setDid] = useState<string | null>(null);
  const [web3Name, setWeb3Name] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const amount = 1;
  const to = "4qEcPfxS3b7Yjh59xSQdWWHX7RKyNtuUjW637RuxqFR6PrUM";

  const fetchIdentity = async () => {
    try {
      const storedDid = await AsyncStorage.getItem("userDID");
      const storedWeb3Name = await AsyncStorage.getItem("userWeb3Name");
      const walletAddress = await AsyncStorage.getItem("walletAddress");
      setDid(storedDid);
      setWeb3Name(storedWeb3Name);
      setWalletAddress(walletAddress);
    } catch (err) {
      console.error("Error fetching identity:", err);
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <AuthGoogle></AuthGoogle>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>

      <MainAppUserDID />

      <View style={{ padding: 20 }}>
        <Button title="Show DID & Web3Name" onPress={fetchIdentity} />
        {did && <ThemedText style={{ marginTop: 10 }}>DID: {did}</ThemedText>}
        {web3Name && <ThemedText>Web3Name: {web3Name}</ThemedText>}
        {walletAddress && (
          <ThemedText>Wallet Address: {walletAddress}</ThemedText>
        )}
      </View>
      <View style={{ padding: 20 }}>
        <Button
          title="transact amount"
          onPress={() => paymentProcessing(amount, to, 0)}
        />
        {amount && (
          <ThemedText style={{ marginTop: 10 }}>Amount: {amount}</ThemedText>
        )}
        {to && <ThemedText>reciver wallet Address: {to}</ThemedText>}
        {walletAddress && (
          <ThemedText>sender wallet Address: {walletAddress}</ThemedText>
        )}
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
