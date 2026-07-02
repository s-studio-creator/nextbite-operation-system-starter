import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { Companion, CompanionState } from "../types";

export function CompanionAvatar({
  companion,
  companionState,
  size = 128
}: {
  companion: Companion;
  companionState?: CompanionState;
  size?: number;
}) {
  const stage = companionState?.evolutionStage ?? companion.evolutionStage;
  const scale = 1 + Math.min(stage - 1, 3) * 0.08;
  const animationValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(animationValue, {
          toValue: 1,
          duration: companionState?.idleAnimation === "sparkle" ? 1100 : 1800,
          useNativeDriver: true
        }),
        Animated.timing(animationValue, {
          toValue: 0,
          duration: companionState?.idleAnimation === "sparkle" ? 1100 : 1800,
          useNativeDriver: true
        })
      ])
    );

    loop.start();

    return () => loop.stop();
  }, [animationValue, companionState?.idleAnimation]);

  const animatedScale = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [scale, scale + (companionState?.idleAnimation === "sparkle" ? 0.08 : 0.035)]
  });
  const animatedTranslate = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, companionState?.idleAnimation === "sleepyFloat" ? -8 : -3]
  });

  return (
    <LinearGradient colors={companion.palette} style={[styles.avatarWrap, { height: size, width: size, borderRadius: size / 2 }]}>
      <Animated.View style={[styles.innerGlow, { transform: [{ scale: animatedScale }, { translateY: animatedTranslate }] }]}>
        <Text style={[styles.symbol, { fontSize: size * 0.36 }]}>{companion.symbol}</Text>
        <Text style={styles.stage}>Lv.{stage}</Text>
        {companionState?.mood === "glowing" && <View style={styles.sparkleDot} />}
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  avatarWrap: {
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#BE185D",
    shadowOffset: { height: 10, width: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 22
  },
  innerGlow: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.56)",
    borderRadius: 999,
    height: "72%",
    justifyContent: "center",
    width: "72%"
  },
  symbol: {
    color: "#111827",
    fontWeight: "900"
  },
  stage: {
    color: "#6B7280",
    fontSize: 11,
    fontWeight: "900",
    marginTop: -3
  },
  sparkleDot: {
    backgroundColor: "#FFFFFF",
    borderRadius: 999,
    height: 8,
    position: "absolute",
    right: 18,
    top: 16,
    width: 8
  }
});
