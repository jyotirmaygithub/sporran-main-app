import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  visible: boolean;
  amount: bigint;
  to: string;
  tip: bigint;
  onCancel: () => void;
  onApprove: () => void;
};

const TransactionReviewModal: React.FC<Props> = ({
  visible,
  amount,
  to,
  tip,
  onCancel,
  onApprove,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Review Transaction</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Amount:</Text>
            <Text style={styles.value}>{amount} KILT</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>To:</Text>
            <Text style={styles.value}>{to}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Tip:</Text>
            <Text style={styles.value}>{tip} KILT</Text>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.approveButton} onPress={onApprove}>
              <Text style={styles.approveText}>Approve</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default TransactionReviewModal;

const styles = StyleSheet.create({
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
  cancelText: {
    color: "#333",
    fontWeight: "600",
  },
  approveText: {
    color: "white",
    fontWeight: "600",
  },
});
