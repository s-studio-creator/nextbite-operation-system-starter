import { ChevronLeft, Heart, Minus, Plus } from "lucide-react-native";
import { useMemo, useState } from "react";
import { ImageBackground, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { MacroGrid } from "../components/MacroGrid";
import { Dish, DishSelection, MealLog, MealType, Restaurant } from "../types";
import { aggregateDishSelections, buildMealLog, createDishSelection, mealTypeLabels, mealTypes } from "../utils/nutrition";

type DraftSelection = {
  dish: Dish;
  portionMultiplier: number;
};

export function RestaurantDetailScreen({
  restaurant,
  isSaved,
  onBack,
  onToggleSaved,
  onSaveMeal
}: {
  restaurant: Restaurant;
  isSaved: boolean;
  onBack: () => void;
  onToggleSaved: () => void;
  onSaveMeal: (mealLog: MealLog) => void;
}) {
  const [selectedMealType, setSelectedMealType] = useState<MealType>("dinner");
  const [draftSelections, setDraftSelections] = useState<DraftSelection[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);

  const selections = useMemo<DishSelection[]>(
    () => draftSelections.map((selection) => createDishSelection(selection.dish, selection.portionMultiplier)),
    [draftSelections]
  );
  const totals = useMemo(() => aggregateDishSelections(selections), [selections]);

  const updateDishPortion = (dish: Dish, delta: number) => {
    setDraftSelections((current) => {
      const existing = current.find((selection) => selection.dish.id === dish.id);

      if (!existing) {
        return delta > 0 ? [...current, { dish, portionMultiplier: 1 }] : current;
      }

      const nextPortion = Math.round((existing.portionMultiplier + delta) * 4) / 4;

      if (nextPortion <= 0) {
        return current.filter((selection) => selection.dish.id !== dish.id);
      }

      return current.map((selection) => (selection.dish.id === dish.id ? { ...selection, portionMultiplier: nextPortion } : selection));
    });
  };

  const saveMeal = () => {
    if (selections.length === 0) {
      return;
    }

    onSaveMeal(
      buildMealLog({
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
        mealType: selectedMealType,
        dishes: selections
      })
    );
    setDraftSelections([]);
    setShowConfirm(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.screen}>
        <ImageBackground source={{ uri: restaurant.image }} style={styles.hero} imageStyle={styles.heroImage}>
          <Pressable style={styles.backButton} onPress={onBack}>
            <ChevronLeft size={23} color="#111827" />
          </Pressable>
          <Pressable style={[styles.favoriteButton, isSaved && styles.favoriteButtonActive]} onPress={onToggleSaved}>
            <Heart size={19} color={isSaved ? "#FFFFFF" : "#0F766E"} fill={isSaved ? "#FFFFFF" : "transparent"} />
          </Pressable>
        </ImageBackground>

        <View style={styles.header}>
          <Text style={styles.kicker}>{restaurant.district} · {restaurant.cuisine}</Text>
          <Text style={styles.title}>{restaurant.name}</Text>
          <Text style={styles.muted}>
            {restaurant.price} · ★ {restaurant.rating} · {restaurant.healthyScore} 健康分
          </Text>
          <View style={styles.chipRow}>
            {restaurant.highlights.map((highlight) => (
              <Text key={highlight} style={styles.smallChip}>{highlight}</Text>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>健康推薦</Text>
          <Text style={styles.summaryText}>
            今日想控制熱量，可以優先揀 {restaurant.menu[0]?.name}，醬汁分開、飯量半份會更穩陣。
          </Text>
        </View>

        <Text style={styles.sectionTitle}>餐牌 / Dish Builder</Text>
        {restaurant.menu.map((dish) => {
          const draft = draftSelections.find((selection) => selection.dish.id === dish.id);
          const preview = createDishSelection(dish, draft?.portionMultiplier ?? 1);

          return (
            <View key={dish.id} style={styles.dishCard}>
              <View style={styles.dishHeader}>
                <View style={styles.dishInfo}>
                  <Text style={styles.dishName}>{dish.name}</Text>
                  <Text style={styles.muted}>
                    {dish.tags?.join(" · ")} · {dish.calories} kcal
                  </Text>
                </View>
                <Text style={styles.calorieBadge}>{preview.calories} kcal</Text>
              </View>
              <MacroGrid protein={preview.protein ?? 0} carbs={preview.carbs ?? 0} fat={preview.fat ?? 0} />
              <View style={styles.portionRow}>
                <Pressable style={styles.stepperButton} onPress={() => updateDishPortion(dish, -0.25)}>
                  <Minus size={17} color="#0F766E" />
                </Pressable>
                <Text style={styles.portionText}>{draft?.portionMultiplier ?? 0} 份</Text>
                <Pressable style={styles.stepperButton} onPress={() => updateDishPortion(dish, 0.25)}>
                  <Plus size={17} color="#0F766E" />
                </Pressable>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {selections.length > 0 && (
        <View style={styles.stickyComposer}>
          <View>
            <Text style={styles.composerTitle}>{totals.calories} kcal</Text>
            <Text style={styles.muted}>{selections.length} 款菜式已選</Text>
          </View>
          <Pressable style={styles.primaryButton} onPress={() => setShowConfirm(true)}>
            <Text style={styles.primaryButtonText}>確認加入</Text>
          </Pressable>
        </View>
      )}

      <Modal visible={showConfirm} animationType="slide" transparent onRequestClose={() => setShowConfirm(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.sheet}>
            <Text style={styles.cardTitle}>確認今餐</Text>
            <Text style={styles.summaryText}>總共 {totals.calories} kcal，份量可以之後再微調。</Text>
            <MacroGrid protein={totals.protein} carbs={totals.carbs} fat={totals.fat} />
            <View style={styles.mealTypeRow}>
              {mealTypes.map((mealType) => (
                <Pressable
                  key={mealType}
                  style={[styles.mealTypeChip, selectedMealType === mealType && styles.mealTypeChipActive]}
                  onPress={() => setSelectedMealType(mealType)}
                >
                  <Text style={[styles.mealTypeText, selectedMealType === mealType && styles.mealTypeTextActive]}>{mealTypeLabels[mealType]}</Text>
                </Pressable>
              ))}
            </View>
            {selections.map((selection) => (
              <Text key={selection.dishId} style={styles.selectionText}>
                {selection.name} · {selection.portionMultiplier} 份 · {selection.calories} kcal
              </Text>
            ))}
            <View style={styles.sheetActions}>
              <Pressable style={styles.secondaryButton} onPress={() => setShowConfirm(false)}>
                <Text style={styles.secondaryButtonText}>再改改</Text>
              </Pressable>
              <Pressable style={styles.primaryButton} onPress={saveMeal}>
                <Text style={styles.primaryButtonText}>儲存紀錄</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  screen: { paddingBottom: 130, gap: 14 },
  hero: { flexDirection: "row", height: 230, justifyContent: "space-between", padding: 16 },
  heroImage: { borderBottomLeftRadius: 8, borderBottomRightRadius: 8 },
  backButton: { alignItems: "center", backgroundColor: "rgba(255,255,255,0.94)", borderRadius: 999, height: 40, justifyContent: "center", width: 40 },
  favoriteButton: { alignItems: "center", backgroundColor: "rgba(255,255,255,0.94)", borderRadius: 999, height: 40, justifyContent: "center", width: 40 },
  favoriteButtonActive: { backgroundColor: "#0F766E" },
  header: { gap: 8, paddingHorizontal: 18 },
  kicker: { color: "#0F766E", fontSize: 14, fontWeight: "800" },
  title: { color: "#111827", fontSize: 29, fontWeight: "900", lineHeight: 35 },
  muted: { color: "#6B7280", flexShrink: 1, fontSize: 13, lineHeight: 19 },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  smallChip: { backgroundColor: "#F3F4F6", borderRadius: 999, color: "#374151", fontSize: 12, fontWeight: "700", paddingHorizontal: 9, paddingVertical: 5 },
  card: { backgroundColor: "#FFFFFF", borderColor: "#E5E7EB", borderRadius: 8, borderWidth: 1, gap: 10, marginHorizontal: 18, padding: 15 },
  cardTitle: { color: "#111827", fontSize: 18, fontWeight: "900" },
  summaryText: { color: "#111827", fontSize: 15, lineHeight: 22 },
  sectionTitle: { color: "#111827", fontSize: 18, fontWeight: "900", marginHorizontal: 18 },
  dishCard: { backgroundColor: "#FFFFFF", borderColor: "#E5E7EB", borderRadius: 8, borderWidth: 1, gap: 12, marginHorizontal: 18, padding: 14 },
  dishHeader: { alignItems: "center", flexDirection: "row", gap: 10, justifyContent: "space-between" },
  dishInfo: { flex: 1 },
  dishName: { color: "#111827", fontSize: 16, fontWeight: "900" },
  calorieBadge: { backgroundColor: "#FEF3C7", borderRadius: 999, color: "#92400E", fontSize: 13, fontWeight: "900", paddingHorizontal: 10, paddingVertical: 7 },
  portionRow: { alignItems: "center", flexDirection: "row", justifyContent: "space-between" },
  stepperButton: { alignItems: "center", backgroundColor: "#ECFDF5", borderRadius: 999, height: 38, justifyContent: "center", width: 38 },
  portionText: { color: "#111827", fontSize: 16, fontWeight: "900" },
  stickyComposer: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E7EB",
    borderTopWidth: 1,
    bottom: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    left: 0,
    padding: 16,
    paddingBottom: 28,
    position: "absolute",
    right: 0
  },
  composerTitle: { color: "#111827", fontSize: 20, fontWeight: "900" },
  primaryButton: { alignItems: "center", backgroundColor: "#0F766E", borderRadius: 8, justifyContent: "center", minHeight: 46, paddingHorizontal: 18 },
  primaryButtonText: { color: "#FFFFFF", fontSize: 15, fontWeight: "900" },
  modalBackdrop: { backgroundColor: "rgba(17,24,39,0.38)", flex: 1, justifyContent: "flex-end" },
  sheet: { backgroundColor: "#FFFFFF", borderTopLeftRadius: 14, borderTopRightRadius: 14, gap: 14, padding: 18, paddingBottom: 30 },
  mealTypeRow: { flexDirection: "row", gap: 8 },
  mealTypeChip: { backgroundColor: "#F3F4F6", borderRadius: 999, flex: 1, paddingVertical: 10 },
  mealTypeChipActive: { backgroundColor: "#0F766E" },
  mealTypeText: { color: "#374151", fontSize: 13, fontWeight: "900", textAlign: "center" },
  mealTypeTextActive: { color: "#FFFFFF" },
  selectionText: { color: "#374151", fontSize: 14, lineHeight: 21 },
  sheetActions: { flexDirection: "row", gap: 10 },
  secondaryButton: { alignItems: "center", backgroundColor: "#ECFDF5", borderRadius: 8, flex: 1, justifyContent: "center", minHeight: 46 },
  secondaryButtonText: { color: "#0F766E", fontSize: 15, fontWeight: "900" }
});
