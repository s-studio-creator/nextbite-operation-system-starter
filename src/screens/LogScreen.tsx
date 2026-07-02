import { ScrollView, StyleSheet, Text, View } from "react-native";
import { MacroGrid } from "../components/MacroGrid";
import { MealRow } from "../components/MealRow";
import { MealLog } from "../types";
import { NutritionTotals, getCalorieFeedback } from "../utils/nutrition";

export function LogScreen({
  meals,
  totals,
  dailyCalories,
  onDeleteMeal
}: {
  meals: MealLog[];
  totals: NutritionTotals;
  dailyCalories: number;
  onDeleteMeal: (mealLogId: string) => void;
}) {
  const remaining = dailyCalories - totals.calories;

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.kicker}>今日總結</Text>
        <Text style={styles.title}>{remaining >= 0 ? "今天的節奏很穩定" : "今天稍微吃多了一點"}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.summaryText}>{getCalorieFeedback(totals.calories, dailyCalories, totals.protein)}</Text>
        <MacroGrid protein={totals.protein} carbs={totals.carbs} fat={totals.fat} />
      </View>

      <Text style={styles.sectionTitle}>飲食紀錄</Text>
      {meals.length > 0 ? (
        meals.map((meal) => <MealRow key={meal.id} meal={meal} onDelete={() => onDeleteMeal(meal.id)} />)
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>今日未有紀錄</Text>
          <Text style={styles.muted}>可以從餐廳頁加入一道菜，或使用影像估算加入紀錄。</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { padding: 18, paddingBottom: 110, gap: 14 },
  header: { gap: 5, paddingTop: 8 },
  kicker: { color: "#0F766E", fontSize: 14, fontWeight: "700" },
  title: { color: "#111827", fontSize: 28, fontWeight: "800", lineHeight: 34 },
  card: { backgroundColor: "#FFFFFF", borderColor: "#E5E7EB", borderRadius: 8, borderWidth: 1, gap: 12, padding: 15 },
  summaryText: { color: "#111827", fontSize: 16, lineHeight: 24 },
  sectionTitle: { color: "#111827", fontSize: 18, fontWeight: "800", marginTop: 4 },
  emptyState: { alignItems: "center", backgroundColor: "#FFFFFF", borderColor: "#E5E7EB", borderRadius: 8, borderWidth: 1, gap: 6, padding: 20 },
  emptyStateTitle: { color: "#111827", fontSize: 17, fontWeight: "900" },
  muted: { color: "#6B7280", flexShrink: 1, fontSize: 13, lineHeight: 19 }
});
