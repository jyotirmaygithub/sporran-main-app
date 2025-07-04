import { Dimensions, StyleSheet } from "react-native";
const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
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
