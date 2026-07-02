import { ScrollView, StyleSheet, Text, View, Pressable } from "react-native";
import { CompanionAvatar } from "../components/CompanionAvatar";
import { RestaurantCard } from "../components/RestaurantCard";
import { Companion, CompanionState, Restaurant, UserProfile, WellnessProgress } from "../types";
import { getEvolutionProgress } from "../utils/wellness";

export function ProfileScreen({
  profile,
  companion,
  companionState,
  wellnessProgress,
  savedRestaurants,
  savedRestaurantIds,
  onUpdateProfile,
  onSelectRestaurant,
  onToggleSavedRestaurant
}: {
  profile: UserProfile;
  companion: Companion;
  companionState: CompanionState;
  wellnessProgress: WellnessProgress;
  savedRestaurants: Restaurant[];
  savedRestaurantIds: Set<string>;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
  onSelectRestaurant: (restaurant: Restaurant) => void;
  onToggleSavedRestaurant: (restaurantId: string) => void;
}) {
  const goalLabels: Record<UserProfile["goalType"], string> = {
    cut: "減脂",
    maintain: "維持",
    bulk: "增肌"
  };
  const evolutionProgress = getEvolutionProgress(wellnessProgress.evolutionPoints);

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.kicker}>我的健康設定</Text>
        <Text style={styles.title}>您的角色與目標</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.companionProfile}>
          <CompanionAvatar companion={companion} companionState={companionState} size={92} />
          <View style={styles.companionCopy}>
            <Text style={styles.cardTitle}>{companionState.nickname}</Text>
            <Text style={styles.muted}>
              Lv.{companionState.evolutionStage} · 連續 {wellnessProgress.streakDays} 日 · {wellnessProgress.totalHealthyMeals} 餐健康選擇
            </Text>
            <Text style={styles.muted}>用戶名稱：{profile.username ?? "尚未設定"}</Text>
          </View>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressBar, { width: `${evolutionProgress * 100}%` }]} />
        </View>
        <Text style={styles.muted}>下一階段進度 {Math.round(evolutionProgress * 100)}%。角色會隨着蛋白質、均衡飲食與連續照顧逐步呈現更明顯的身形變化。</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>每日目標</Text>
        <Text style={styles.heroNumberSmall}>{profile.dailyCalories} kcal</Text>
        <Text style={styles.muted}>
          蛋白質 {profile.proteinGoal ?? 0}g · 碳水 {profile.carbsGoal ?? 0}g · 脂肪 {profile.fatGoal ?? 0}g · 目標：{goalLabels[profile.goalType]}
        </Text>
        <View style={styles.profileControls}>
          <Pressable style={styles.profileChip} onPress={() => onUpdateProfile({ dailyCalories: Math.max(1200, profile.dailyCalories - 100) })}>
            <Text style={styles.profileChipText}>-100 kcal</Text>
          </Pressable>
          <Pressable style={styles.profileChip} onPress={() => onUpdateProfile({ dailyCalories: profile.dailyCalories + 100 })}>
            <Text style={styles.profileChipText}>+100 kcal</Text>
          </Pressable>
          {(["cut", "maintain", "bulk"] as const).map((goalType) => (
            <Pressable
              key={goalType}
              style={[styles.profileChip, profile.goalType === goalType && styles.profileChipActive]}
              onPress={() => onUpdateProfile({ goalType })}
            >
              <Text style={[styles.profileChipText, profile.goalType === goalType && styles.profileChipTextActive]}>{goalLabels[goalType]}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>設定</Text>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>語言</Text>
          <Text style={styles.settingValue}>繁體中文</Text>
        </View>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>身高</Text>
          <Text style={styles.settingValue}>{profile.heightCm ? `${profile.heightCm} cm` : "可稍後填寫"}</Text>
        </View>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>體重</Text>
          <Text style={styles.settingValue}>{profile.weightKg ? `${profile.weightKg} kg` : "可稍後填寫"}</Text>
        </View>
        <Text style={styles.muted}>個人資料只保存在本機；日後可接入雲端同步、Apple 登入與帳戶安全設定。</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>收藏餐廳</Text>
        {savedRestaurants.length > 0 ? (
          savedRestaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              isSaved={savedRestaurantIds.has(restaurant.id)}
              onPress={() => onSelectRestaurant(restaurant)}
              onToggleSaved={() => onToggleSavedRestaurant(restaurant.id)}
            />
          ))
        ) : (
          <Text style={styles.muted}>尚未收藏餐廳。遇到喜歡的健康餐廳，按下心形按鈕便會保存在這裏。</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { padding: 18, paddingBottom: 110, gap: 14 },
  header: { gap: 5, paddingTop: 8 },
  kicker: { color: "#0F766E", fontSize: 14, fontWeight: "700" },
  title: { color: "#111827", fontSize: 28, fontWeight: "800", lineHeight: 34 },
  card: { backgroundColor: "#FFFFFF", borderColor: "#E5E7EB", borderRadius: 8, borderWidth: 1, gap: 12, padding: 15 },
  companionProfile: { alignItems: "center", flexDirection: "row", gap: 14 },
  companionCopy: { flex: 1 },
  progressTrack: { backgroundColor: "#FCE7F3", borderRadius: 999, height: 10, overflow: "hidden" },
  progressBar: { backgroundColor: "#BE185D", height: 10 },
  cardTitle: { color: "#111827", fontSize: 18, fontWeight: "800" },
  heroNumberSmall: { color: "#0F766E", fontSize: 36, fontWeight: "900", marginVertical: 6 },
  muted: { color: "#6B7280", flexShrink: 1, fontSize: 13, lineHeight: 19 },
  profileControls: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  profileChip: { backgroundColor: "#F3F4F6", borderRadius: 999, paddingHorizontal: 11, paddingVertical: 8 },
  profileChipActive: { backgroundColor: "#0F766E" },
  profileChipText: { color: "#374151", fontSize: 13, fontWeight: "800" },
  profileChipTextActive: { color: "#FFFFFF" },
  settingRow: {
    alignItems: "center",
    borderBottomColor: "#F3F4F6",
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8
  },
  settingLabel: { color: "#374151", fontSize: 14, fontWeight: "900" },
  settingValue: { color: "#6B7280", fontSize: 14, fontWeight: "800" }
});
