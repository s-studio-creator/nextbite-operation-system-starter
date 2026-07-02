import { LinearGradient } from "expo-linear-gradient";
import { Sparkles } from "lucide-react-native";
import { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { CompanionAvatar } from "../components/CompanionAvatar";
import { CheckInMood, Companion, CompanionState } from "../types";
import { getMoodReaction, getMoodRitual } from "../utils/wellness";

const moodOptions: { id: CheckInMood; label: string; colors: [string, string] }[] = [
  { id: "calm", label: "平靜", colors: ["#DBEAFE", "#FCE7F3"] },
  { id: "tired", label: "疲倦", colors: ["#E5E7EB", "#FDE68A"] },
  { id: "motivated", label: "有動力", colors: ["#BBF7D0", "#FDE68A"] },
  { id: "anxious", label: "有點不安", colors: ["#DDD6FE", "#FBCFE8"] },
  { id: "cozy", label: "想舒服一點", colors: ["#FED7AA", "#FCE7F3"] },
  { id: "emotional", label: "有情緒", colors: ["#FBCFE8", "#E0E7FF"] },
  { id: "confident", label: "有信心", colors: ["#A7F3D0", "#BFDBFE"] },
  { id: "lowEnergy", label: "低能量", colors: ["#E5E7EB", "#DBEAFE"] },
  { id: "hopeful", label: "有一點期待", colors: ["#FEF3C7", "#BBF7D0"] }
];

export function DailyCheckInCeremony({
  companion,
  companionState,
  onComplete
}: {
  companion: Companion;
  companionState: CompanionState;
  onComplete: (mood: CheckInMood) => void;
}) {
  const [selectedMood, setSelectedMood] = useState<CheckInMood>("cozy");
  const [hasBegun, setHasBegun] = useState(false);
  const floatValue = useRef(new Animated.Value(0)).current;
  const selectedMoodMeta = moodOptions.find((mood) => mood.id === selectedMood) ?? moodOptions[0];
  const ritual = useMemo(() => getMoodRitual(selectedMood), [selectedMood]);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatValue, { toValue: 1, duration: 2600, useNativeDriver: true }),
        Animated.timing(floatValue, { toValue: 0, duration: 2600, useNativeDriver: true })
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [floatValue]);

  const particleTranslate = floatValue.interpolate({ inputRange: [0, 1], outputRange: [0, -16] });

  const beginCeremony = () => {
    if (!hasBegun) {
      setHasBegun(true);
      return;
    }

    onComplete(selectedMood);
  };

  return (
    <LinearGradient colors={selectedMoodMeta.colors} style={styles.screen}>
      <Animated.View style={[styles.particle, styles.particleOne, { transform: [{ translateY: particleTranslate }] }]} />
      <Animated.View style={[styles.particle, styles.particleTwo, { transform: [{ translateY: particleTranslate }] }]} />
      <Animated.View style={[styles.particle, styles.particleThree, { transform: [{ translateY: particleTranslate }] }]} />

      <View style={styles.card}>
        <Text style={styles.kicker}>每日柔和儀式</Text>
        <Text style={styles.title}>{hasBegun ? getMoodReaction(selectedMood) : "您回來了"}</Text>
        <Text style={styles.copy}>{hasBegun ? ritual : `${companionState.nickname} 為您保留了今天第一個安靜時刻。`}</Text>

        <CompanionAvatar
          companion={companion}
          companionState={{
            ...companionState,
            mood: hasBegun ? "glowing" : companionState.mood,
            idleAnimation: hasBegun ? "sparkle" : "breathing"
          }}
          size={164}
        />

        {!hasBegun && (
          <View style={styles.moodGrid}>
            {moodOptions.map((mood) => (
              <Pressable key={mood.id} style={[styles.moodChip, selectedMood === mood.id && styles.moodChipActive]} onPress={() => setSelectedMood(mood.id)}>
                <Text style={[styles.moodText, selectedMood === mood.id && styles.moodTextActive]}>{mood.label}</Text>
              </Pressable>
            ))}
          </View>
        )}

        {hasBegun && (
          <View style={styles.rewardCard}>
            <Sparkles size={19} color="#BE185D" />
            <View style={styles.rewardCopy}>
              <Text style={styles.rewardTitle}>今日小儀式已經開始</Text>
              <Text style={styles.rewardText}>+22 柔光點數 · 連續紀錄已保護 · 房間能量亮起來</Text>
            </View>
          </View>
        )}

        <Pressable style={styles.primaryButton} onPress={beginCeremony}>
          <Text style={styles.primaryButtonText}>{hasBegun ? "進入今日" : "我回來了"}</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    padding: 18
  },
  particle: {
    backgroundColor: "rgba(255,255,255,0.48)",
    borderRadius: 999,
    position: "absolute"
  },
  particleOne: { height: 18, left: 36, top: 90, width: 18 },
  particleTwo: { height: 12, right: 52, top: 160, width: 12 },
  particleThree: { bottom: 110, height: 22, right: 92, width: 22 },
  card: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.72)",
    borderColor: "rgba(255,255,255,0.8)",
    borderRadius: 32,
    borderWidth: 1,
    gap: 16,
    padding: 22,
    shadowColor: "#BE185D",
    shadowOffset: { height: 18, width: 0 },
    shadowOpacity: 0.16,
    shadowRadius: 30
  },
  kicker: {
    color: "#BE185D",
    fontSize: 13,
    fontWeight: "900"
  },
  title: {
    color: "#111827",
    fontSize: 30,
    fontWeight: "900",
    lineHeight: 36,
    textAlign: "center"
  },
  copy: {
    color: "#6B7280",
    fontSize: 15,
    lineHeight: 23,
    textAlign: "center"
  },
  moodGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center"
  },
  moodChip: {
    backgroundColor: "rgba(255,255,255,0.76)",
    borderColor: "rgba(255,255,255,0.88)",
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 9
  },
  moodChipActive: {
    backgroundColor: "#111827"
  },
  moodText: {
    color: "#374151",
    fontSize: 13,
    fontWeight: "900"
  },
  moodTextActive: {
    color: "#FFFFFF"
  },
  rewardCard: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    flexDirection: "row",
    gap: 10,
    padding: 13,
    width: "100%"
  },
  rewardCopy: {
    flex: 1
  },
  rewardTitle: {
    color: "#111827",
    fontSize: 15,
    fontWeight: "900"
  },
  rewardText: {
    color: "#6B7280",
    fontSize: 13,
    lineHeight: 19
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: "#111827",
    borderRadius: 18,
    justifyContent: "center",
    minHeight: 56,
    width: "100%"
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900"
  }
});
