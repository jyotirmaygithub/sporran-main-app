import React from "react"; //popup.tsx
import {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  popup: {
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 15,
    alignItems: "center",
    width: width * 0.9,
  },
  message: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    width: "100%",
    marginTop: 10,
  },
  authButton: {
    backgroundColor: "#4CAF50",
  },
  closeButton: {
    backgroundColor: "#f44336",
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    textAlign: "center",
    fontWeight: "600",
  },
});
