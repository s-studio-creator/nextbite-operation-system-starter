import { Dish, DishSelection, MealLog, MealType } from "../types";

export type NutritionTotals = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export const mealTypeLabels: Record<MealType, string> = {
  breakfast: "早餐",
  lunch: "午餐",
  dinner: "晚餐",
  snack: "小食"
};

export const mealTypes: MealType[] = ["breakfast", "lunch", "dinner", "snack"];

export function roundNutrition(value?: number): number {
  return Math.round((value ?? 0) * 10) / 10;
}

export function createDishSelection(dish: Dish, portionMultiplier: number): DishSelection {
  return {
    dishId: dish.id,
    name: dish.name,
    portionMultiplier,
    calories: Math.round(dish.calories * portionMultiplier),
    protein: roundNutrition((dish.protein ?? 0) * portionMultiplier),
    carbs: roundNutrition((dish.carbs ?? 0) * portionMultiplier),
    fat: roundNutrition((dish.fat ?? 0) * portionMultiplier)
  };
}

export function aggregateDishSelections(dishes: DishSelection[]): NutritionTotals {
  return dishes.reduce(
    (totals, dish) => ({
      calories: totals.calories + dish.calories,
      protein: roundNutrition(totals.protein + (dish.protein ?? 0)),
      carbs: roundNutrition(totals.carbs + (dish.carbs ?? 0)),
      fat: roundNutrition(totals.fat + (dish.fat ?? 0))
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );
}

export function aggregateMealLogs(mealLogs: MealLog[]): NutritionTotals {
  return mealLogs.reduce(
    (totals, mealLog) => ({
      calories: totals.calories + mealLog.totalCalories,
      protein: roundNutrition(totals.protein + (mealLog.totalProtein ?? 0)),
      carbs: roundNutrition(totals.carbs + (mealLog.totalCarbs ?? 0)),
      fat: roundNutrition(totals.fat + (mealLog.totalFat ?? 0))
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );
}

export function buildMealLog(input: {
  restaurantId?: string;
  restaurantName?: string;
  mealType: MealType;
  dishes: DishSelection[];
}): MealLog {
  const totals = aggregateDishSelections(input.dishes);

  return {
    id: `meal-${Date.now()}`,
    restaurantId: input.restaurantId,
    restaurantName: input.restaurantName,
    mealType: input.mealType,
    dishes: input.dishes,
    totalCalories: totals.calories,
    totalProtein: totals.protein,
    totalCarbs: totals.carbs,
    totalFat: totals.fat,
    createdAt: Date.now()
  };
}

export function getCalorieFeedback(consumedCalories: number, dailyCalories: number, protein: number): string {
  const remaining = dailyCalories - consumedCalories;

  if (protein >= 70 && remaining >= 0) {
    return "今天蛋白質攝取不錯，晚餐保持清爽就好。";
  }

  if (remaining > 250) {
    return `距離今日目標還有 ${remaining} kcal，可以安排一餐均衡外食。`;
  }

  if (remaining >= 0) {
    return `距離今日目標還有 ${remaining} kcal，今晚可以考慮低油選擇。`;
  }

  return "今天稍微超出目標，下一餐選擇清湯、少油或高蛋白款式就好。";
}
