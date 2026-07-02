import { PropsWithChildren } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, spacing } from "../../constants/theme";

type ScreenShellProps = PropsWithChildren<{
  title: string;
  subtitle: string;
}>;

export function ScreenShell({ title, subtitle, children }: ScreenShellProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      <View style={styles.content}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: spacing.md
  },
  header: {
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    paddingTop: spacing.sm
  },
  safeArea: {
    backgroundColor: colors.background,
    flex: 1
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 21
  },
  title: {
    color: colors.textPrimary,
    fontSize: 32,
    fontWeight: "900"
  }
});
