import { StyleSheet, Text, View } from "react-native";
import { colors, radius, shadow, spacing } from "../../constants/theme";

type PlaceholderCardProps = {
  title: string;
  body: string;
};

export function PlaceholderCard({ title, body }: PlaceholderCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 22
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    gap: spacing.xs,
    padding: spacing.md,
    ...shadow.card
  },
  title: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: "900"
  }
});
