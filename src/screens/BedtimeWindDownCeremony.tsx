import { LinearGradient } from "expo-linear-gradient";
import { Moon, Sparkles } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { CompanionAvatar } from "../components/CompanionAvatar";
import { Companion, CompanionState, CozyPlanProgressState } from "../types";
import { getBedtimeReflection } from "../utils/wellness";

export function BedtimeWindDownCeremony({
  companion,
  companionState,
  cozyPlanProgressState,
  onComplete
}: {
  companion: Companion;
  companionState: CompanionState;
  cozyPlanProgressState: CozyPlanProgressState;
  onComplete: () => void;
}) {
  const [isSleeping, setIsSleeping] = useState(false);
  const floatValue = useRef(new Animated.Value(0)).current;
  const reflections = getBedtimeReflection({ cozyPlanProgressState, companionState });

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatValue, { toValue: 1, duration: 3600, useNativeDriver: true }),
        Animated.timing(floatValue, { toValue: 0, duration: 3600, useNativeDriver: true })
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [floatValue]);

  const starTranslate = floatValue.interpolate({ inputRange: [0, 1], outputRange: [0, -10] });

  const handlePress = () => {
    if (!isSleeping) {
      setIsSleeping(true);
      return;
    }

    onComplete();
  };

  return (
    <LinearGradient colors={["#111827", "#312E81", "#7C2D12"]} style={styles.screen}>
      <Animated.View style={[styles.star, styles.starOne, { transform: [{ translateY: starTranslate }] }]} />
      <Animated.View style={[styles.star, styles.starTwo, { transform: [{ translateY: starTranslate }] }]} />
      <Animated.View style={[styles.star, styles.starThree, { transform: [{ translateY: starTranslate }] }]} />

      <View style={[styles.card, isSleeping && styles.cardSleeping]}>
        <View style={styles.moonBadge}>
          <Moon size={18} color="#FDE68A" />
          <Text style={styles.moonText}>夜間房間</Text>
        </View>

        <Text style={styles.title}>{isSleeping ? "您的小空間會在明天等您" : "今天辛苦了"}</Text>
        <Text style={styles.copy}>
          {isSleeping ? "明天也會為您保留一個安靜時刻。" : "謝謝您今天也回來。讓我們溫柔地結束這一天。"}
        </Text>

        <CompanionAvatar
          companion={companion}
          companionState={{
            ...companionState,
            mood: "sleepy",
            idleAnimation: "sleepyFloat",
            lastReaction: "今晚一起好好休息"
          }}
          size={isSleeping ? 136 : 158}
        />

        {!isSleeping ? (
          <View style={styles.reflectionCard}>
            <Text style={styles.reflectionTitle}>今晚小小回顧</Text>
            {reflections.map((reflection) => (
              <View key={reflection} style={styles.reflectionRow}>
                <Sparkles size={14} color="#FDE68A" />
                <Text style={styles.reflectionText}>{reflection}</Text>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.sleepCard}>
            <Text style={styles.sleepText}>房間燈光慢慢暗下來。{companionState.nickname} 已經準備好陪你休息。</Text>
          </View>
        )}

        <Pressable style={styles.primaryButton} onPress={handlePress}>
          <Text style={styles.primaryButtonText}>{isSleeping ? "明天見" : "晚安"}</Text>
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
  star: {
    backgroundColor: "rgba(253,230,138,0.72)",
    borderRadius: 999,
    position: "absolute"
  },
  starOne: { height: 8, left: 44, top: 96, width: 8 },
  starTwo: { height: 11, right: 54, top: 150, width: 11 },
  starThree: { bottom: 150, height: 7, right: 110, width: 7 },
  card: {
    alignItems: "center",
    backgroundColor: "rgba(17,24,39,0.54)",
    borderColor: "rgba(253,230,138,0.22)",
    borderRadius: 32,
    borderWidth: 1,
    gap: 16,
    padding: 22,
    shadowColor: "#FDE68A",
    shadowOffset: { height: 18, width: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 28
  },
  cardSleeping: {
    backgroundColor: "rgba(17,24,39,0.68)"
  },
  moonBadge: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 999,
    flexDirection: "row",
    gap: 7,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  moonText: {
    color: "#FDE68A",
    fontSize: 12,
    fontWeight: "900"
  },
  title: {
    color: "#FFF7ED",
    fontSize: 30,
    fontWeight: "900",
    lineHeight: 36,
    textAlign: "center"
  },
  copy: {
    color: "#FED7AA",
    fontSize: 15,
    lineHeight: 23,
    textAlign: "center"
  },
  reflectionCard: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 20,
    gap: 10,
    padding: 14,
    width: "100%"
  },
  reflectionTitle: {
    color: "#FFF7ED",
    fontSize: 16,
    fontWeight: "900"
  },
  reflectionRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 9
  },
  reflectionText: {
    color: "#FDE68A",
    flex: 1,
    fontSize: 14,
    lineHeight: 21
  },
  sleepCard: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 20,
    padding: 15,
    width: "100%"
  },
  sleepText: {
    color: "#FDE68A",
    fontSize: 15,
    lineHeight: 23,
    textAlign: "center"
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: "#FFF7ED",
    borderRadius: 18,
    justifyContent: "center",
    minHeight: 56,
    width: "100%"
  },
  primaryButtonText: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "900"
  }
});
