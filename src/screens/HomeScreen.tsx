import { LinearGradient } from "expo-linear-gradient";
import { Camera, ChevronDown, ChevronUp, MapPin, Moon, Sparkles, Star } from "lucide-react-native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Animated, Easing } from "react-native";
import { ImageBackground, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { AmbientWorld } from "../components/AmbientWorld";
import { BodyEvolutionCard } from "../components/BodyEvolutionCard";
import { CompanionAvatar } from "../components/CompanionAvatar";
import { CompanionDialogueBubble } from "../components/CompanionDialogueBubble";
import { DailyCozyPlanCard } from "../components/DailyCozyPlanCard";
import { restaurants } from "../data";
import {
  CheckInMood,
  Companion,
  CompanionDialogueLine,
  CompanionState,
  CozyPlanProgressState,
  CozyPlanSectionId,
  DailyMissionState,
  FeedItem,
  GentleMission,
  MealLog,
  UserProfile,
  WellnessProgress,
} from "../types";
import { createBodyEvolutionSnapshot } from "../utils/bodyEvolution";
import { NutritionTotals, mealTypeLabels } from "../utils/nutrition";
import { createAmbientWorldTheme } from "../utils/ambientWorld";
import { generateDailyCozyPlan, getCompanionMood, getEvolutionProgress, getRecoveryMessage } from "../utils/wellness";

const livingWorlds = [
  { id: "home", label: "夜晚房間", detail: "柔和燈光與窗邊夜景", glow: "#FDE68A" },
  { id: "gym", label: "深夜健身室", detail: "安靜地保持身形節奏", glow: "#93C5FD" },
  { id: "cafe", label: "咖啡廳角落", detail: "暖光、輕食與慢慢休息", glow: "#FDBA74" },
  { id: "stars", label: "星光大道", detail: "城市夜景與散步記憶", glow: "#C084FC" },
] as const;

/** Small, reusable animated element — a twinkling star in the window */
function WindowStar({ index, count }: { index: number; count: number }) {
  const twinkle = useRef(new Animated.Value(0)).current;
  const offset = (index / count) * 2000;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(offset),
        Animated.timing(twinkle, { toValue: 1, duration: 800 + (index * 200) % 600, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(twinkle, { toValue: 0, duration: 800 + (index * 200) % 600, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.delay(1200 + (index * 300) % 1800),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [twinkle, offset, index]);

  const opacity = twinkle.interpolate({ inputRange: [0, 1], outputRange: [0.08, 0.7] });
  const scale = twinkle.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1.2] });

  const top = 6 + ((index * 17 + 5) % 50);
  const left = 8 + ((index * 23 + 11) % 72);
  const size = 2 + ((index * 3) % 4);

  return (
    <Animated.View
      style={{
        position: "absolute",
        top,
        left,
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: "#FDE68A",
        opacity,
        transform: [{ scale }],
      }}
    />
  );
}

export function HomeScreen({
  totals,
  profile,
  meals,
  companion,
  companionState,
  wellnessProgress,
  dailyMissionState,
  cozyPlanProgressState,
  todayMood,
  gentleMissions,
  feedItems,
  dialogueLine,
  isHydrated,
  onScan,
  onRestaurants,
  onCompleteMission,
  onCompleteCozyPlanSection,
}: {
  totals: NutritionTotals;
  profile: UserProfile;
  meals: MealLog[];
  companion: Companion;
  companionState: CompanionState;
  wellnessProgress: WellnessProgress;
  dailyMissionState: DailyMissionState;
  cozyPlanProgressState: CozyPlanProgressState;
  todayMood?: CheckInMood;
  gentleMissions: GentleMission[];
  feedItems: FeedItem[];
  dialogueLine?: CompanionDialogueLine;
  isHydrated: boolean;
  onScan: () => void;
  onRestaurants: () => void;
  onCompleteMission: (mission: GentleMission) => void;
  onCompleteCozyPlanSection: (sectionId: CozyPlanSectionId) => void;
}) {
  const dailyCalories = profile.dailyCalories;
  const evolutionProgress = getEvolutionProgress(wellnessProgress.evolutionPoints);
  const recoveryMessage = getRecoveryMessage(wellnessProgress);
  const pulseValue = useRef(new Animated.Value(0)).current;
  const [activeWorldId, setActiveWorldId] = useState<(typeof livingWorlds)[number]["id"]>("home");
  const [showBodyProgress, setShowBodyProgress] = useState(false);
  const heartAnim = useRef(new Animated.Value(0)).current;
  const activeWorld = livingWorlds.find((world) => world.id === activeWorldId) ?? livingWorlds[0];
  const recentMeal = meals[0];
  const nearbyPostcards = restaurants.slice(0, 3);
  const recentProtein = meals.slice(0, 3).reduce((sum, meal) => sum + (meal.totalProtein ?? 0), 0);
  const cozyPlan = useMemo(
    () =>
      generateDailyCozyPlan({
        mood: todayMood ?? "cozy",
        companionState,
        wellnessProgress,
        recentProtein,
      }),
    [companionState, recentProtein, todayMood, wellnessProgress],
  );
  const ambientTheme = useMemo(
    () =>
      createAmbientWorldTheme({
        mood: todayMood,
        companionState,
        wellnessProgress,
        roomItems: companionState.unlockedRoomItems,
      }),
    [companionState, todayMood, wellnessProgress],
  );
  const bodyEvolutionSnapshot = useMemo(
    () =>
      createBodyEvolutionSnapshot({
        companion,
        companionState,
        totals,
        dailyCalories,
        proteinGoal: profile.proteinGoal,
      }),
    [companion, companionState, dailyCalories, profile.proteinGoal, totals],
  );

  // Scene-level pulse for lamp, memory float, everything
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseValue, { toValue: 1, duration: 2400, useNativeDriver: true }),
        Animated.timing(pulseValue, { toValue: 0, duration: 2400, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulseValue]);

  // Slow heartbeat for the floating memory card
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(heartAnim, { toValue: 1, duration: 3000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(heartAnim, { toValue: 0, duration: 3000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [heartAnim]);

  const memoryFloatY = heartAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -7] });
  const lampGlowScale = pulseValue.interpolate({ inputRange: [0, 1], outputRange: [1, 1.08] });
  const lampGlowOpacity = pulseValue.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.7, 1, 0.7] });

  return (
    <View style={styles.container}>
      <AmbientWorld theme={ambientTheme} />
      <ScrollView contentContainerStyle={styles.screen}>
        {/* ─── The Living Scene ─── */}
        <LivingScene
          activeWorld={activeWorld}
          companion={companion}
          companionState={companionState}
          dialogueLine={dialogueLine}
          evolutionProgress={evolutionProgress}
          memoryFloatY={memoryFloatY}
          lampGlowScale={lampGlowScale}
          lampGlowOpacity={lampGlowOpacity}
          nearbyPostcards={nearbyPostcards}
          recentMeal={recentMeal}
          streakDays={wellnessProgress.streakDays}
          recoveryMessage={recoveryMessage}
          onRestaurants={onRestaurants}
          onScan={onScan}
          onWorldChange={setActiveWorldId}
        />

        {/* ─── Gentle toggle for progress details ─── */}
        <Pressable
          style={styles.progressToggle}
          onPress={() => setShowBodyProgress((prev) => !prev)}
        >
          <Star size={16} color={showBodyProgress ? "#BE185D" : "#6B7280"} />
          <Text style={[styles.progressToggleText, showBodyProgress && styles.progressToggleTextActive]}>
            {showBodyProgress ? "收起身形進度" : "查看身形進度"}
          </Text>
          {showBodyProgress ? (
            <ChevronUp size={16} color="#BE185D" />
          ) : (
            <ChevronDown size={16} color="#6B7280" />
          )}
        </Pressable>

        {showBodyProgress && (
          <BodyEvolutionCard snapshot={bodyEvolutionSnapshot} />
        )}

        {/* ─── Daily Cozy Plan ─── */}
        <DailyCozyPlanCard
          plan={cozyPlan}
          progressState={cozyPlanProgressState}
          pulseValue={pulseValue}
          onOpenRestaurants={onRestaurants}
          onCompleteSection={onCompleteCozyPlanSection}
        />
      </ScrollView>
    </View>
  );
}

