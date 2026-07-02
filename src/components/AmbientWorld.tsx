import { LinearGradient } from "expo-linear-gradient";
import { useMemo, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { AmbientWorldTheme } from "../utils/ambientWorld";

function useDriftAnimation(duration: number, offsetMs = 0) {
  const value = useRef(new Animated.Value(0)).current;
  const started = useRef(false);

  useMemo(() => {
    if (started.current) return;
    started.current = true;

    const delay = Animated.delay(offsetMs);
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(value, { toValue: 1, duration, useNativeDriver: true }),
        Animated.timing(value, { toValue: 0, duration, useNativeDriver: true }),
      ]),
    );
    const sequence = Animated.sequence([delay, loop]);
    sequence.start();
  }, [value, duration, offsetMs]);

  return value;
}

/** A single star particle that twinkles independently */
function StarParticle({
  leftPct,
  topPct,
  size,
  baseOpacity,
  twinkleDuration,
  delay,
  color,
}: {
  leftPct: number;
  topPct: number;
  size: number;
  baseOpacity: number;
  twinkleDuration: number;
  delay: number;
  color: string;
}) {
  const twinkle = useDriftAnimation(twinkleDuration, delay);
  const opacity = twinkle.interpolate({
    inputRange: [0, 0.2, 0.5, 0.8, 1],
    outputRange: [baseOpacity * 0.15, baseOpacity, baseOpacity * 0.1, baseOpacity, baseOpacity * 0.15],
  });
  const scale = twinkle.interpolate({
    inputRange: [0, 0.3, 0.7, 1],
    outputRange: [0.5, 1.2, 0.6, 0.5],
  });

  return (
    <Animated.View
      style={{
        position: "absolute",
        left: `${leftPct}%`,
        top: `${topPct}%`,
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        opacity,
        transform: [{ scale }],
      }}
    />
  );
}

/** Drifting dust/ember particle */
function DriftParticle({
  leftPct,
  topPct,
  size,
  opacity,
  color,
  animDuration,
  delay,
  driftX,
}: {
  leftPct: number;
  topPct: number;
  size: number;
  opacity: number;
  color: string;
  animDuration: number;
  delay: number;
  driftX: number;
}) {
  const anim = useDriftAnimation(animDuration, delay);
  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [0, -size * 2.5] });
  const translateX = anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, driftX, 0] });

  return (
    <Animated.View
      style={{
        position: "absolute",
        left: `${leftPct}%`,
        top: `${topPct}%`,
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        opacity,
        transform: [{ translateY }, { translateX }],
      }}
    />
  );
}

export function AmbientWorld({ theme }: { theme: AmbientWorldTheme }) {
  const glowAnim = useDriftAnimation(theme.animationDuration);

  const glowScale = glowAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.08] });
  const glowOpacity = glowAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.6, 1, 0.6] });

  // Generate star field — seeded deterministically from theme.phase + particleCount
  const stars = useMemo(
    () =>
      Array.from({ length: 14 + theme.particleCount * 3 }, (_, i) => ({
        id: `star-${theme.phase}-${i}`,
        left: ((i * 37 + 13) % 94) + 3,
        top: ((i * 29 + 7) % 88) + 2,
        size: 2 + ((i * 3) % 5),
        opacity: 0.25 + ((i * 7) % 5) * 0.1,
        duration: 1800 + ((i * 400) % 3000),
        delay: (i * 470) % 4200,
        color: i % 3 === 0 ? "#FDE68A" : i % 3 === 1 ? "#FEF9C3" : "#FFFFFF",
      })),
    [theme.phase, theme.particleCount],
  );

  // Generate drifting motes — these are the "warmth" particles that float
  const motes = useMemo(
    () =>
      Array.from({ length: 6 + theme.particleCount * 2 }, (_, i) => ({
        id: `mote-${theme.phase}-${i}`,
        left: 10 + ((i * 29 + 11) % 78),
        top: 18 + ((i * 17) % 62),
        size: 4 + ((i * 5) % 10),
        opacity: 0.12 + i * 0.04,
        duration: 4000 + ((i * 600) % 3600),
        delay: (i * 380) % 3800,
        driftX: -6 + ((i * 7) % 12),
        color: i % 2 === 0 ? theme.particleColor : theme.glowColor,
      })),
    [theme.particleColor, theme.glowColor, theme.particleCount, theme.phase],
  );

  // Warm ember layer (only when warmth is high)
  const embers = useMemo(
    () =>
      theme.warmth > 0.3
        ? Array.from({ length: 4 + Math.floor(theme.warmth * 6) }, (_, i) => ({
            id: `ember-${theme.phase}-${i}`,
            left: 20 + ((i * 43 + 5) % 56),
            top: 60 + ((i * 19) % 28),
            size: 6 + ((i * 4) % 8),
            opacity: 0.14 + i * 0.03,
            duration: 3200 + ((i * 500) % 2800),
            delay: (i * 540) % 3200,
            driftX: -4 + ((i * 5) % 8),
            color: "rgba(253, 186, 116, 0.5)",
          }))
        : [],
    [theme.warmth, theme.phase],
  );

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {/* Base gradient */}
      <LinearGradient colors={theme.gradient} style={StyleSheet.absoluteFill} />

      {/* Warm glow orb */}
      <Animated.View
        style={[
          styles.glow,
          {
            backgroundColor: theme.glowColor,
            opacity: glowOpacity,
            transform: [{ scale: glowScale }],
          },
        ]}
      />

      {/* Star field */}
      {stars.map((star) => (
        <StarParticle
          key={star.id}
          leftPct={star.left}
          topPct={star.top}
          size={star.size}
          baseOpacity={star.opacity}
          twinkleDuration={star.duration}
          delay={star.delay}
          color={star.color}
        />
      ))}

      {/* Drifting dust motes */}
      {motes.map((mote) => (
        <DriftParticle
          key={mote.id}
          leftPct={mote.left}
          topPct={mote.top}
          size={mote.size}
          opacity={mote.opacity}
          color={mote.color}
          animDuration={mote.duration}
          delay={mote.delay}
          driftX={mote.driftX}
        />
      ))}

      {/* Warm embers */}
      {embers.map((ember) => (
        <DriftParticle
          key={ember.id}
          leftPct={ember.left}
          topPct={ember.top}
          size={ember.size}
          opacity={ember.opacity}
          color={ember.color}
          animDuration={ember.duration}
          delay={ember.delay}
          driftX={ember.driftX}
        />
      ))}

      {/* Dim overlay for late night */}
      {theme.dimOverlay > 0 && <View style={[styles.dim, { opacity: theme.dimOverlay }]} />}
    </View>
  );
}

const styles = StyleSheet.create({
  glow: {
    borderRadius: 999,
    height: 260,
    position: "absolute",
    right: -70,
    top: 100,
    width: 260,
  },
  dim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#020617",
  },
});
