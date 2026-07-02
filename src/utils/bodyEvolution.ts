import { BodyEvolutionSnapshot, Companion, CompanionState } from "../types";
import { NutritionTotals } from "./nutrition";

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function getToneLabel(archetype: Companion["bodyArchetype"], stage: number): string {
  if (archetype === "barbie") {
    return stage >= 3 ? "身形線條更明顯" : stage >= 2 ? "進步狀態" : "初始狀態";
  }

  if (archetype === "gymBro") {
    return stage >= 3 ? "力量感更明顯" : stage >= 2 ? "進步狀態" : "初始狀態";
  }

  if (archetype === "pet") {
    return stage >= 3 ? "毛色更蓬鬆" : stage >= 2 ? "精神更飽滿" : "療癒初始";
  }

  return stage >= 3 ? "枝葉更茂盛" : stage >= 2 ? "嫩芽更明亮" : "發芽初始";
}

function getBeforeLabel(archetype: Companion["bodyArchetype"]): string {
  if (archetype === "barbie") return "Before";
  if (archetype === "gymBro") return "Before";
  if (archetype === "pet") return "初始狀態";
  return "初始嫩芽";
}

function getAfterLabel(archetype: Companion["bodyArchetype"], stage: number): string {
  if (archetype === "barbie") return "After";
  if (archetype === "gymBro") return "After";
  if (archetype === "pet") return stage >= 3 ? "蓬鬆發光" : "心情飽滿";
  return stage >= 3 ? "盛放狀態" : "新葉成長";
}

export function createBodyEvolutionSnapshot({
  companion,
  companionState,
  totals,
  dailyCalories,
  proteinGoal
}: {
  companion: Companion;
  companionState: CompanionState;
  totals: NutritionTotals;
  dailyCalories: number;
  proteinGoal?: number;
}): BodyEvolutionSnapshot {
  const calorieGap = dailyCalories - totals.calories;
  const calorieProgress = clamp(totals.calories / Math.max(dailyCalories, 1), 0, 1.25);
  const proteinProgress = clamp(totals.protein / Math.max(proteinGoal ?? 90, 1), 0, 1.25);
  const consistencyBoost = clamp((companionState.happiness + companionState.energy) / 200, 0.35, 1);
  const nutritionScore = companion.bodyArchetype === "gymBro" ? proteinProgress * 0.58 + Math.min(calorieProgress, 1) * 0.22 : proteinProgress * 0.34 + Math.min(calorieProgress, 1) * 0.3;
  const stageScore = clamp((companionState.evolutionStage - 1) * 0.16, 0, 0.42);
  const visualScore = clamp(nutritionScore + consistencyBoost * 0.18 + stageScore, 0.12, 1);
  const isBalanced = calorieGap >= -180 && calorieGap <= 420;
  const encouragement =
    proteinProgress >= 0.85 && isBalanced
      ? "今天的滋養節奏很穩定，角色線條看起來更明亮。"
      : companion.bodyArchetype === "barbie" || companion.bodyArchetype === "gymBro"
        ? "保持飲食紀錄與足夠蛋白質，身形進度會逐步更新。"
      : proteinProgress < 0.5
        ? "今天可以加一份蛋白質，幫助進度更穩定。"
        : calorieGap < -180
          ? "今天已經很充足，下一餐選擇清爽一點也很好。"
          : "微小選擇正在累積，角色會慢慢把變化呈現出來。";

  return {
    archetype: companion.bodyArchetype,
    stage: companionState.evolutionStage,
    toneLabel: getToneLabel(companion.bodyArchetype, companionState.evolutionStage),
    beforeLabel: getBeforeLabel(companion.bodyArchetype),
    afterLabel: getAfterLabel(companion.bodyArchetype, companionState.evolutionStage),
    calorieGap,
    proteinProgress,
    calorieProgress,
    visualScore,
    encouragement
  };
}
