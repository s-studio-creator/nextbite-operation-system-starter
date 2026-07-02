import { useCallback, useEffect, useRef, useState } from "react";
import { MealLog, MealType } from "../types";
import { loadData, saveData } from "./storage";

const mealLogsKey = "calorie-map:meal-logs";

const legacyMealPeriodToType: Record<string, MealType> = {
  早餐: "breakfast",
  午餐: "lunch",
  晚餐: "dinner",
  小食: "snack"
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readNumber(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function readString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function migrateMealLog(value: unknown): MealLog | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = readString(value.id) ?? `meal-${Date.now()}`;
  const createdAt = readNumber(value.createdAt) || Date.now();

  if (Array.isArray(value.dishes) && typeof value.mealType === "string") {
    return {
      id,
      restaurantId: readString(value.restaurantId),
      restaurantName: readString(value.restaurantName),
      mealType: value.mealType as MealType,
      dishes: value.dishes as MealLog["dishes"],
      totalCalories: readNumber(value.totalCalories),
      totalProtein: readNumber(value.totalProtein),
      totalCarbs: readNumber(value.totalCarbs),
      totalFat: readNumber(value.totalFat),
      createdAt
    };
  }

  const legacyName = readString(value.name);
  const legacyCalories = readNumber(value.calories);

  if (!legacyName || legacyCalories <= 0) {
    return null;
  }

  const period = readString(value.period) ?? "小食";
  const restaurantId = readString(value.restaurantId);
  const source = readString(value.source);

  return {
    id,
    restaurantId,
    restaurantName: source,
    mealType: legacyMealPeriodToType[period] ?? "snack",
    dishes: [
      {
        dishId: id,
        name: legacyName,
        portionMultiplier: 1,
        calories: legacyCalories,
        protein: readNumber(value.protein),
        carbs: readNumber(value.carbs),
        fat: readNumber(value.fat)
      }
    ],
    totalCalories: legacyCalories,
    totalProtein: readNumber(value.protein),
    totalCarbs: readNumber(value.carbs),
    totalFat: readNumber(value.fat),
    createdAt
  };
}

export async function loadMealLogs(): Promise<MealLog[] | null> {
  const storedMealLogs = await loadData<unknown[]>(mealLogsKey);

  if (!storedMealLogs) {
    return null;
  }

  return storedMealLogs.map(migrateMealLog).filter((mealLog): mealLog is MealLog => mealLog !== null);
}

export async function saveMealLogs(mealLogs: MealLog[]): Promise<void> {
  await saveData(mealLogsKey, mealLogs);
}

export function useMealLogs(initialMealLogs: MealLog[]) {
  const [mealLogs, setMealLogs] = useState<MealLog[]>(initialMealLogs);
  const [isHydrated, setIsHydrated] = useState(false);
  const hasHydrated = useRef(false);

  useEffect(() => {
    let isMounted = true;

    async function hydrateMealLogs() {
      const storedMealLogs = await loadMealLogs();

      if (!isMounted) {
        return;
      }

      if (storedMealLogs) {
        setMealLogs(storedMealLogs);
      }

      hasHydrated.current = true;
      setIsHydrated(true);
    }

    hydrateMealLogs();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!hasHydrated.current) {
      return;
    }

    saveMealLogs(mealLogs);
  }, [mealLogs]);

  const addMealLog = useCallback((mealLog: MealLog) => {
    setMealLogs((current) => [mealLog, ...current]);
  }, []);

  const deleteMealLog = useCallback((mealLogId: string) => {
    setMealLogs((current) => current.filter((mealLog) => mealLog.id !== mealLogId));
  }, []);

  return {
    mealLogs,
    addMealLog,
    deleteMealLog,
    isHydrated
  };
}
