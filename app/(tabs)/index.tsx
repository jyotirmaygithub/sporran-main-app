import "react-native-get-random-values";

import { HelloWave } from "@/components/HelloWave";
import { MainAppUserDID } from "@/components/identity/userIdentity";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import React, { useState } from "react";
import {
  Button,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const AUTHENTICATED_APPS_KEY = "authenticatedApps";

// Remove appId from authenticated list
const removeAuthenticatedApp = async (appId: string): Promise<void> => {
  try {
    const data = await AsyncStorage.getItem(AUTHENTICATED_APPS_KEY);
    const authenticatedApps = data ? JSON.parse(data) : [];

    const updatedApps = authenticatedApps.filter((id: string) => id !== appId);
    await AsyncStorage.setItem(AUTHENTICATED_APPS_KEY, JSON.stringify(updatedApps));
    console.log(`App ${appId} removed from authenticated apps list`);
  } catch (error) {
    console.error("Error removing authenticated app:", error);
  }
};

export default function HomeScreen() {
  const [did, setDid] = useState<string | null>(null);
  const [web3Name, setWeb3Name] = useState<string | null>(null);
  const [appIdToRemove, setAppIdToRemove] = useState("");
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

  const handleRemoveApp = () => {
    if (appIdToRemove.trim()) {
      removeAuthenticatedApp(appIdToRemove.trim());
      setAppIdToRemove("");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <ParallaxScrollView
            headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
            headerImage={
              <Image
                source={require("@/assets/images/partial-react-logo.png")}
                style={styles.reactLogo}
              />
            }
          >
            <ThemedView style={styles.titleContainer}>
              <ThemedText type="title">Welcome!</ThemedText>
              <HelloWave />
            </ThemedView>

            <MainAppUserDID />

            <View style={{ padding: 20 }}>
              <Button title="Show DID & Web3Name" onPress={fetchIdentity} />
              {did && (
                <ThemedText style={{ marginTop: 10 }}>
                  DID: {did}
                </ThemedText>
              )}
              {web3Name && (
                <ThemedText>
                  Web3Name: {web3Name}
                </ThemedText>
              )}
              {walletAddress && (
          <ThemedText>Wallet Address: {walletAddress}</ThemedText>
        )}
            </View>

            <View style={styles.removeAppContainer}>
              <TextInput
                style={styles.input}
                value={appIdToRemove}
                onChangeText={setAppIdToRemove}
                placeholder="Enter App ID to remove"
                placeholderTextColor="#888"
              />
              <Button title="Remove App ID" onPress={handleRemoveApp} />
            </View>
          </ParallaxScrollView>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
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
  removeAppContainer: {
    padding: 20,
    gap: 10,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
});
