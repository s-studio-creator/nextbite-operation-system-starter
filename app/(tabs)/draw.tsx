import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { PlaceholderCard } from "../../components/common/PlaceholderCard";
import { ScreenShell } from "../../components/common/ScreenShell";
import { DiscoveryCard } from "../../components/draw/DiscoveryCard";
import { spacing } from "../../constants/theme";

export default function DrawRoute() {
  const [revealed, setRevealed] = useState(false);

  return (
    <ScreenShell title="Draw" subtitle="For the moment when you do not know what to eat.">
      <View style={styles.content}>
        <DiscoveryCard category="Ramen" revealed={revealed} onPress={() => setRevealed((value) => !value)} />
        <PlaceholderCard title="Decision, not search" body="The draw experience should reduce choice overload and create a clear next step." />
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.md
  }
});
