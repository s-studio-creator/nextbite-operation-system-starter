import { StatusBar } from "expo-status-bar";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { Heart, Home, Images, MapPin } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import { Alert, Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { demoScanResults, gentleMissions, localFeedItems, restaurants, starterCompanions, starterMeals } from "./src/data";
import { AuthOnboardingScreen } from "./src/screens/AuthOnboardingScreen";
import { CompanionOnboardingScreen } from "./src/screens/CompanionOnboardingScreen";
import { HomeScreen } from "./src/screens/HomeScreen";
import { BedtimeWindDownCeremony } from "./src/screens/BedtimeWindDownCeremony";
import { DailyCheckInCeremony } from "./src/screens/DailyCheckInCeremony";
import { LogScreen } from "./src/screens/LogScreen";
import { ProfileScreen } from "./src/screens/ProfileScreen";
import { ProfileSetupScreen } from "./src/screens/ProfileSetupScreen";
import { MemoryTimelineScreen } from "./src/screens/MemoryTimelineScreen";
import { RestaurantDetailScreen } from "./src/screens/RestaurantDetailScreen";
import { RestaurantFilter, RestaurantsScreen } from "./src/screens/RestaurantsScreen";
import { ScanScreen } from "./src/screens/ScanScreen";
import { useMealLogs } from "./src/storage/mealLogs";
import { useAuthState } from "./src/storage/auth";
import { useCompanionDialogue } from "./src/storage/dialogue";
import { useEmotionalMemories } from "./src/storage/memories";
import { useUserProfile } from "./src/storage/profile";
import { useSavedRestaurants } from "./src/storage/savedRestaurants";
import { useWellnessState } from "./src/storage/wellness";
import { MealLog, MealType, Restaurant, ScanResult } from "./src/types";
import { MapRegion } from "./types/map";
import {
  createBedtimeMemory,
  createComebackMemory,
  createCozyDayBonusMemory,
  createCozyPlanMemory,
  createFirstCompanionMemory,
  createGrowthMemory,
  createMilestoneMemory,
  createMoodMemory,
  createRoomMemory
} from "./src/utils/memories";
import { aggregateMealLogs, buildMealLog } from "./src/utils/nutrition";
import { pointsPerEvolutionStage, shouldShowBedtimeWindDown, shouldShowDailyCheckIn } from "./src/utils/wellness";

type Route = "home" | "scan" | "restaurants" | "log" | "memories" | "profile";
type PrimaryTab = "home" | "restaurants" | "memories" | "profile";

const tabs: { id: PrimaryTab; label: string; Icon: typeof Home }[] = [
  { id: "home", label: "世界", Icon: Home },
  { id: "restaurants", label: "城市", Icon: MapPin },
  { id: "memories", label: "回憶", Icon: Images },
  { id: "profile", label: "我的", Icon: Heart }
];

const defaultRegion: MapRegion = {
  latitude: 22.2855,
  longitude: 114.1577,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08
};

export default function App() {
  const [activeTab, setActiveTab] = useState<Route>("home");
  const [detailRestaurant, setDetailRestaurant] = useState<Restaurant | null>(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant>(restaurants[0]);
  const [search, setSearch] = useState("");
  const [restaurantFilter, setRestaurantFilter] = useState<RestaurantFilter>("全部");
  const [scanMealType, setScanMealType] = useState<MealType>("dinner");
  const [scanImage, setScanImage] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<ScanResult>(demoScanResults[0]);
  const [region, setRegion] = useState<MapRegion>(defaultRegion);
  const [locationNote, setLocationNote] = useState("正在顯示香港中環附近餐廳");

  const { authState, connect, isHydrated: isAuthHydrated } = useAuthState();
  const { mealLogs, addMealLog, deleteMealLog, isHydrated: areMealLogsHydrated } = useMealLogs(starterMeals);
  const { dialogueState, surfaceDialogue, isHydrated: isDialogueHydrated } = useCompanionDialogue();
  const { filteredMemories, memories, activeFilter, setActiveFilter, addMemory, addMemories, isHydrated: areMemoriesHydrated } = useEmotionalMemories();
  const { profile, updateProfile, isHydrated: isProfileHydrated } = useUserProfile();
  const { savedRestaurants, savedRestaurantIds, isRestaurantSaved, toggleSavedRestaurant, isHydrated: areSavedRestaurantsHydrated } =
    useSavedRestaurants();
  const {
    companionState,
    wellnessProgress,
    dailyMissionState,
    dailyCheckInState,
    cozyPlanProgressState,
    bedtimeWindDownState,
    chooseCompanion,
    recordMealProgress,
    completeMission,
    completeDailyCheckIn,
    completeCozyPlanSection,
    completeBedtimeWindDown,
    isHydrated: isWellnessHydrated
  } = useWellnessState();

  const totals = useMemo(() => aggregateMealLogs(mealLogs), [mealLogs]);
  const appIsHydrated =
    isAuthHydrated && areMealLogsHydrated && areSavedRestaurantsHydrated && isProfileHydrated && isWellnessHydrated && areMemoriesHydrated && isDialogueHydrated;
  const showDailyCeremony = appIsHydrated && companionState !== null && shouldShowDailyCheckIn(dailyCheckInState);
  const showBedtimeCeremony =
    appIsHydrated &&
    companionState !== null &&
    !showDailyCeremony &&
    shouldShowBedtimeWindDown({ state: bedtimeWindDownState, checkInState: dailyCheckInState });

  const filteredRestaurants = useMemo(
    () =>
      restaurants
        .filter((restaurant) => {
          const value = `${restaurant.name} ${restaurant.district} ${restaurant.cuisine} ${restaurant.highlights.join(" ")}`.toLowerCase();
          return value.includes(search.toLowerCase());
        })
        .filter((restaurant) => {
          if (restaurantFilter === "全部") return true;
          if (restaurantFilter === "低卡") return restaurant.menu.some((dish) => dish.calories <= 430);
          if (restaurantFilter === "高蛋白") return restaurant.menu.some((dish) => (dish.protein ?? 0) >= 34) || restaurant.highlights.includes("高蛋白");
          if (restaurantFilter === "近我") return restaurant.distanceKm <= 3.2;
          if (restaurantFilter === "素食") return restaurant.cuisine === "素食" || restaurant.highlights.some((tag) => tag.includes("素"));
          if (restaurantFilter === "少油") return restaurant.highlights.some((tag) => tag.includes("油"));
          if (restaurantFilter === "$$") return restaurant.price === "$$";
          return true;
        }),
    [restaurantFilter, search]
  );

  const savedRestaurantModels = useMemo(
    () =>
      savedRestaurants
        .map((savedRestaurant) => restaurants.find((restaurant) => restaurant.id === savedRestaurant.id))
        .filter((restaurant): restaurant is Restaurant => restaurant !== undefined),
    [savedRestaurants]
  );

  useEffect(() => {
    if (!appIsHydrated || !companionState || showDailyCeremony || showBedtimeCeremony) {
      return;
    }

    surfaceDialogue("dailyOpen", {
      companionState,
      todayMood: dailyCheckInState.todayMood,
      memories,
      wellnessProgress
    });
  }, [appIsHydrated, companionState, dailyCheckInState.todayMood, memories, showBedtimeCeremony, showDailyCeremony, surfaceDialogue, wellnessProgress]);

  const focusRestaurant = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setRegion({
      latitude: restaurant.latitude,
      longitude: restaurant.longitude,
      latitudeDelta: 0.025,
      longitudeDelta: 0.025
    });
  };

  const openRestaurant = (restaurant: Restaurant) => {
    focusRestaurant(restaurant);
    setDetailRestaurant(restaurant);
  };

  const saveMealLog = (mealLog: MealLog) => {
    addMealLog(mealLog);
    recordMealProgress(mealLog, restaurants.find((restaurant) => restaurant.id === mealLog.restaurantId));
    setDetailRestaurant(null);
    setActiveTab("log");
  };

  const addScanMeal = () => {
    const mealLog = buildMealLog({
      mealType: scanMealType,
      dishes: [
        {
          dishId: "scan",
          name: scanResult.name,
          portionMultiplier: 1,
          calories: scanResult.calories,
          protein: scanResult.protein,
          carbs: scanResult.carbs,
          fat: scanResult.fat
        }
      ]
    });

    addMealLog(mealLog);
    recordMealProgress(mealLog);
    setActiveTab("log");
  };

  const chooseCompanionWithMemory = (companion: Parameters<typeof chooseCompanion>[0], nickname: string) => {
    chooseCompanion(companion, nickname);
    addMemory(createFirstCompanionMemory(companion, nickname.trim() || companion.name));
  };

  const isSoftComeback = () => {
    if (!dailyCheckInState.lastCheckInDate) {
      return false;
    }

    const lastCheckInTime = new Date(`${dailyCheckInState.lastCheckInDate}T00:00:00`).getTime();
    const todayTime = new Date(new Date().toISOString().slice(0, 10)).getTime();
    const daysSinceLastCheckIn = Math.round((todayTime - lastCheckInTime) / (1000 * 60 * 60 * 24));

    return daysSinceLastCheckIn > 1;
  };

  const completeCheckInWithMemory = (mood: Parameters<typeof completeDailyCheckIn>[0]) => {
    const wasComeback = isSoftComeback();
    completeDailyCheckIn(mood);
    if (companionState) {
      const nextMemories = [createMoodMemory(mood, companionState.nickname)];

      if (wasComeback) {
        nextMemories.push(createComebackMemory(companionState.nickname));
      }

      const milestoneMemory = createMilestoneMemory(wellnessProgress.streakDays + 1, companionState.nickname);
      if (milestoneMemory) {
        nextMemories.push(milestoneMemory);
      }

      addMemories(nextMemories);
    }
  };

  const completeCozyPlanSectionWithMemory = (sectionId: Parameters<typeof completeCozyPlanSection>[0]) => {
    const willCompleteCozyDay = cozyPlanProgressState.completedSections.length === 2 && !cozyPlanProgressState.completedSections.includes(sectionId);
    const sectionPoints = sectionId === "tinyRitual" ? 14 : sectionId === "foodSuggestion" ? 18 : 22;
    const estimatedGain = sectionPoints + (willCompleteCozyDay ? 30 : 0);
    const estimatedNextStage = Math.floor((wellnessProgress.evolutionPoints + estimatedGain) / pointsPerEvolutionStage) + 1;
    completeCozyPlanSection(sectionId);

    if (companionState) {
      const nextMemories = [createCozyPlanMemory(sectionId, companionState.nickname)];

      if (willCompleteCozyDay) {
        const glowRoomItem = {
          id: `cozy-day-glow-${cozyPlanProgressState.date}`,
          name: "柔和日柔光",
          type: "glow" as const,
          unlockedAt: Date.now()
        };
        nextMemories.push(createCozyDayBonusMemory(companionState.nickname), createRoomMemory(glowRoomItem, companionState.nickname));
      }

      if (estimatedNextStage > companionState.evolutionStage) {
        nextMemories.push(createGrowthMemory(estimatedNextStage, companionState.nickname));
      }

      addMemories(nextMemories);
      surfaceDialogue("cozyCompletion", {
        companionState,
        todayMood: dailyCheckInState.todayMood,
        memories,
        wellnessProgress
      });
    }
  };

  const completeBedtimeWithMemory = () => {
    completeBedtimeWindDown();
    if (companionState) {
      addMemory(createBedtimeMemory(companionState.nickname));
      surfaceDialogue("bedtime", {
        companionState,
        todayMood: dailyCheckInState.todayMood,
        memories,
        wellnessProgress
      });
    }
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("需要相簿權限", "開啟權限後，便可以使用餐點影像估算功能。");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8
    });

    if (!result.canceled) {
      setScanImage(result.assets[0].uri);
      setScanResult(demoScanResults[Math.floor(Math.random() * demoScanResults.length)]);
    }
  };

  const useCurrentLocation = async () => {
    const permission = await Location.requestForegroundPermissionsAsync();
    if (!permission.granted) {
      setLocationNote("未開定位，暫時顯示中環附近餐廳");
      return;
    }

    const current = await Location.getCurrentPositionAsync({});
    setRegion({
      latitude: current.coords.latitude,
      longitude: current.coords.longitude,
      latitudeDelta: 0.08,
      longitudeDelta: 0.08
    });
    setLocationNote("已使用您目前的位置顯示地圖");
  };

  const renderActiveScreen = () => {
    if (!appIsHydrated) {
      return (
        <View style={styles.loadingScreen}>
          <Text style={styles.loadingText}>正在準備您的健康夥伴...</Text>
        </View>
      );
    }

    if (!authState.connected) {
      return <AuthOnboardingScreen onConnect={connect} />;
    }

    if (!profile.setupCompleted) {
      return (
        <View style={styles.fullScreen}>
          <ProfileSetupScreen profile={profile} onComplete={updateProfile} />
        </View>
      );
    }

    if (!companionState) {
      return <CompanionOnboardingScreen companions={starterCompanions} onChooseCompanion={chooseCompanionWithMemory} />;
    }

    const companion = starterCompanions.find((item) => item.id === companionState.selectedCompanionId) ?? starterCompanions[0];

    if (showDailyCeremony) {
      return <DailyCheckInCeremony companion={companion} companionState={companionState} onComplete={completeCheckInWithMemory} />;
    }

    if (showBedtimeCeremony) {
      return (
        <BedtimeWindDownCeremony
          companion={companion}
          companionState={companionState}
          cozyPlanProgressState={cozyPlanProgressState}
          onComplete={completeBedtimeWithMemory}
        />
      );
    }

    if (detailRestaurant) {
      return (
        <RestaurantDetailScreen
          restaurant={detailRestaurant}
          isSaved={isRestaurantSaved(detailRestaurant.id)}
          onBack={() => setDetailRestaurant(null)}
          onToggleSaved={() => toggleSavedRestaurant(detailRestaurant.id)}
          onSaveMeal={saveMealLog}
        />
      );
    }

    if (activeTab === "home") {
      return (
        <HomeScreen
          totals={totals}
          profile={profile}
          meals={mealLogs}
          companion={companion}
          companionState={companionState}
          wellnessProgress={wellnessProgress}
          dailyMissionState={dailyMissionState}
          cozyPlanProgressState={cozyPlanProgressState}
          todayMood={dailyCheckInState.todayMood}
          gentleMissions={gentleMissions}
          feedItems={localFeedItems}
          dialogueLine={dialogueState.lastLine}
          isHydrated={appIsHydrated}
          onScan={() => setActiveTab("scan")}
          onRestaurants={() => setActiveTab("restaurants")}
          onCompleteMission={completeMission}
          onCompleteCozyPlanSection={completeCozyPlanSectionWithMemory}
        />
      );
    }

    if (activeTab === "scan") {
      return (
        <ScanScreen
          image={scanImage}
          result={scanResult}
          mealType={scanMealType}
          onPickImage={pickImage}
          onMealTypeChange={setScanMealType}
          onAddMeal={addScanMeal}
        />
      );
    }

    if (activeTab === "restaurants") {
      return (
        <RestaurantsScreen
          restaurants={filteredRestaurants}
          selectedRestaurant={selectedRestaurant}
          region={region}
          locationNote={locationNote}
          search={search}
          activeFilter={restaurantFilter}
          onSearch={setSearch}
          onFilterChange={setRestaurantFilter}
          onLocate={useCurrentLocation}
          onFocusRestaurant={focusRestaurant}
          onOpenRestaurant={openRestaurant}
          isRestaurantSaved={isRestaurantSaved}
          onToggleSavedRestaurant={toggleSavedRestaurant}
        />
      );
    }

    if (activeTab === "log") {
      return <LogScreen meals={mealLogs} totals={totals} dailyCalories={profile.dailyCalories} onDeleteMeal={deleteMealLog} />;
    }

    if (activeTab === "memories") {
      return (
        <MemoryTimelineScreen
          memories={filteredMemories}
          allMemories={memories}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          companionName={companionState.nickname}
          dialogueLine={dialogueState.lastLine}
        />
      );
    }

    return (
      <ProfileScreen
        profile={profile}
        companion={companion}
        companionState={companionState}
        wellnessProgress={wellnessProgress}
        savedRestaurants={savedRestaurantModels}
        savedRestaurantIds={savedRestaurantIds}
        onUpdateProfile={updateProfile}
        onSelectRestaurant={openRestaurant}
        onToggleSavedRestaurant={toggleSavedRestaurant}
      />
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.appShell}>{renderActiveScreen()}</View>
      {appIsHydrated && authState.connected && profile.setupCompleted && companionState && !showDailyCeremony && !showBedtimeCeremony && !detailRestaurant && (
        <View style={styles.tabBar}>
          {tabs.map(({ id, label, Icon }) => {
            const isActive = activeTab === id;
            return (
              <Pressable key={id} style={styles.tabButton} onPress={() => setActiveTab(id)}>
                <Icon size={21} color={isActive ? "#0F766E" : "#6B7280"} strokeWidth={2.4} />
                <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>{label}</Text>
              </Pressable>
            );
          })}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F7F8F4"
  },
  appShell: {
    flex: 1
  },
  fullScreen: {
    flex: 1
  },
  loadingScreen: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    padding: 24
  },
  loadingText: {
    color: "#BE185D",
    fontSize: 17,
    fontWeight: "900"
  },
  tabBar: {
    backgroundColor: "#FFFFFF",
    borderTopColor: "#E5E7EB",
    borderTopWidth: 1,
    bottom: 0,
    flexDirection: "row",
    left: 0,
    paddingBottom: 8,
    paddingTop: 8,
    position: "absolute",
    right: 0
  },
  tabButton: {
    alignItems: "center",
    flex: 1,
    gap: 4,
    justifyContent: "center",
    minHeight: 54
  },
  tabLabel: {
    color: "#6B7280",
    fontSize: 11,
    fontWeight: "800"
  },
  tabLabelActive: {
    color: "#0F766E"
  }
});
