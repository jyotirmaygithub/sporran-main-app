import "react-native-get-random-values";

import Authentication from "@/components/auth/authentication";
import { HelloWave } from "@/components/HelloWave";
import { MainAppUserDID } from "@/components/identity/userIdentity";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { paymentProcessing } from "@/components/payment/paymentProcessing";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { BalanceUtils } from "@kiltprotocol/chain-helpers";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import React from "react";
import {
  Button,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";

const AUTHENTICATED_APPS_KEY = "authenticatedApps";

// Remove appId from authenticated list
// const removeAuthenticatedApp = async (appId: string): Promise<void> => {
//   try {
//     const data = await AsyncStorage.getItem(AUTHENTICATED_APPS_KEY);
//     const authenticatedApps = data ? JSON.parse(data) : [];

//     const updatedApps = authenticatedApps.filter((id: string) => id !== appId);
//     await AsyncStorage.setItem(
//       AUTHENTICATED_APPS_KEY,
//       JSON.stringify(updatedApps)
//     );
//     console.log(`App ${appId} removed from authenticated apps list`);
//   } catch (error) {
//     console.error("Error removing authenticated app:", error);
//   }
// };

export const removeAuthenticatedAllApp = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(AUTHENTICATED_APPS_KEY);
    console.log("All authenticated apps removed from storage");
  } catch (error) {
    console.error("Error removing all authenticated apps:", error);
  }
};

export default function HomeScreen() {
  // const [did, setDid] = useState<string | null>(null);
  // const [web3Name, setWeb3Name] = useState<string | null>(null);
  // const [appIdToRemove, setAppIdToRemove] = useState("");
  // const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const amount = BalanceUtils.toFemtoKilt(1);
  const to = "4qEcPfxS3b7Yjh59xSQdWWHX7RKyNtuUjW637RuxqFR6PrUM";

  // const fetchIdentity = async () => {
  //   try {
  //     const storedDid = await AsyncStorage.getItem("userDID");
  //     const storedWeb3Name = await AsyncStorage.getItem("userWeb3Name");
  //     const walletAddress = await AsyncStorage.getItem("walletAddress");
  //     setDid(storedDid);
  //     setWeb3Name(storedWeb3Name);
  //     setWalletAddress(walletAddress);
  //   } catch (err) {
  //     console.error("Error fetching identity:", err);
  //   }
  // };

  // const handleRemoveApp = () => {
  //   if (appIdToRemove.trim()) {
  //     removeAuthenticatedApp(appIdToRemove.trim());
  //     setAppIdToRemove("");
  //   }
  // };
  const handleAmount = () => {
    paymentProcessing(amount, to, 0n);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <ParallaxScrollView
            headerBackgroundColor={{ light: "#1D3D47", dark: "#1D3D47" }}
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
            <Authentication />
            <MainAppUserDID />
            <Button title="Transfer amount" onPress={handleAmount} />

            {/* this is functionality of remove app from authenticated app with appid */}
            {/* <View style={styles.removeAppContainer}>
              <TextInput
                style={styles.input}
                value={appIdToRemove}
                onChangeText={setAppIdToRemove}
                placeholder="Enter App ID to remove"
                placeholderTextColor="#888"
              />
              <Button title="Remove App ID" onPress={handleRemoveApp} />
            </View> */}
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
