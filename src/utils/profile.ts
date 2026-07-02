import { UserProfile } from "../types";

export function calculateRecommendedProfile(input: {
  heightCm?: number;
  weightKg?: number;
  goalType: UserProfile["goalType"];
}): Pick<UserProfile, "dailyCalories" | "proteinGoal" | "carbsGoal" | "fatGoal"> {
  const weight = input.weightKg ?? 55;
  const baseCalories = input.goalType === "cut" ? 1200 : input.goalType === "bulk" ? 1900 : 1600;
  const dailyCalories = input.weightKg ? Math.round((weight * 28 + (input.heightCm ?? 165) * 2.5) / 50) * 50 : baseCalories;
  const adjustedCalories = input.goalType === "cut" ? Math.max(1200, dailyCalories - 350) : input.goalType === "bulk" ? dailyCalories + 250 : dailyCalories;

  return {
    dailyCalories: adjustedCalories,
    proteinGoal: Math.round(weight * 1.6),
    carbsGoal: Math.round((adjustedCalories * 0.42) / 4),
    fatGoal: Math.round((adjustedCalories * 0.28) / 9)
  };
}
