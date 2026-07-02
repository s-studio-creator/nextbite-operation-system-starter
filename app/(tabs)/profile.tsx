import { StyleSheet, View } from "react-native";
import { PlaceholderCard } from "../../components/common/PlaceholderCard";
import { ScreenShell } from "../../components/common/ScreenShell";
import { spacing } from "../../constants/theme";

export default function ProfileRoute() {
  return (
    <ScreenShell title="Profile" subtitle="Progress, collections, badges, and pride without number overload.">
      <View style={styles.content}>
        <PlaceholderCard title="Food collection" body="Celebrate places discovered and meals remembered." />
        <PlaceholderCard title="Achievements" body="Badges should mark exploration and healthy habits, not productivity metrics." />
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.md
  }
});
