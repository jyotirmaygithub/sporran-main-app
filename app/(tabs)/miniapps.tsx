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
    url: "https://a08b-125-23-171-6.ngrok-free.app/",
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

const MiniAppIcons: React.FC = () => {
  const webviewRef = useRef<WebView>(null);
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);

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

        if (!incomingVersion) {
          console.warn("No SDK version provided in request.");
          webviewRef.current?.postMessage(
            JSON.stringify({
              status: "error",
              message: "No SDK version provided in request.",
            })
          );
          break;
        }

        console.log(
          `Local SDK Version: ${localSdkVersion}, Incoming SDK Version: ${incomingVersion}`
        );

        if (localSdkVersion === incomingVersion) {
          const did = await AsyncStorage.getItem("userDID");
          const web3Name = await AsyncStorage.getItem("userWeb3Name");

          console.log("✅ SDK versions match. Sending identity back.");
          webviewRef.current?.postMessage(
            JSON.stringify({
              status: "success",
              did: did || null,
              web3Name: web3Name || null,
            })
          );
        } else {
          console.warn("❌ SDK version mismatch");
          webviewRef.current?.postMessage(
            JSON.stringify({
              status: "error",
              message: "SDK version mismatch",
            })
          );
        }
        break;

      default:
        console.warn("Unknown command from WebView:", data.command);
        webviewRef.current?.postMessage(
          JSON.stringify({
            status: "unknown_command",
            command: data.command,
          })
        );
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

      <Modal visible={!!selectedUrl} animationType="slide">
        <View style={{ flex: 1 }}>
          <Button title="Close" onPress={() => setSelectedUrl(null)} />
          {selectedUrl && (
            <WebView
              source={{ uri: selectedUrl }}
              style={{ flex: 1 }}
              onMessage={handleMessage}
              injectedJavaScriptBeforeContentLoaded={injectedJS}
              javaScriptEnabled
            />
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
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
