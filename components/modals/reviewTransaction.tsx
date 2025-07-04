import BN from "bn.js";
import React, { useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { WebView } from "react-native-webview";
import { paymentProcessing } from "../payment/paymentProcessing";
type Props = {
  visible: boolean;
  amount: BN;
  to: string;
  tip: bigint;
  webviewRef: React.RefObject<WebView | null>;
  onClose: () => void;
};

const TransactionReviewModal: React.FC<Props> = ({
  visible,
  amount,
  to,
  tip,
  webviewRef,
  onClose,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [isFailed, setIsFailed] = useState(false);

  const onCancel = () => {
    // Close the modal without taking any action
    const response_payload = {
      status: "error",
      message: `Main App declined the transaction.`,
    };
    const jsCode = `
        window.MiniKit.trigger('miniapp-payment', ${JSON.stringify(
          response_payload
        )});
        true;
      `;
    webviewRef.current?.injectJavaScript(jsCode);
    onClose();
  };

  const onApprove = async () => {
    setIsLoading(true);
    setIsFailed(false); // Reset failed state
    try {
      const result = await paymentProcessing(amount, to, tip, webviewRef);
      if (result.status === "success") {
        setIsDone(true);
      } else {
        setIsFailed(true);
        setIsDone(true); // Set done to true to show the button
      }
    } catch (error) {
      setIsFailed(true);
      setIsDone(true);
    }
  };

  const onDoneClick = () => {
    // Reset all states and close modal
    setIsLoading(false);
    setIsDone(false);
    setIsFailed(false);
    onClose();
  };
  function formatKiltValue(token_amount: BN, decimals = 5): string {
    const stringValue= token_amount.toString();
    const preciseNumber = parseFloat(stringValue) / 1e15;
    return preciseNumber.toFixed(decimals).replace(/\.?0+$/, '');
  }

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Review Transaction</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Amount:</Text>
            <Text style={styles.value}>{formatKiltValue(amount)} KILT</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>To:</Text>
            <Text style={styles.value}>{to}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Tip:</Text>
            <Text style={styles.value}>
              {(tip && tip !== 0n ? tip: '0')} KILT
            </Text>
          </View>

          <View style={styles.buttonRow}>
            {isLoading ? (
              isDone ? (
                <TouchableOpacity
                  style={[
                    styles.approveButton,
                    isFailed && styles.failedButton,
                  ]}
                  onPress={onDoneClick}
                >
                  <Text style={styles.approveText}>
                    {isFailed ? "Failed - Close" : "Done"}
                  </Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.processingText}>Processing...</Text>
              )
            ) : (
              <>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={onCancel}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.approveButton}
                  onPress={onApprove}
                >
                  <Text style={styles.approveText}>Approve</Text>
                </TouchableOpacity>
              </>
            )}
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
