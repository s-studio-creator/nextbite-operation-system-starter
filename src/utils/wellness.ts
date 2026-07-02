import {
  BedtimeWindDownRecord,
  BedtimeWindDownState,
  CheckInMood,
  CheckInRecord,
  Companion,
  CompanionState,
  CozyPlanProgressState,
  CozyPlanSectionId,
  DailyCheckInState,
  DailyCozyPlan,
  DailyMissionState,
  GentleMission,
  MealLog,
  Restaurant,
  RoomItem,
  WellnessProgress
} from "../types";

export const pointsPerEvolutionStage = 120;

export function getTodayKey(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

export function createInitialCompanionState(companion: Companion, nickname: string): CompanionState {
  return {
    selectedCompanionId: companion.id,
    nickname: nickname.trim() || companion.name,
    evolutionStage: companion.evolutionStage,
    happiness: companion.happiness,
    energy: companion.energy,
    mood: "calm",
    lastReaction: "我會在這裏陪您，慢慢開始就好。",
    idleAnimation: "breathing",
    unlockedAccessories: companion.unlockedAccessories ?? [],
    unlockedRoomItems: []
  };
}

export function normalizeCompanionState(companionState: CompanionState | null): CompanionState | null {
  if (!companionState) {
    return null;
  }

  return {
    ...companionState,
    mood: companionState.mood ?? "calm",
    lastReaction: companionState.lastReaction ?? "我會在這裏陪您，慢慢開始就好。",
    idleAnimation: companionState.idleAnimation ?? "breathing",
    unlockedAccessories: companionState.unlockedAccessories ?? [],
    unlockedRoomItems: companionState.unlockedRoomItems ?? []
  };
}

export const defaultWellnessProgress: WellnessProgress = {
  streakDays: 0,
  totalHealthyMeals: 0,
  evolutionPoints: 0,
  lastCheckInDate: ""
};

export function createDailyMissionState(date = getTodayKey()): DailyMissionState {
  return {
    date,
    completedMissionIds: []
  };
}

export const defaultDailyCheckInState: DailyCheckInState = {
  lastCheckInDate: "",
  history: []
};

export const defaultBedtimeWindDownState: BedtimeWindDownState = {
  lastWindDownDate: "",
  history: []
};

export function isNighttime(hour = new Date().getHours()): boolean {
  return hour >= 21 || hour <= 4;
}

export function shouldShowBedtimeWindDown({
  state,
  checkInState,
  hour = new Date().getHours()
}: {
  state: BedtimeWindDownState;
  checkInState: DailyCheckInState;
  hour?: number;
}): boolean {
  const todayKey = getTodayKey();
  return isNighttime(hour) && checkInState.lastCheckInDate === todayKey && state.lastWindDownDate !== todayKey;
}

export function getBedtimeReflection({
  cozyPlanProgressState,
  companionState
}: {
  cozyPlanProgressState: CozyPlanProgressState;
  companionState: CompanionState;
}): string[] {
  const reflections = ["今天已經平安走過"];

  if (cozyPlanProgressState.completedSections.includes("tinyRitual")) {
    reflections.push("您完成了一個微小儀式");
  }

  if (cozyPlanProgressState.completedSections.includes("foodSuggestion")) {
    reflections.push("角色在滋養選擇後看起來特別開心");
  }

  if (cozyPlanProgressState.completedSections.includes("rewardTarget")) {
    reflections.push("今晚房間感覺更溫暖了一點");
  }

  if (companionState.happiness >= 85) {
    reflections.push("角色今天感受到被照顧");
  }

  return reflections.slice(0, 3);
}

export function applyBedtimeWindDown({
  companionState,
  bedtimeWindDownState,
  cozyPlanProgressState
}: {
  companionState: CompanionState;
  bedtimeWindDownState: BedtimeWindDownState;
  cozyPlanProgressState: CozyPlanProgressState;
}): { companionState: CompanionState; bedtimeWindDownState: BedtimeWindDownState; record: BedtimeWindDownRecord } {
  const todayKey = getTodayKey();
  const completedCozySections = cozyPlanProgressState.completedSections.length;
  const tomorrowHook = "明天也會為您保留一個安靜時刻";
  const record: BedtimeWindDownRecord = {
    id: `bedtime-${todayKey}`,
    date: todayKey,
    completedCozySections,
    glowSummary: completedCozySections >= 3 ? "今日柔光在夜裏保持溫暖" : "您的小空間今晚仍然安靜柔和",
    tomorrowHook,
    createdAt: Date.now()
  };

  return {
    companionState: {
      ...companionState,
      mood: "sleepy",
      energy: Math.max(35, companionState.energy - 8),
      happiness: Math.min(100, companionState.happiness + 3),
      lastReaction: "今晚一起好好休息",
      idleAnimation: "sleepyFloat"
    },
    bedtimeWindDownState: {
      lastWindDownDate: todayKey,
      history: [record, ...bedtimeWindDownState.history].slice(0, 30)
    },
    record
  };
}

export function shouldShowDailyCheckIn(state: DailyCheckInState): boolean {
  return state.lastCheckInDate !== getTodayKey();
}

export function getMoodRitual(mood: CheckInMood): string {
  const rituals: Record<CheckInMood, string> = {
    calm: "今天喝一樣溫暖的飲品，慢慢開始。",
    tired: "今天只做一個很小的健康選擇也已足夠。",
    motivated: "選一餐含蛋白質的食物，為身體補一點力量。",
    anxious: "放鬆肩膀三次，然後飲一口水。",
    cozy: "為自己留一個舒服角落，吃一餐滋養的飯。",
    emotional: "今日對自己講一句溫柔說話。",
    confident: "用一個清爽選擇保護今天的節奏。",
    lowEnergy: "行三分鐘，或者只是伸展一下也可以。",
    hopeful: "今天做一件讓明天的自己舒服一點的小事。"
  };

  return rituals[mood];
}

export function generateDailyCozyPlan({
  mood,
  companionState,
  wellnessProgress,
  recentProtein,
  hour = new Date().getHours()
}: {
  mood: CheckInMood;
  companionState: CompanionState;
  wellnessProgress: WellnessProgress;
  recentProtein: number;
  hour?: number;
}): DailyCozyPlan {
  const timeTone = hour >= 18 ? "今晚" : hour >= 12 ? "今日下半日" : "今日";
  const tinyRituals: Record<CheckInMood, string> = {
    calm: `${timeTone}喝一樣溫暖的飲品，保留這份平靜。`,
    tired: `${timeTone}只選一件細小照顧自己的事就足夠。`,
    motivated: `${timeTone}選一餐有力量的滋養食物。`,
    anxious: `${timeTone}放鬆肩膀，慢慢飲幾口水。`,
    cozy: `${timeTone}為自己留一個舒服角落。`,
    emotional: `${timeTone}對自己講一句溫柔說話。`,
    confident: `${timeTone}用一個清爽選擇保護節奏。`,
    lowEnergy: `${timeTone}行三分鐘，或者伸展一下就好。`,
    hopeful: `${timeTone}做一件讓明天舒服一點的小事。`
  };
  const foodSuggestions: Record<CheckInMood, string> = {
    calm: "清湯粉麵、暖茶、少油小菜，讓身體保持輕盈。",
    tired: recentProtein < 50 ? "暖湯配高蛋白小碗，舒服又有力量。" : "一碗溫暖湯飯，簡單飽足就好。",
    motivated: "新鮮蛋白碗、三文魚飯或果昔，都很適合今天的節奏。",
    anxious: "低咖啡因、暖胃食物、清湯或粥，先照顧安定感。",
    cozy: "暖飯碗、茶、柔和湯品，食得像一個小小擁抱。",
    emotional: "選一餐真正想照顧自己的食物，不用追求完美。",
    confident: "高蛋白、清爽、顏色漂亮的一餐，可以延續今天的光感。",
    lowEnergy: "簡單、暖、容易入口：湯、飯碗、豆漿都可以。",
    hopeful: "一餐均衡而舒服的選擇，為今天留下一點好感。"
  };
  const roomTarget =
    companionState.unlockedRoomItems.length === 0
      ? "完成一個小儀式，為房間點亮第一件小物。"
      : wellnessProgress.streakDays >= 3
        ? "保持柔光連續紀錄，下一件房間小物會更快靠近。"
        : "完成 1 個柔和任務，讓房間多一點柔光。";

  return {
    date: getTodayKey(),
    mood,
    tinyRitual: tinyRituals[mood],
    foodSuggestion: foodSuggestions[mood],
    rewardTarget: roomTarget,
    accentLabel: companionState.evolutionStage >= 2 ? "柔光成長日" : "微小照顧日"
  };
}

export function getMoodReaction(mood: CheckInMood): string {
  const reactions: Record<CheckInMood, string> = {
    calm: "你一來，房間就安靜亮起來。",
    tired: "不用急，角色今天會陪您慢慢走。",
    motivated: "角色感覺到您今天有一點光。",
    anxious: "角色坐近了一點，提醒您可以慢慢呼吸。",
    cozy: "角色為您保留了最舒服的位置。",
    emotional: "角色沒有催促，只是安靜陪著您。",
    confident: "角色今天很為您驕傲。",
    lowEnergy: "低能量也可以被溫柔照顧。",
    hopeful: "角色覺得今天會有一點點好事發生。"
  };

  return reactions[mood];
}

export function applyDailyCheckIn({
  companionState,
  wellnessProgress,
  dailyCheckInState,
  mood
}: {
  companionState: CompanionState;
  wellnessProgress: WellnessProgress;
  dailyCheckInState: DailyCheckInState;
  mood: CheckInMood;
}): { companionState: CompanionState; wellnessProgress: WellnessProgress; dailyCheckInState: DailyCheckInState; record: CheckInRecord } {
  const todayKey = getTodayKey();
  const glowPoints = 22;
  const nextEvolutionPoints = wellnessProgress.evolutionPoints + glowPoints;
  const nextStage = Math.max(companionState.evolutionStage, Math.floor(nextEvolutionPoints / pointsPerEvolutionStage) + 1);
  const ritual = getMoodRitual(mood);
  const record: CheckInRecord = {
    id: `check-in-${todayKey}`,
    date: todayKey,
    mood,
    ritual,
    glowPoints,
    createdAt: Date.now()
  };

  return {
    companionState: {
      ...companionState,
      evolutionStage: nextStage,
      happiness: Math.min(100, companionState.happiness + 6),
      energy: Math.min(100, companionState.energy + (mood === "tired" || mood === "lowEnergy" ? 2 : 5)),
      mood: mood === "tired" || mood === "lowEnergy" ? "sleepy" : mood === "motivated" || mood === "confident" ? "excited" : "glowing",
      lastReaction: getMoodReaction(mood),
      idleAnimation: mood === "tired" || mood === "lowEnergy" ? "sleepyFloat" : "sparkle",
      unlockedAccessories: companionState.unlockedAccessories,
      unlockedRoomItems: companionState.unlockedRoomItems
    },
    wellnessProgress: {
      ...wellnessProgress,
      streakDays: wellnessProgress.lastCheckInDate === todayKey ? wellnessProgress.streakDays : wellnessProgress.streakDays + 1,
      evolutionPoints: nextEvolutionPoints,
      lastCheckInDate: todayKey
    },
    dailyCheckInState: {
      lastCheckInDate: todayKey,
      todayMood: mood,
      todayRitual: ritual,
      history: [record, ...dailyCheckInState.history].slice(0, 30)
    },
    record
  };
}

export function normalizeDailyMissionState(state: DailyMissionState | null, date = getTodayKey()): DailyMissionState {
  if (!state || state.date !== date) {
    return createDailyMissionState(date);
  }

  return state;
}

export function createCozyPlanProgressState(date = getTodayKey()): CozyPlanProgressState {
  return {
    date,
    completedSections: [],
    cozyDayBonusClaimed: false
  };
}

export function normalizeCozyPlanProgressState(state: CozyPlanProgressState | null, date = getTodayKey()): CozyPlanProgressState {
  if (!state || state.date !== date) {
    return createCozyPlanProgressState(date);
  }

  return state;
}

export function getCozyPlanCompletionMessage(sectionId: CozyPlanSectionId): string {
  const messages: Record<CozyPlanSectionId, string> = {
    tinyRitual: "這是很溫柔的一小步",
    foodSuggestion: "您的角色現在看起來很安心",
    rewardTarget: "房間已經暖起來了一點"
  };

  return messages[sectionId];
}

export function createRoomReward(mission: GentleMission): RoomItem | null {
  if (!mission.roomRewardId) {
    return null;
  }

  const rewardNames: Record<string, { name: string; type: RoomItem["type"] }> = {
    "dew-plant": { name: "晨露小植物", type: "plant" },
    "skincare-shelf": { name: "柔光護膚架", type: "shelf" },
    "latte-lamp": { name: "拿鐵小夜燈", type: "lamp" },
    "cloud-rug": { name: "雲朵地毯", type: "furniture" }
  };
  const reward = rewardNames[mission.roomRewardId];

  if (!reward) {
    return null;
  }

  return {
    id: mission.roomRewardId,
    name: reward.name,
    type: reward.type,
    unlockedAt: Date.now()
  };
}

export function calculateMealProgress(mealLog: MealLog, restaurant?: Restaurant): number {
  const proteinPoints = (mealLog.totalProtein ?? 0) >= 30 ? 16 : 6;
  const caloriePoints = mealLog.totalCalories <= 650 ? 12 : 6;
  const restaurantPoints = restaurant && restaurant.healthyScore >= 85 ? 12 : 0;
  const lowOilPoints = restaurant?.highlights.some((tag) => tag.includes("油")) ? 8 : 0;

  return proteinPoints + caloriePoints + restaurantPoints + lowOilPoints;
}

export function applyMealProgress({
  companionState,
  wellnessProgress,
  mealLog,
  restaurant
}: {
  companionState: CompanionState;
  wellnessProgress: WellnessProgress;
  mealLog: MealLog;
  restaurant?: Restaurant;
}): { companionState: CompanionState; wellnessProgress: WellnessProgress } {
  const todayKey = getTodayKey();
  const isNewDay = wellnessProgress.lastCheckInDate !== todayKey;
  const gainedPoints = calculateMealProgress(mealLog, restaurant);
  const nextEvolutionPoints = wellnessProgress.evolutionPoints + gainedPoints;
  const nextStage = Math.max(companionState.evolutionStage, Math.floor(nextEvolutionPoints / pointsPerEvolutionStage) + 1);
  const unlockedAccessories = [...companionState.unlockedAccessories];

  if (nextStage >= 2 && !unlockedAccessories.includes("柔光背景")) {
    unlockedAccessories.push("柔光背景");
  }

  if (nextStage >= 3 && !unlockedAccessories.includes("健康小袋")) {
    unlockedAccessories.push("健康小袋");
  }

  return {
    companionState: {
      ...companionState,
      evolutionStage: nextStage,
      happiness: Math.min(100, companionState.happiness + 5),
      energy: Math.min(100, companionState.energy + (mealLog.totalCalories <= 650 ? 6 : 3)),
      mood: mealLog.totalCalories <= 650 ? "proud" : "calm",
      lastReaction: mealLog.totalCalories <= 650 ? "這一餐很溫柔，角色像在發光。" : "願意記錄，已經是在照顧自己。",
      idleAnimation: mealLog.totalCalories <= 650 ? "sparkle" : "breathing",
      unlockedAccessories
    },
    wellnessProgress: {
      streakDays: isNewDay ? wellnessProgress.streakDays + 1 : wellnessProgress.streakDays,
      totalHealthyMeals: wellnessProgress.totalHealthyMeals + 1,
      evolutionPoints: nextEvolutionPoints,
      lastCheckInDate: todayKey
    }
  };
}

export function applyMissionCompletion({
  companionState,
  wellnessProgress,
  mission
}: {
  companionState: CompanionState;
  wellnessProgress: WellnessProgress;
  mission: GentleMission;
}): { companionState: CompanionState; wellnessProgress: WellnessProgress } {
  const nextEvolutionPoints = wellnessProgress.evolutionPoints + mission.glowPoints;
  const nextStage = Math.max(companionState.evolutionStage, Math.floor(nextEvolutionPoints / pointsPerEvolutionStage) + 1);
  const reward = createRoomReward(mission);
  const unlockedRoomItems =
    reward && !companionState.unlockedRoomItems.some((item) => item.id === reward.id)
      ? [reward, ...companionState.unlockedRoomItems]
      : companionState.unlockedRoomItems;

  return {
    companionState: {
      ...companionState,
      evolutionStage: nextStage,
      happiness: Math.min(100, companionState.happiness + mission.happinessBoost),
      energy: Math.min(100, companionState.energy + mission.energyBoost),
      mood: mission.glowPoints >= 24 ? "glowing" : "proud",
      lastReaction: `${mission.title} 完成了。您的角色悄悄開心了一下。`,
      idleAnimation: mission.glowPoints >= 24 ? "sparkle" : "sway",
      unlockedRoomItems
    },
    wellnessProgress: {
      ...wellnessProgress,
      evolutionPoints: nextEvolutionPoints
    }
  };
}

export function applyCozyPlanSectionCompletion({
  companionState,
  wellnessProgress,
  progressState,
  sectionId
}: {
  companionState: CompanionState;
  wellnessProgress: WellnessProgress;
  progressState: CozyPlanProgressState;
  sectionId: CozyPlanSectionId;
}): { companionState: CompanionState; wellnessProgress: WellnessProgress; progressState: CozyPlanProgressState } {
  if (progressState.completedSections.includes(sectionId)) {
    return { companionState, wellnessProgress, progressState };
  }

  const sectionPoints: Record<CozyPlanSectionId, number> = {
    tinyRitual: 14,
    foodSuggestion: 18,
    rewardTarget: 22
  };
  const nextCompletedSections = [...progressState.completedSections, sectionId];
  const completedAll = nextCompletedSections.length === 3 && !progressState.cozyDayBonusClaimed;
  const gainedPoints = sectionPoints[sectionId] + (completedAll ? 30 : 0);
  const nextEvolutionPoints = wellnessProgress.evolutionPoints + gainedPoints;
  const nextStage = Math.max(companionState.evolutionStage, Math.floor(nextEvolutionPoints / pointsPerEvolutionStage) + 1);
  const bonusRoomItem: RoomItem = {
    id: `cozy-day-glow-${progressState.date}`,
    name: "柔和日柔光",
    type: "glow",
    unlockedAt: Date.now()
  };
  const unlockedRoomItems =
    completedAll && !companionState.unlockedRoomItems.some((item) => item.id === bonusRoomItem.id)
      ? [bonusRoomItem, ...companionState.unlockedRoomItems]
      : companionState.unlockedRoomItems;

  const moodBySection: Record<CozyPlanSectionId, CompanionState["mood"]> = {
    tinyRitual: "calm",
    foodSuggestion: "excited",
    rewardTarget: "glowing"
  };
  const animationBySection: Record<CozyPlanSectionId, CompanionState["idleAnimation"]> = {
    tinyRitual: "breathing",
    foodSuggestion: "sway",
    rewardTarget: "sparkle"
  };
  const message = completedAll ? "今日柔和計劃完成了。您和角色今天都有被溫柔照顧。" : getCozyPlanCompletionMessage(sectionId);

  return {
    companionState: {
      ...companionState,
      evolutionStage: nextStage,
      happiness: Math.min(100, companionState.happiness + (completedAll ? 10 : 4)),
      energy: Math.min(100, companionState.energy + (completedAll ? 8 : 3)),
      mood: completedAll ? "glowing" : moodBySection[sectionId],
      lastReaction: message,
      idleAnimation: completedAll ? "sparkle" : animationBySection[sectionId],
      unlockedRoomItems
    },
    wellnessProgress: {
      ...wellnessProgress,
      evolutionPoints: nextEvolutionPoints
    },
    progressState: {
      ...progressState,
      completedSections: nextCompletedSections,
      cozyDayBonusClaimed: completedAll ? true : progressState.cozyDayBonusClaimed,
      lastCompletedSection: sectionId,
      lastCompletionMessage: message
    }
  };
}

export function getEvolutionProgress(evolutionPoints: number): number {
  return (evolutionPoints % pointsPerEvolutionStage) / pointsPerEvolutionStage;
}

export function getCompanionMood(companionState: CompanionState): string {
  if (companionState.mood === "glowing") {
    return "你的夥伴正在柔柔發光";
  }

  if (companionState.mood === "proud") {
    return "角色今天很為您驕傲";
  }

  if (companionState.mood === "sleepy") {
    return "角色為您保留了一個安靜角落";
  }

  if (companionState.happiness >= 86 && companionState.energy >= 80) {
    return "你的夥伴今天很有精神";
  }

  if (companionState.energy < 55) {
    return "角色想陪您慢慢吃一餐清爽的飯";
  }

  return "今天照顧得很好";
}

export function getRecoveryMessage(wellnessProgress: WellnessProgress): string | null {
  if (!wellnessProgress.lastCheckInDate || wellnessProgress.lastCheckInDate === getTodayKey()) {
    return null;
  }

  return "沒關係，今日輕輕重新開始就好。你的夥伴一直在。";
}
