import { Popup } from "@/components/modals/popUp";
import { localSdkVersion } from "@/components/version/version";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useRef, useState } from "react";
import {
  Alert,
  Button,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { WebView, WebViewMessageEvent } from "react-native-webview";

type MiniApp = {
  id: string;
  name: string;
  icon: string;
  url: string;
};

const miniApps: MiniApp[] = [
  {
    id: "1",
    name: "Chat",
    icon: "https://img.icons8.com/color/96/chat.png",
    url: "https://miniapp-orcin-sigma.vercel.app/"
  },
  {
    id: "2",
    name: "Weather",
    icon: "https://img.icons8.com/color/96/partly-cloudy-day.png",
    url: "https://weather0004.netlify.app/",
  },
  {
    id: "3",
    name: "Music",
    icon: "https://img.icons8.com/color/96/musical-notes.png",
    url: "https://example.com/music",
  },
];

const AUTHENTICATED_APPS_KEY = "authenticatedApps";

const MiniAppIcons: React.FC = () => {
  const webviewRef = useRef<WebView>(null);
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [pendingInitData, setPendingInitData] = useState<any>(null);

  // Helper function to get authenticated apps from local storage
  const getAuthenticatedApps = async (): Promise<string[]> => {
    try {
      const authenticatedApps = await AsyncStorage.getItem(AUTHENTICATED_APPS_KEY);
      return authenticatedApps ? JSON.parse(authenticatedApps) : [];
    } catch (error) {
      console.error("Error getting authenticated apps:", error);
      return [];
    }
  };

  // Helper function to add app to authenticated apps list
  const addAuthenticatedApp = async (appId: string): Promise<void> => {
    try {
      const authenticatedApps = await getAuthenticatedApps();
      if (!authenticatedApps.includes(appId)) {
        authenticatedApps.push(appId);
        await AsyncStorage.setItem(AUTHENTICATED_APPS_KEY, JSON.stringify(authenticatedApps));
        console.log(`App ${appId} added to authenticated apps list`);
      }
    } catch (error) {
      console.error("Error adding authenticated app:", error);
    }
  };


  // Helper function to check if app is authenticated
  const isAppAuthenticated = async (appId: string): Promise<boolean> => {
    try {
      const authenticatedApps = await getAuthenticatedApps();
      return authenticatedApps.includes(appId);
    } catch (error) {
      console.error("Error checking app authentication:", error);
      return false;
    }
  };

  const sendInitResponse = async (authResult: boolean, initData: any) => {
    if (authResult) {
      const did = await AsyncStorage.getItem("userDID");
      const web3Name = await AsyncStorage.getItem("userWeb3Name");
      console.log("DID:", did);
      console.log("Web3Name:", web3Name);

      // Store the app ID in authenticated apps list
      if (initData?.payload?.appid) {
        await addAuthenticatedApp(initData.payload.appid);
      }

      const response_payload = {
        status: "success",
        did: did || null,
        web3Name: web3Name || null,
      };

      console.log("✅ SDK versions match and user authenticated. Sending identity back.");

      const jsCode = `
        window.MiniKit.trigger('init', ${JSON.stringify(response_payload)});
        true;
      `;
      webviewRef.current?.injectJavaScript(jsCode);
    } else {
      const response_payload = {
        status: "error",
        message: `You must authenticate the app before using it.`,
      };
      const jsCode = `
        window.MiniKit.trigger('init', ${JSON.stringify(response_payload)});
        true;
      `;
      webviewRef.current?.injectJavaScript(jsCode);
    }
  };

  const handleMessage = async (event: WebViewMessageEvent) => {
    const rawMessage = event.nativeEvent.data;
    console.log("Received from WebView:", rawMessage);

    let data;
    try {
      data =
        typeof rawMessage === "string" ? JSON.parse(rawMessage) : rawMessage;
    } catch (err) {
      console.error("Invalid JSON from WebView:", err);
      Alert.alert("Invalid Message", "Could not parse message from WebView");
      return;
    }

    if (!data?.command) {
      Alert.alert("Missing Command", 'WebView message missing "command" field');
      return;
    }

    switch (data.command) {
      case "pay":
        console.log("Initiating payment...");
        // Add pay logic if needed
        break;

      case "init":
        console.log("Initializing app...");
        // version is the version of the Sporran SDK.
        const incomingVersion = data.payload.version;
        const appId = data.payload.appid;

        if (!incomingVersion) {
          console.warn("No SDK version provided in request.");
          const response_payload = {
            status: "error",
            message: `No SDK version provided in request.`,
          };
          const jsCode = `
                        window.MiniKit.trigger('init', ${JSON.stringify(response_payload)});
                        true;
                    `;
          webviewRef.current?.injectJavaScript(jsCode);
          break;
        }

        if (appId === "unknown-app-id") {
          console.warn("No app ID provided in request.");
          const response_payload = {
            status: "error",
            message: `No app ID provided in request.`,
          };
          const jsCode = `
                        window.MiniKit.trigger('init', ${JSON.stringify(response_payload)});
                        true;
                    `;
          webviewRef.current?.injectJavaScript(jsCode);
          break;
        }

        console.log(
          `Local SDK Version: ${localSdkVersion}, Incoming SDK Version: ${incomingVersion}, App ID: ${appId}`
        );

        if (localSdkVersion === incomingVersion) {
          // Check if this specific app is already authenticated
          const isAuthenticated = await isAppAuthenticated(appId);

          if (isAuthenticated) {
            // App is already authenticated, send success response immediately
            console.log(`✅ App ${appId} is already authenticated`);
            await sendInitResponse(true, data);
          } else {
            // App needs to authenticate, show popup and store init data
            console.log(`🔐 App ${appId} needs authentication`);
            setPendingInitData(data);
            setShowPopup(true);
          }
        } else {
          console.warn("❌ SDK version mismatch");
          const response_payload = {
            status: "error",
            message: `SDK version mismatch. Expected ${localSdkVersion}, but got ${incomingVersion}.`,
          };
          const jsCode = `
            window.MiniKit.trigger('init', ${JSON.stringify(response_payload)});
            true;
          `;
          webviewRef.current?.injectJavaScript(jsCode);
        }
        break;

      default:
        console.warn("Unknown command from WebView:", data.command);
        alert("Unknown command received: " + data.command);
        break;
    }
  };

  const injectedJS = `
    window.SporranApp = {
      device_os: 'expo',
      version: '1.0.0',
      is_optional_analytics: true,
      supported_commands: ['camera', 'microphone'],
      safe_area_insets: { top: 10, bottom: 10, left: 0, right: 0 }
    };
    true; // required for Android to apply the JS
  `;

  const handleLoadEnd = () => {
    console.log("WebView has finished loading.");
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={miniApps}
        numColumns={3}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.container}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => setSelectedUrl(item.url)}
          >
            <Image source={{ uri: item.icon }} style={styles.icon} />
            <Text style={styles.label}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
      <Popup
        showPopup={showPopup}
        onResult={async (result) => {
          setShowPopup(false);

          // If there's pending init data, process it now with the auth result
          if (pendingInitData) {
            await sendInitResponse(result, pendingInitData);
            setPendingInitData(null);
          }
        }}
      />

      <Modal visible={!!selectedUrl} animationType="slide">
        <View style={{ flex: 1 }}>
          <Button title="Close" onPress={() => setSelectedUrl(null)} />
          {selectedUrl && (
            <WebView
              ref={webviewRef}
              source={{ uri: selectedUrl }}
              style={{ flex: 1 }}
              onMessage={handleMessage}
              injectedJavaScriptBeforeContentLoaded={injectedJS}
              javaScriptEnabled={true}
              onLoadEnd={handleLoadEnd}
            />
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 1,
    justifyContent: "center",
  },
  item: {
    alignItems: "center",
    margin: 12,
  },
  icon: {
    width: 64,
    height: 64,
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
  },
});

export default MiniAppIcons;