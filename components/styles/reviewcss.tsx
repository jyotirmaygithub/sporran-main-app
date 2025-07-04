
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#00000088",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    width: "85%",
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  row: {
    marginVertical: 6,
  },
  label: {
    fontWeight: "600",
    fontSize: 14,
    color: "#444",
  },
  value: {
    fontSize: 14,
    color: "#000",
    marginTop: 2,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    marginRight: 10,
    alignItems: "center",
  },
  approveButton: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: "#4caf50",
    borderRadius: 10,
    marginLeft: 10,
    alignItems: "center",
  },
  failedButton: {
    backgroundColor: "#f44336",
  },
  cancelText: {
    color: "#333",
    fontWeight: "600",
  },
  approveText: {
    color: "white",
    fontWeight: "600",
  },
  processingText: {
    color: "#4caf50",
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 10,
  },
});
