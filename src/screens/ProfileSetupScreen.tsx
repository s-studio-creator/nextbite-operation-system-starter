import { LinearGradient } from "expo-linear-gradient";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { UserProfile } from "../types";
import { calculateRecommendedProfile } from "../utils/profile";

export function ProfileSetupScreen({
  profile,
  onComplete
}: {
  profile: UserProfile;
  onComplete: (updates: Partial<UserProfile>) => void;
}) {
  const [username, setUsername] = useState(profile.username ?? "");
  const [heightCm, setHeightCm] = useState(profile.heightCm ? String(profile.heightCm) : "");
  const [weightKg, setWeightKg] = useState(profile.weightKg ? String(profile.weightKg) : "");
  const [goalType, setGoalType] = useState<UserProfile["goalType"]>(profile.goalType);

  const recommendation = useMemo(
    () =>
      calculateRecommendedProfile({
        heightCm: Number(heightCm) || undefined,
        weightKg: Number(weightKg) || undefined,
        goalType
      }),
    [goalType, heightCm, weightKg]
  );

  const complete = (skipMetrics = false) => {
    onComplete({
      username: username.trim() || "新用戶",
      heightCm: skipMetrics ? undefined : Number(heightCm) || undefined,
      weightKg: skipMetrics ? undefined : Number(weightKg) || undefined,
      goalType,
      ...recommendation,
      setupCompleted: true
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <LinearGradient colors={["#FFF7ED", "#FCE7F3", "#E0E7FF"]} style={styles.hero}>
        <Text style={styles.kicker}>個人設定</Text>
        <Text style={styles.title}>建立您的健康建議</Text>
        <Text style={styles.copy}>身高與體重可以稍後再填。填寫後，我們會先提供每日卡路里、蛋白質、碳水與脂肪建議。</Text>
      </LinearGradient>

      <View style={styles.card}>
        <Text style={styles.fieldLabel}>用戶名稱</Text>
        <TextInput value={username} onChangeText={setUsername} placeholder="輸入名稱" style={styles.input} />
        <Text style={styles.fieldLabel}>身高（cm，可略過）</Text>
        <TextInput value={heightCm} onChangeText={setHeightCm} keyboardType="numeric" placeholder="例如 165" style={styles.input} />
        <Text style={styles.fieldLabel}>體重（kg，可略過）</Text>
        <TextInput value={weightKg} onChangeText={setWeightKg} keyboardType="numeric" placeholder="例如 55" style={styles.input} />
      </View>

      <View style={styles.card}>
        <Text style={styles.fieldLabel}>目標</Text>
        <View style={styles.goalRow}>
          {(["cut", "maintain", "bulk"] as const).map((goal) => (
            <Pressable key={goal} style={[styles.goalChip, goalType === goal && styles.goalChipActive]} onPress={() => setGoalType(goal)}>
              <Text style={[styles.goalText, goalType === goal && styles.goalTextActive]}>{goal === "cut" ? "減脂" : goal === "maintain" ? "維持" : "增肌"}</Text>
            </Pressable>
          ))}
        </View>
        <Text style={styles.recommendTitle}>建議攝取</Text>
        <Text style={styles.recommendText}>
          每日約 {recommendation.dailyCalories} kcal · 蛋白質 {recommendation.proteinGoal}g · 碳水 {recommendation.carbsGoal}g · 脂肪 {recommendation.fatGoal}g
        </Text>
        <Text style={styles.copy}>這只是初步建議，您可以日後在設定中調整。</Text>
      </View>

      <Pressable style={styles.primaryButton} onPress={() => complete(false)}>
        <Text style={styles.primaryButtonText}>完成設定</Text>
      </Pressable>
      <Pressable style={styles.textButton} onPress={() => complete(true)}>
        <Text style={styles.textButtonText}>暫時不填身高體重</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: "#FFF7ED", gap: 14, padding: 18, paddingBottom: 40 },
  hero: { borderRadius: 28, gap: 9, padding: 20 },
  kicker: { color: "#BE185D", fontSize: 13, fontWeight: "900" },
  title: { color: "#111827", fontSize: 30, fontWeight: "900", lineHeight: 36 },
  copy: { color: "#6B7280", fontSize: 14, lineHeight: 21 },
  card: { backgroundColor: "#FFFFFF", borderRadius: 22, gap: 10, padding: 16 },
  fieldLabel: { color: "#374151", fontSize: 14, fontWeight: "900" },
  input: { backgroundColor: "#F9FAFB", borderColor: "#E5E7EB", borderRadius: 14, borderWidth: 1, minHeight: 48, paddingHorizontal: 12 },
  goalRow: { flexDirection: "row", gap: 8 },
  goalChip: { backgroundColor: "#F3F4F6", borderRadius: 999, flex: 1, paddingVertical: 10 },
  goalChipActive: { backgroundColor: "#111827" },
  goalText: { color: "#374151", fontWeight: "900", textAlign: "center" },
  goalTextActive: { color: "#FFFFFF" },
  recommendTitle: { color: "#111827", fontSize: 17, fontWeight: "900" },
  recommendText: { color: "#0F766E", fontSize: 15, fontWeight: "900", lineHeight: 23 },
  primaryButton: { alignItems: "center", backgroundColor: "#111827", borderRadius: 18, justifyContent: "center", minHeight: 54 },
  primaryButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "900" },
  textButton: { alignItems: "center", paddingVertical: 8 },
  textButtonText: { color: "#BE185D", fontSize: 14, fontWeight: "900" }
});
