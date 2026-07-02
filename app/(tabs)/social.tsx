import { StyleSheet, View } from "react-native";
import { PlaceholderCard } from "../../components/common/PlaceholderCard";
import { ScreenShell } from "../../components/common/ScreenShell";
import { spacing } from "../../constants/theme";

export default function SocialRoute() {
  return (
    <ScreenShell title="Social" subtitle="Encouragement, challenges, and small wins with friends.">
      <View style={styles.content}>
        <PlaceholderCard title="Healthy meal streak" body="Friends motivate the habit without turning NextBite into a content feed." />
        <PlaceholderCard title="Water challenge" body="Small shared actions should feel supportive and easy to complete." />
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.md
  }
});
