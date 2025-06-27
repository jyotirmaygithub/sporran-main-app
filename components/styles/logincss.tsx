import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: { fontSize: 24, marginBottom: 20 },
  gradient: { flex: 1 },
  header: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
    color: "#333",
  },
  appItem: {
    padding: 16,
    backgroundColor: "#fff",
    marginVertical: 8,
    borderRadius: 12,
    elevation: 3,
  },
  appName: {
    fontSize: 20,
    color: "#2b5876",
    fontWeight: "600",
  },
  navBar: {
    height: 56,
    backgroundColor: "#2b5876",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  navTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
    marginLeft: 16,
  },
  webview: {
    flex: 1,
  },
});
