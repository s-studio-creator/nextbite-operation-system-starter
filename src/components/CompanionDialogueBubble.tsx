import { StyleSheet, Text, View } from "react-native";
import { CompanionDialogueLine } from "../types";

export function CompanionDialogueBubble({ line }: { line?: CompanionDialogueLine }) {
  if (!line) {
    return null;
  }

  return (
    <View style={styles.bubble}>
      <Text style={styles.label}>quiet thought</Text>
      <Text style={styles.text}>“{line.text}”</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    backgroundColor: "rgba(255,255,255,0.74)",
    borderColor: "rgba(255,255,255,0.92)",
    borderRadius: 20,
    borderWidth: 1,
    gap: 5,
    padding: 13
  },
  label: {
    color: "#BE185D",
    fontSize: 11,
    fontWeight: "900"
  },
  text: {
    color: "#374151",
    fontSize: 15,
    fontWeight: "800",
    lineHeight: 22
  }
});
