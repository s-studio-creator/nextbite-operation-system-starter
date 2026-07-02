import { StyleSheet, Text, View } from "react-native";

export function MacroGrid({ protein, carbs, fat }: { protein: number; carbs: number; fat: number }) {
  return (
    <View style={styles.macroGrid}>
      <Macro label="蛋白質" value={`${protein}g`} />
      <Macro label="碳水" value={`${carbs}g`} />
      <Macro label="脂肪" value={`${fat}g`} />
    </View>
  );
}

function Macro({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.macroBox}>
      <Text style={styles.macroValue}>{value}</Text>
      <Text style={styles.macroLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  macroGrid: {
    flexDirection: "row",
    gap: 9
  },
  macroBox: {
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    flex: 1,
    padding: 12
  },
  macroValue: {
    color: "#111827",
    fontSize: 17,
    fontWeight: "900"
  },
  macroLabel: {
    color: "#6B7280",
    fontSize: 12,
    marginTop: 3
  }
});
