import React from "react"; //popup.tsx
import {
  Modal,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { styles } from "../styles/modalcss";

export const Popup = ({
  showPopup,
  onResult,
  message = "Authenticate the app!",
}: {
  showPopup: boolean;
  onResult: (isAuthenticated: boolean) => void;
  message?: string;
}) => (
  <Modal
    visible={showPopup}
    transparent
    animationType="fade"
    onRequestClose={() => onResult(false)}
  >
    <View style={styles.container}>
      <View style={styles.popup}>
        <Text style={styles.message}>{message}</Text>
        <TouchableOpacity
          style={[styles.button, styles.authButton]}
          onPress={() => onResult(true)}
        >
          <Text style={styles.buttonText}>Authenticate</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.closeButton]}
          onPress={() => onResult(false)}
        >
          <Text style={styles.buttonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);
