import * as AuthSession from "expo-auth-session";
import { LinearGradient } from "expo-linear-gradient";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import { Button, SafeAreaView, Text } from "react-native";
import { styles } from "../styles/logincss";
import { AUTH0_CLIENT_ID, AUTH0_DOMAIN } from "./auth";

export default function Authentication() {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const redirectUri = AuthSession.makeRedirectUri({ useProxy: true });
  const authUrl = `https://${AUTH0_DOMAIN}/authorize`;
  console.log("Redirect URI:", redirectUri);
  console.log("Auth URL:", authUrl);
  const [request, result, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: AUTH0_CLIENT_ID,
      redirectUri,
      responseType: "code",
      scopes: ["openid", "profile", "email", "offline_access"],
      usePKCE: true,
    },
    {
      authorizationEndpoint: authUrl,
      tokenEndpoint: `https://${AUTH0_DOMAIN}/oauth/token`,
    }
  );

  function handleLogout() {
    SecureStore.deleteItemAsync("access_token");
    SecureStore.deleteItemAsync("id_token");
    SecureStore.deleteItemAsync("refresh_token");
    setAccessToken(null);
  }

  useEffect(() => {
    const fetchAccessToken = async () => {
      try {
        const token = await SecureStore.getItemAsync("access_token");
        setAccessToken(token);
      } catch (error) {
        console.error("Error retrieving access token:", error);
      }
    };

    fetchAccessToken();
  }, []);

  // Exchange authorization code for tokens and fetch user info
  useEffect(() => {
    const exchangeCodeAsync = async () => {
      console.log("request ", request);
      if (result?.type === "success" && result.params.code) {
        try {
          const code = result.params.code;
          console.log("Authorization code received:", code);

          const tokenResponse = await fetch(
            `https://${AUTH0_DOMAIN}/oauth/token`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                grant_type: "authorization_code",
                client_id: AUTH0_CLIENT_ID,
                code,
                redirect_uri: redirectUri,
                code_verifier: request.codeVerifier, // PKCE code_verifier
              }),
            }
          );

          const tokenResult = await tokenResponse.json();
          console.log("Token response:", tokenResult);
          if (tokenResult.access_token) {
            setAccessToken(tokenResult.access_token);
            await SecureStore.setItemAsync(
              "access_token",
              tokenResult.access_token
            );
          }
          if (tokenResult.id_token) {
            await SecureStore.setItemAsync("id_token", tokenResult.id_token);
          }
          if (tokenResult.refresh_token) {
            await SecureStore.setItemAsync(
              "refresh_token",
              tokenResult.refresh_token
            );
          }
        } catch (error) {
          console.error("Error exchanging authorization code:", error);
        }
      }
    };
    exchangeCodeAsync();
  }, [result]);

  // UI: Login or redirect based on access token
  // if (!accessToken) {
  return (
    <>
      {!accessToken && (
        <LinearGradient colors={["#a8edea", "#fed6e3"]} style={styles.gradient}>
          <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Please log in</Text>
            <Button
              disabled={!request}
              title="Login with Auth0"
              onPress={() => promptAsync({ useProxy: true })}
            />
          </SafeAreaView>
        </LinearGradient>
      )}
      {accessToken && (
        <LinearGradient colors={["#a8edea", "#fed6e3"]} style={styles.gradient}>
          <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Click to logout</Text>
            <Button
              disabled={!request}
              title="Log out"
              onPress={() => handleLogout()}
            />
          </SafeAreaView>
        </LinearGradient>
      )}
    </>
  );
  // }
}
