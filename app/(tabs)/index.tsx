import "react-native-get-random-values";

import Authentication from "@/components/auth/authentication";
import { HelloWave } from "@/components/HelloWave";
import { MainAppUserDID } from "@/components/identity/userIdentity";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import React from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";

const AUTHENTICATED_APPS_KEY = "authenticatedApps";

export const removeAuthenticatedAllApp = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(AUTHENTICATED_APPS_KEY);
    console.log("All authenticated apps removed from storage");
  } catch (error) {
    console.error("Error removing all authenticated apps:", error);
  }
};

export default function HomeScreen() {
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
