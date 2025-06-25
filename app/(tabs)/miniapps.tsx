import React, { useState } from 'react';
import { Alert, Button, FlatList, Image, Modal, PermissionsAndroid, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { launchCamera } from 'react-native-image-picker';
import { WebView, WebViewMessageEvent } from 'react-native-webview';

type MiniApp = {
  id: string;
  name: string;
  icon: string;
  url: string;
};

const miniApps: MiniApp[] = [
  { id: '1', name: 'Chat', icon: 'https://img.icons8.com/color/96/chat.png', url: 'https://f7c8-125-23-171-6.ngrok-free.app/' },
  { id: '2', name: 'Weather', icon: 'https://img.icons8.com/color/96/partly-cloudy-day.png', url: 'https://weather0004.netlify.app/' },
  { id: '3', name: 'Music', icon: 'https://img.icons8.com/color/96/musical-notes.png', url: 'https://example.com/music' },
];

const MiniAppIcons: React.FC = () => {
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);

  const requestCameraPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'This app needs access to your camera to take photos.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn('Permission error:', err);
      return false;
    }
  }
  // iOS permissions are handled automatically by the image picker
  return true;
};

  const handleMessage = async (event: WebViewMessageEvent) => {
  const rawMessage = event.nativeEvent.data;
  console.log('Received from WebView:', rawMessage);

  let data;
  try {
    data = typeof rawMessage === 'string' ? JSON.parse(rawMessage) : rawMessage;
  } catch (err) {
    console.error('Invalid JSON from WebView:', err);
    Alert.alert('Invalid Message', 'Could not parse message from WebView');
    return;
  }

  if (!data?.command) {
    Alert.alert('Missing Command', 'WebView message missing "command" field');
    return;
  }

  switch (data.command) {
    case 'camera':
      console.log('Launching camera...');
      const hasPermission = await requestCameraPermission();
      if (!hasPermission) {
        Alert.alert('Permission Denied', 'Camera permission is required to take photos.');
        return;
      }
      launchCamera(
        {
          mediaType: 'photo',
          cameraType: 'back',
          saveToPhotos: true,
          includeBase64: false,
        },
        (response) => {
          if (response.didCancel) {
            console.log('User cancelled camera');
          } else if (response.errorCode) {
            console.error('Camera Error:', response.errorMessage);
            Alert.alert('Camera Error', response.errorMessage || 'Unknown error');
          } else {
            console.log('Camera Response:', response.assets);
            Alert.alert('Photo Captured', JSON.stringify(response.assets, null, 2));
          }
        }
      );
      break;

    default:
      console.warn('Unknown command from WebView:', data.command);
      Alert.alert('WebView Message', `Unknown command: ${data.command}`);
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
          <TouchableOpacity style={styles.item} onPress={() => setSelectedUrl(item.url)}>
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
    justifyContent: 'center',
  },
  item: {
    alignItems: 'center',
    margin: 12,
  },
  icon: {
    width: 64,
    height: 64,
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default MiniAppIcons;
