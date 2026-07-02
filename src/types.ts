export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export type Dish = {
  id: string;
  restaurantId: string;
  name: string;
  category: "food" | "drink" | "dessert" | "side";
  image?: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  tags?: string[];
};

export type DishSelection = {
  dishId: string;
  name: string;
  portionMultiplier: number;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
};

export type Restaurant = {
  id: string;
  name: string;
  district: string;
  address: string;
  cuisine: string;
  price: string;
  rating: number;
  healthyScore: number;
  distanceKm: number;
  latitude: number;
  longitude: number;
  image: string;
  highlights: string[];
  menu: Dish[];
};

export type MealLog = {
  id: string;
  restaurantId?: string;
  restaurantName?: string;
  mealType: MealType;
  dishes: DishSelection[];
  totalCalories: number;
  totalProtein?: number;
  totalCarbs?: number;
  totalFat?: number;
  createdAt: number;
};

export type SavedRestaurant = {
  id: string;
  savedAt: number;
};

export type UserProfile = {
  username?: string;
  heightCm?: number;
  weightKg?: number;
  dailyCalories: number;
  proteinGoal?: number;
  carbsGoal?: number;
  fatGoal?: number;
  goalType: "cut" | "maintain" | "bulk";
  language: "zh-Hant" | "en";
  setupCompleted: boolean;
};

export type AuthMethod = "apple" | "email" | "phone" | "guest";

export type AuthState = {
  connected: boolean;
  method?: AuthMethod;
  connectedAt?: number;
};

export type Companion = {
  id: string;
  name: string;
  type: string;
  personality: string;
  bodyArchetype: "barbie" | "gymBro" | "pet" | "spirit";
  evolutionStage: number;
  happiness: number;
  energy: number;
  unlockedAccessories?: string[];
  palette: [string, string];
  symbol: string;
};

export type CompanionState = {
  selectedCompanionId: string;
  nickname: string;
  evolutionStage: number;
  happiness: number;
  energy: number;
  mood: CompanionMood;
  lastReaction: string;
  idleAnimation: CompanionAnimation;
  unlockedAccessories: string[];
  unlockedRoomItems: RoomItem[];
};

export type WellnessProgress = {
  streakDays: number;
  totalHealthyMeals: number;
  evolutionPoints: number;
  lastCheckInDate: string;
};

export type CompanionMood = "sleepy" | "calm" | "proud" | "glowing" | "excited";

export type CompanionAnimation = "breathing" | "sparkle" | "sway" | "sleepyFloat";

export type CheckInMood = "calm" | "tired" | "motivated" | "anxious" | "cozy" | "emotional" | "confident" | "lowEnergy" | "hopeful";

export type CheckInRecord = {
  id: string;
  date: string;
  mood: CheckInMood;
  ritual: string;
  glowPoints: number;
  createdAt: number;
};

export type DailyCheckInState = {
  lastCheckInDate: string;
  todayMood?: CheckInMood;
  todayRitual?: string;
  history: CheckInRecord[];
};

export type BedtimeWindDownRecord = {
  id: string;
  date: string;
  completedCozySections: number;
  glowSummary: string;
  tomorrowHook: string;
  createdAt: number;
};

export type BedtimeWindDownState = {
  lastWindDownDate: string;
  history: BedtimeWindDownRecord[];
};

export type DailyCozyPlan = {
  date: string;
  mood: CheckInMood;
  tinyRitual: string;
  foodSuggestion: string;
  rewardTarget: string;
  accentLabel: string;
};

export type CozyPlanSectionId = "tinyRitual" | "foodSuggestion" | "rewardTarget";

export type CozyPlanProgressState = {
  date: string;
  completedSections: CozyPlanSectionId[];
  cozyDayBonusClaimed: boolean;
  lastCompletedSection?: CozyPlanSectionId;
  lastCompletionMessage?: string;
};

export type GentleMission = {
  id: string;
  title: string;
  subtitle: string;
  kind: "water" | "protein" | "sleep" | "walk" | "drink" | "nourish";
  glowPoints: number;
  happinessBoost: number;
  energyBoost: number;
  roomRewardId?: string;
};

export type DailyMissionState = {
  date: string;
  completedMissionIds: string[];
};

export type RoomItem = {
  id: string;
  name: string;
  type: "plant" | "lamp" | "shelf" | "theme" | "furniture" | "glow";
  unlockedAt: number;
};

export type FeedItem = {
  id: string;
  title: string;
  subtitle: string;
  kind: "meal" | "streak" | "restaurant" | "mission" | "room" | "recovery";
  createdAt: number;
};

export type MemoryKind = "mood" | "cozy" | "room" | "growth" | "night" | "return" | "milestone";

export type EmotionalMemory = {
  id: string;
  kind: MemoryKind;
  title: string;
  body: string;
  date: string;
  createdAt: number;
  accentColors: [string, string];
  companionReaction?: string;
};

export type CompanionDialogueMoment = "dailyOpen" | "cozyCompletion" | "bedtime" | "memory" | "return";

export type CompanionDialogueLine = {
  id: string;
  moment: CompanionDialogueMoment;
  text: string;
  createdAt: number;
  memoryId?: string;
};

export type CompanionDialogueState = {
  recentLineIds: string[];
  lastLine?: CompanionDialogueLine;
  lastDailyOpenDate?: string;
};

export type ScanResult = {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  confidence: number;
};

export type BodyEvolutionSnapshot = {
  archetype: Companion["bodyArchetype"];
  stage: number;
  toneLabel: string;
  beforeLabel: string;
  afterLabel: string;
  calorieGap: number;
  proteinProgress: number;
  calorieProgress: number;
  visualScore: number;
  encouragement: string;
};
