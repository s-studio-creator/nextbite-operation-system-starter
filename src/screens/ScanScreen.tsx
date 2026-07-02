import { Plus, Sparkles } from "lucide-react-native";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { MacroGrid } from "../components/MacroGrid";
import { MealType, ScanResult } from "../types";
import { mealTypeLabels, mealTypes } from "../utils/nutrition";

export function ScanScreen({
  image,
  result,
  mealType,
  onPickImage,
  onMealTypeChange,
  onAddMeal
}: {
  image: string | null;
  result: ScanResult;
  mealType: MealType;
  onPickImage: () => void;
  onMealTypeChange: (mealType: MealType) => void;
  onAddMeal: () => void;
}) {
  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.kicker}>餐點影像估算</Text>
        <Text style={styles.title}>快速記錄一餐</Text>
      </View>

      <Pressable style={styles.imagePicker} onPress={onPickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.scanImage} />
        ) : (
          <View style={styles.emptyImage}>
            <Sparkles size={32} color="#0F766E" />
            <Text style={styles.emptyImageText}>選擇餐點相片</Text>
          </View>
        )}
      </Pressable>

      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <View>
            <Text style={styles.cardTitle}>{result.name}</Text>
            <Text style={styles.muted}>AI 信心度 {result.confidence}%</Text>
          </View>
          <Text style={styles.calorieBadge}>{result.calories} kcal</Text>
        </View>
        <MacroGrid protein={result.protein} carbs={result.carbs} fat={result.fat} />
      </View>

      <Text style={styles.fieldLabel}>加入哪一餐？</Text>
      <View style={styles.segmented}>
        {mealTypes.map((value) => (
          <Pressable key={value} style={[styles.segment, mealType === value && styles.segmentActive]} onPress={() => onMealTypeChange(value)}>
            <Text style={[styles.segmentText, mealType === value && styles.segmentTextActive]}>{mealTypeLabels[value]}</Text>
          </Pressable>
        ))}
      </View>

      <Pressable style={styles.primaryButtonFull} onPress={onAddMeal}>
        <Plus size={19} color="#FFFFFF" />
        <Text style={styles.primaryButtonText}>加入今日紀錄</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { padding: 18, paddingBottom: 110, gap: 14 },
  header: { gap: 5, paddingTop: 8 },
  kicker: { color: "#0F766E", fontSize: 14, fontWeight: "700" },
  title: { color: "#111827", fontSize: 28, fontWeight: "800", lineHeight: 34 },
  imagePicker: { aspectRatio: 1.25, backgroundColor: "#FFFFFF", borderColor: "#D1D5DB", borderRadius: 8, borderWidth: 1, overflow: "hidden" },
  scanImage: { height: "100%", width: "100%" },
  emptyImage: { alignItems: "center", flex: 1, gap: 10, justifyContent: "center" },
  emptyImageText: { color: "#0F766E", fontSize: 16, fontWeight: "800" },
  card: { backgroundColor: "#FFFFFF", borderColor: "#E5E7EB", borderRadius: 8, borderWidth: 1, gap: 12, padding: 15 },
  rowBetween: { alignItems: "center", flexDirection: "row", gap: 12, justifyContent: "space-between" },
  cardTitle: { color: "#111827", flexShrink: 1, fontSize: 18, fontWeight: "800" },
  muted: { color: "#6B7280", flexShrink: 1, fontSize: 13, lineHeight: 19 },
  calorieBadge: { backgroundColor: "#FEF3C7", borderRadius: 999, color: "#92400E", fontSize: 14, fontWeight: "900", paddingHorizontal: 10, paddingVertical: 7 },
  fieldLabel: { color: "#374151", fontSize: 14, fontWeight: "800" },
  segmented: { backgroundColor: "#E5E7EB", borderRadius: 8, flexDirection: "row", padding: 4 },
  segment: { alignItems: "center", borderRadius: 6, flex: 1, paddingVertical: 10 },
  segmentActive: { backgroundColor: "#FFFFFF" },
  segmentText: { color: "#6B7280", fontSize: 14, fontWeight: "800" },
  segmentTextActive: { color: "#0F766E" },
  primaryButtonFull: { alignItems: "center", backgroundColor: "#0F766E", borderRadius: 8, flexDirection: "row", gap: 8, justifyContent: "center", minHeight: 52 },
  primaryButtonText: { color: "#FFFFFF", fontSize: 15, fontWeight: "800" }
});