function LivingScene({
  activeWorld,
  companion,
  companionState,
  dialogueLine,
  evolutionProgress,
  memoryFloatY,
  lampGlowScale,
  lampGlowOpacity,
  nearbyPostcards,
  recentMeal,
  streakDays,
  recoveryMessage,
  onRestaurants,
  onScan,
  onWorldChange,
}: {
  activeWorld: (typeof livingWorlds)[number];
  companion: Companion;
  companionState: CompanionState;
  dialogueLine?: CompanionDialogueLine;
  evolutionProgress: number;
  memoryFloatY: Animated.AnimatedInterpolation<number>;
  lampGlowScale: Animated.AnimatedInterpolation<number>;
  lampGlowOpacity: Animated.AnimatedInterpolation<number>;
  nearbyPostcards: typeof restaurants;
  recentMeal?: MealLog;
  streakDays: number;
  recoveryMessage: string | null;
  onRestaurants: () => void;
  onScan: () => void;
  onWorldChange: (worldId: (typeof livingWorlds)[number]["id"]) => void;
}) {
  const foodMemory = recentMeal
    ? `${mealTypeLabels[recentMeal.mealType]} · ${recentMeal.dishes[0]?.name ?? "今日餐點"}`
    : "今晚還未留下餐點回憶";

  return (
    <LinearGradient colors={["#111827", "#312E81", "#F9A8D4"]} style={styles.scene}>
      {/* Atmosphere glow blob */}
      <View style={styles.sceneGlow} />
      <View style={[styles.sceneGlowSecondary]} />

      {/* ─── Window with city skyline & stars ─── */}
      <View style={styles.window}>
        <View style={styles.moonWrap}>
          <Moon size={22} color="#FDE68A" />
        </View>
        {/* Twinkling stars in the window */}
        {Array.from({ length: 8 }, (_, i) => (
          <WindowStar key={i} index={i} count={8} />
        ))}
        <View style={styles.cityLine}>
          <View style={[styles.building, { height: 44 }]} />
          <View style={[styles.building, { height: 28 }]} />
          <View style={[styles.building, { height: 54 }]} />
          <View style={[styles.building, { height: 34 }]} />
          <View style={[styles.building, { height: 38 }]} />
        </View>
      </View>

      {/* ─── Header: scene identity ─── */}
      <View style={styles.sceneHeader}>
        <View>
          <Text style={styles.sceneKicker}>您的城市夜晚房間</Text>
          <Text style={styles.sceneTitle}>{activeWorld.label}</Text>
          <Text style={styles.sceneCopy}>{activeWorld.detail}</Text>
        </View>
        <View style={styles.streakPill}>
          <Sparkles size={14} color="#FDE68A" />
          <Text style={styles.streakText}>{streakDays} 日</Text>
        </View>
      </View>

      {/* ─── Body: companion, memory float, lamp ─── */}
      <View style={styles.sceneBody}>
        {/* Floating food memory card */}
        <Animated.View style={[styles.memoryFloat, { transform: [{ translateY: memoryFloatY }] }]}>
          <Text style={styles.floatLabel}>今日 food memory</Text>
          <Text style={styles.floatText}>{foodMemory}</Text>
        </Animated.View>

        {/* Companion in the corner */}
        <View style={styles.companionCorner}>
          <CompanionAvatar companion={companion} companionState={companionState} size={148} />
          <Text style={styles.companionName}>{companionState.nickname}</Text>
        </View>

        {/* Pulsing lamp */}
        <View style={styles.lamp}>
          <Animated.View
            style={[
              styles.lampGlowOrb,
              {
                transform: [{ scale: lampGlowScale }],
                opacity: lampGlowOpacity,
              },
            ]}
          />
          <View style={styles.lampShade} />
          <View style={styles.lampStem} />
          <View style={styles.lampBase} />
        </View>
      </View>

      {/* ─── Companion dialogue ─── */}
      <CompanionDialogueBubble
        line={
          dialogueLine ?? {
            id: "home-scene",
            moment: "dailyOpen",
            text: getCompanionMood(companionState),
            createdAt: Date.now(),
          }
        }
      />

      {/* ─── Recovery message (subtle, integrated) ─── */}
      {recoveryMessage && (
        <View style={styles.recoveryBanner}>
          <Sparkles size={13} color="#FDE68A" />
          <Text style={styles.recoveryBannerText}>{recoveryMessage}</Text>
        </View>
      )}

      {/* ─── Evolution progress bar ─── */}
      <View style={styles.progressHint}>
        <Text style={styles.progressHintText}>進化 {Math.round(evolutionProgress * 100)}%</Text>
        <View style={styles.sceneTrack}>
          <View style={[styles.sceneProgress, { width: `${Math.max(8, evolutionProgress * 100)}%` }]} />
        </View>
      </View>

      {/* ─── Restaurant postcards / action row ─── */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.postcardRow}>
        {nearbyPostcards.map((restaurant) => (
          <Pressable key={restaurant.id} style={styles.postcard} onPress={onRestaurants}>
            <ImageBackground source={{ uri: restaurant.image }} imageStyle={styles.postcardImage} style={styles.postcardImageWrap}>
              <LinearGradient colors={["rgba(17,24,39,0.02)", "rgba(17,24,39,0.66)"]} style={styles.postcardOverlay}>
                <Text style={styles.postcardDistrict}>{restaurant.district}</Text>
                <Text style={styles.postcardTitle}>{restaurant.name}</Text>
              </LinearGradient>
            </ImageBackground>
          </Pressable>
        ))}
        <Pressable style={styles.addMemoryCard} onPress={onScan}>
          <Camera size={18} color="#BE185D" />
          <Text style={styles.addMemoryText}>加入今晚餐點</Text>
        </Pressable>
        <Pressable style={styles.addMemoryCard} onPress={onRestaurants}>
          <MapPin size={18} color="#BE185D" />
          <Text style={styles.addMemoryText}>附近推薦</Text>
        </Pressable>
      </ScrollView>

      {/* ─── World switching chips ─── */}
      <View style={styles.worldChips}>
        {livingWorlds.map((world) => {
          const isActive = activeWorld.id === world.id;
          return (
            <Pressable
              key={world.id}
              style={[styles.worldChip, isActive && { backgroundColor: world.glow + "22", borderColor: world.glow + "66" }]}
              onPress={() => onWorldChange(world.id)}
            >
              <View style={[styles.worldChipDot, { backgroundColor: isActive ? world.glow : "transparent", borderColor: world.glow }]} />
              <Text style={[styles.worldChipText, isActive && { color: "#FFFFFF" }]}>{world.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  screen: { padding: 14, paddingBottom: 110, gap: 14 },

  // ─── Scene / World ───
  scene: {
    borderRadius: 34,
    gap: 16,
    minHeight: 720,
    overflow: "hidden",
    padding: 18,
    shadowColor: "#111827",
    shadowOffset: { height: 18, width: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 30,
  },
  sceneGlow: {
    backgroundColor: "rgba(253,230,138,0.26)",
    borderRadius: 999,
    height: 180,
    position: "absolute",
    right: -48,
    top: 150,
    width: 180,
  },
  sceneGlowSecondary: {
    backgroundColor: "rgba(251,191,36,0.08)",
    borderRadius: 999,
    height: 320,
    left: -100,
    position: "absolute",
    top: 200,
    width: 320,
  },

  // ─── Window ───
  window: {
    backgroundColor: "rgba(15,23,42,0.42)",
    borderColor: "rgba(255,255,255,0.18)",
    borderRadius: 28,
    borderWidth: 1,
    height: 178,
    left: 18,
    overflow: "hidden",
    position: "absolute",
    right: 18,
    top: 96,
  },
  moonWrap: {
    alignItems: "center",
    backgroundColor: "rgba(253,230,138,0.16)",
    borderRadius: 999,
    height: 54,
    justifyContent: "center",
    position: "absolute",
    right: 24,
    top: 22,
    width: 54,
  },
  cityLine: {
    alignItems: "flex-end",
    bottom: 0,
    flexDirection: "row",
    gap: 8,
    left: 20,
    position: "absolute",
  },
  building: {
    backgroundColor: "rgba(255,255,255,0.17)",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    width: 34,
  },

  // ─── Header ───
  sceneHeader: { flexDirection: "row", justifyContent: "space-between", gap: 12, zIndex: 2 },
  sceneKicker: { color: "#FDE68A", fontSize: 12, fontWeight: "900" },
  sceneTitle: { color: "#FFFFFF", fontSize: 31, fontWeight: "900", lineHeight: 38, marginTop: 4 },
  sceneCopy: { color: "rgba(255,255,255,0.72)", fontSize: 14, fontWeight: "700", lineHeight: 21, marginTop: 4 },
  streakPill: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.14)",
    borderColor: "rgba(255,255,255,0.18)",
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: "row",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  streakText: { color: "#FFFFFF", fontSize: 12, fontWeight: "900" },

  // ─── Body: companion + memory float + lamp ───
  sceneBody: { height: 292, marginTop: 128 },
  memoryFloat: {
    backgroundColor: "rgba(255,255,255,0.82)",
    borderRadius: 20,
    left: 0,
    maxWidth: 190,
    padding: 13,
    position: "absolute",
    top: 18,
    zIndex: 2,
    shadowColor: "#000",
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  floatLabel: { color: "#BE185D", fontSize: 11, fontWeight: "900" },
  floatText: { color: "#111827", fontSize: 14, fontWeight: "900", lineHeight: 20, marginTop: 4 },
  companionCorner: { alignItems: "center", bottom: 18, position: "absolute", right: 8, zIndex: 2 },
  companionName: { color: "#FFFFFF", fontSize: 13, fontWeight: "900", marginTop: 8 },

  // ─── Lamp ───
  lamp: { alignItems: "center", bottom: 14, left: 20, position: "absolute" },
  lampGlowOrb: {
    backgroundColor: "rgba(253,230,138,0.32)",
    borderRadius: 999,
    height: 58,
    marginBottom: -8,
    width: 78,
  },
  lampShade: {
    backgroundColor: "#FDE68A",
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    height: 34,
    opacity: 0.9,
    width: 62,
  },
  lampStem: { backgroundColor: "rgba(255,255,255,0.72)", height: 42, width: 6 },
  lampBase: { backgroundColor: "rgba(255,255,255,0.72)", borderRadius: 999, height: 10, width: 54 },

  // ─── Recovery banner ───
  recoveryBanner: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 14,
    borderColor: "rgba(253,230,138,0.24)",
    borderWidth: 1,
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  recoveryBannerText: {
    color: "#FDE68A",
    flex: 1,
    fontSize: 13,
    fontWeight: "800",
    lineHeight: 19,
  },

  // ─── Progress ───
  progressHint: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderColor: "rgba(255,255,255,0.16)",
    borderRadius: 18,
    borderWidth: 1,
    gap: 8,
    padding: 12,
  },
  progressHintText: { color: "#FFFFFF", fontSize: 12, fontWeight: "900" },
  sceneTrack: { backgroundColor: "rgba(255,255,255,0.22)", borderRadius: 999, height: 7, overflow: "hidden" },
  sceneProgress: { backgroundColor: "#FDE68A", height: 7 },

  // ─── Progress toggle ───
  progressToggle: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 999,
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  progressToggleText: { color: "#6B7280", fontSize: 13, fontWeight: "900" },
  progressToggleTextActive: { color: "#BE185D" },

  // ─── Postcards ───
  postcardRow: { gap: 10, paddingRight: 4 },
  postcard: { borderRadius: 18, height: 120, overflow: "hidden", width: 128 },
  postcardImageWrap: { flex: 1, justifyContent: "flex-end" },
  postcardImage: { borderRadius: 18 },
  postcardOverlay: { flex: 1, justifyContent: "flex-end", padding: 11 },
  postcardDistrict: { color: "rgba(255,255,255,0.76)", fontSize: 11, fontWeight: "900" },
  postcardTitle: { color: "#FFFFFF", fontSize: 13, fontWeight: "900", lineHeight: 17, marginTop: 2 },
  addMemoryCard: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.82)",
    borderRadius: 18,
    gap: 8,
    height: 120,
    justifyContent: "center",
    padding: 12,
    width: 112,
  },
  addMemoryText: { color: "#BE185D", fontSize: 12, fontWeight: "900", lineHeight: 17, textAlign: "center" },

  // ─── World chips ───
  worldChips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  worldChip: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderColor: "rgba(255,255,255,0.18)",
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 13,
    paddingVertical: 8,
  },
  worldChipDot: {
    borderRadius: 999,
    borderWidth: 2,
    height: 10,
    width: 10,
  },
  worldChipText: { color: "rgba(255,255,255,0.66)", fontSize: 13, fontWeight: "900" },
});
