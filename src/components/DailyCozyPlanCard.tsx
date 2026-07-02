import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { Check, Sparkles } from "lucide-react-native";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { CozyPlanProgressState, CozyPlanSectionId, DailyCozyPlan } from "../types";

export function DailyCozyPlanCard({
  plan,
  progressState,
  pulseValue,
  onOpenRestaurants,
  onCompleteSection
}: {
  plan: DailyCozyPlan;
  progressState: CozyPlanProgressState;
  pulseValue: Animated.Value;
  onOpenRestaurants: () => void;
  onCompleteSection: (sectionId: CozyPlanSectionId) => void;
}) {
  const glowScale = pulseValue.interpolate({ inputRange: [0, 1], outputRange: [1, 1.035] });
  const completedCount = progressState.completedSections.length;

  return (
    <Animated.View style={{ transform: [{ scale: glowScale }] }}>
      <LinearGradient colors={["rgba(255,255,255,0.92)", "rgba(252,231,243,0.86)", "rgba(239,246,255,0.88)"]} style={styles.card}>
        <View style={styles.particleOne} />
        <View style={styles.particleTwo} />
        <View style={styles.header}>
          <View>
            <Text style={styles.kicker}>今日陪伴計劃</Text>
            <Text style={styles.title}>每日柔和計劃</Text>
            <Text style={styles.waitingText}>
              {completedCount === 3 ? "今日房間已經暖起來了" : "您的角色把這一步留待稍後完成"}
            </Text>
          </View>
          <View style={styles.badge}>
            <Sparkles size={15} color="#BE185D" />
            <Text style={styles.badgeText}>{plan.accentLabel}</Text>
          </View>
        </View>

        <PlanSection
          id="tinyRitual"
          label="微小儀式"
          text={plan.tinyRitual}
          completed={progressState.completedSections.includes("tinyRitual")}
          onComplete={onCompleteSection}
        />
        <PlanSection
          id="foodSuggestion"
          label="滋養飲食建議"
          text={plan.foodSuggestion}
          completed={progressState.completedSections.includes("foodSuggestion")}
          onComplete={onCompleteSection}
        />
        <PlanSection
          id="rewardTarget"
          label="角色獎勵目標"
          text={plan.rewardTarget}
          completed={progressState.completedSections.includes("rewardTarget")}
          onComplete={onCompleteSection}
        />

        {progressState.lastCompletionMessage && (
          <View style={styles.reactionCard}>
            <Sparkles size={16} color="#BE185D" />
            <Text style={styles.reactionText}>{progressState.lastCompletionMessage}</Text>
          </View>
        )}

        <Pressable style={styles.softButton} onPress={onOpenRestaurants}>
          <Text style={styles.softButtonText}>尋找舒服的健康選擇</Text>
        </Pressable>
      </LinearGradient>
    </Animated.View>
  );
}

function PlanSection({
  id,
  label,
  text,
  completed,
  onComplete
}: {
  id: CozyPlanSectionId;
  label: string;
  text: string;
  completed: boolean;
  onComplete: (sectionId: CozyPlanSectionId) => void;
}) {
  const completeSection = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onComplete(id);
  };

  return (
    <Pressable style={[styles.section, completed && styles.sectionComplete]} onPress={completeSection} disabled={completed}>
      <View style={styles.sectionTop}>
        <Text style={styles.sectionLabel}>{label}</Text>
        <View style={[styles.completeButton, completed && styles.completeButtonDone]}>
          {completed ? <Check size={14} color="#FFFFFF" /> : <Text style={styles.completeButtonText}>輕輕完成</Text>}
        </View>
      </View>
      <Text style={styles.sectionText}>{text}</Text>
      <Text style={styles.sectionHint}>{completed ? "謝謝您今天也照顧自己" : "這一步可以稍後慢慢完成"}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderColor: "rgba(255,255,255,0.9)",
    borderRadius: 26,
    borderWidth: 1,
    gap: 13,
    overflow: "hidden",
    padding: 17,
    shadowColor: "#F9A8D4",
    shadowOffset: { height: 10, width: 0 },
    shadowOpacity: 0.14,
    shadowRadius: 24
  },
  particleOne: {
    backgroundColor: "rgba(255,255,255,0.45)",
    borderRadius: 999,
    height: 44,
    position: "absolute",
    right: 18,
    top: 50,
    width: 44
  },
  particleTwo: {
    backgroundColor: "rgba(255,255,255,0.4)",
    borderRadius: 999,
    bottom: 28,
    height: 26,
    left: 24,
    position: "absolute",
    width: 26
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12
  },
  kicker: {
    color: "#BE185D",
    fontSize: 12,
    fontWeight: "900"
  },
  title: {
    color: "#111827",
    fontSize: 21,
    fontWeight: "900"
  },
  waitingText: {
    color: "#6B7280",
    fontSize: 12,
    fontWeight: "800",
    marginTop: 3
  },
  badge: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.76)",
    borderRadius: 999,
    flexDirection: "row",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 7
  },
  badgeText: {
    color: "#BE185D",
    fontSize: 11,
    fontWeight: "900"
  },
  section: {
    backgroundColor: "rgba(255,255,255,0.64)",
    borderRadius: 18,
    gap: 4,
    padding: 13
  },
  sectionComplete: {
    backgroundColor: "rgba(236,253,245,0.82)",
    shadowColor: "#A7F3D0",
    shadowOffset: { height: 8, width: 0 },
    shadowOpacity: 0.24,
    shadowRadius: 18
  },
  sectionTop: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8
  },
  sectionLabel: {
    color: "#92400E",
    fontSize: 12,
    fontWeight: "900"
  },
  sectionText: {
    color: "#374151",
    fontSize: 15,
    lineHeight: 22
  },
  sectionHint: {
    color: "#BE185D",
    fontSize: 12,
    fontWeight: "800",
    marginTop: 3
  },
  completeButton: {
    alignItems: "center",
    backgroundColor: "#FCE7F3",
    borderRadius: 999,
    minWidth: 54,
    paddingHorizontal: 9,
    paddingVertical: 6
  },
  completeButtonDone: {
    backgroundColor: "#0F766E",
    minWidth: 30
  },
  completeButtonText: {
    color: "#BE185D",
    fontSize: 11,
    fontWeight: "900"
  },
  reactionCard: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.76)",
    borderRadius: 16,
    flexDirection: "row",
    gap: 8,
    padding: 11
  },
  reactionText: {
    color: "#374151",
    flex: 1,
    fontSize: 13,
    fontWeight: "800",
    lineHeight: 19
  },
  softButton: {
    alignItems: "center",
    backgroundColor: "#111827",
    borderRadius: 16,
    justifyContent: "center",
    minHeight: 48
  },
  softButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900"
  }
});
