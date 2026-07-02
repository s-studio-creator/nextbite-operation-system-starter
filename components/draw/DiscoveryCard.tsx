import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radius, shadow, spacing } from "../../constants/theme";

type DiscoveryCardProps = {
  category?: string;
  revealed?: boolean;
  onPress?: () => void;
};

export function DiscoveryCard({ category = "Today's Bite", revealed = false, onPress }: DiscoveryCardProps) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={[styles.card, revealed && styles.revealed]}>
      <Text style={[styles.kicker, revealed && styles.revealedText]}>{revealed ? "REVEALED" : "NEXTBITE"}</Text>
      <View style={styles.symbolWrap}>
        <Text style={[styles.symbol, revealed && styles.revealedText]}>{revealed ? category : "?"}</Text>
      </View>
      <Text style={[styles.copy, revealed && styles.revealedText]}>
        {revealed ? "A clear direction for your next meal." : "Tap to draw a food direction."}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radius.xl,
    borderWidth: 1,
    gap: spacing.md,
    justifyContent: "space-between",
    minHeight: 340,
    padding: spacing.lg,
    width: "100%",
    ...shadow.floating
  },
  copy: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center"
  },
  kicker: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0
  },
  revealed: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  revealedText: {
    color: colors.surface
  },
  symbol: {
    color: colors.primary,
    fontSize: 48,
    fontWeight: "900",
    textAlign: "center"
  },
  symbolWrap: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center"
  }
});
