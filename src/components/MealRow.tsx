import { Trash2 } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { MealLog } from "../types";
import { mealTypeLabels } from "../utils/nutrition";

export function MealRow({ meal, onDelete }: { meal: MealLog; onDelete?: () => void }) {
  const dishNames = meal.dishes.map((dish) => dish.name).join(" + ");

  return (
    <View style={styles.mealRow}>
      <View style={styles.mealInfo}>
        <Text style={styles.mealName}>{dishNames}</Text>
        <Text style={styles.muted}>
          {mealTypeLabels[meal.mealType]} · {meal.restaurantName ?? "手動紀錄"}
        </Text>
      </View>
      <View style={styles.mealActions}>
        <Text style={styles.mealCalories}>{meal.totalCalories} kcal</Text>
        {onDelete && (
          <Pressable style={styles.deleteButton} onPress={onDelete}>
            <Trash2 size={16} color="#991B1B" />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mealRow: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
    padding: 14
  },
  mealInfo: {
    flex: 1
  },
  mealActions: {
    alignItems: "center",
    flexDirection: "row",
    gap: 9
  },
  mealName: {
    color: "#111827",
    fontSize: 15,
    fontWeight: "800"
  },
  muted: {
    color: "#6B7280",
    flexShrink: 1,
    fontSize: 13,
    lineHeight: 19
  },
  mealCalories: {
    color: "#0F766E",
    fontSize: 14,
    fontWeight: "900"
  },
  deleteButton: {
    alignItems: "center",
    backgroundColor: "#FEE2E2",
    borderRadius: 999,
    height: 32,
    justifyContent: "center",
    width: 32
  }
});
