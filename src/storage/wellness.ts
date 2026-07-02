import { useCallback, useEffect, useRef, useState } from "react";
import {
  BedtimeWindDownState,
  CheckInMood,
  Companion,
  CompanionState,
  CozyPlanProgressState,
  CozyPlanSectionId,
  DailyCheckInState,
  DailyMissionState,
  GentleMission,
  MealLog,
  Restaurant,
  WellnessProgress
} from "../types";
import {
  applyBedtimeWindDown,
  applyDailyCheckIn,
  applyCozyPlanSectionCompletion,
  applyMealProgress,
  applyMissionCompletion,
  createDailyMissionState,
  createCozyPlanProgressState,
  createInitialCompanionState,
  defaultBedtimeWindDownState,
  defaultWellnessProgress,
  defaultDailyCheckInState,
  normalizeCompanionState,
  normalizeCozyPlanProgressState,
  normalizeDailyMissionState
} from "../utils/wellness";
import { loadData, saveData } from "./storage";

const companionStateKey = "calorie-map:companion-state";
const wellnessProgressKey = "calorie-map:wellness-progress";
const dailyMissionStateKey = "calorie-map:daily-mission-state";
const dailyCheckInStateKey = "calorie-map:daily-check-in-state";
const cozyPlanProgressStateKey = "calorie-map:cozy-plan-progress-state";
const bedtimeWindDownStateKey = "calorie-map:bedtime-wind-down-state";

export async function loadCompanionState(): Promise<CompanionState | null> {
  return loadData<CompanionState>(companionStateKey);
}

export async function saveCompanionState(companionState: CompanionState): Promise<void> {
  await saveData(companionStateKey, companionState);
}

export async function loadWellnessProgress(): Promise<WellnessProgress | null> {
  return loadData<WellnessProgress>(wellnessProgressKey);
}

export async function saveWellnessProgress(wellnessProgress: WellnessProgress): Promise<void> {
  await saveData(wellnessProgressKey, wellnessProgress);
}

export async function loadDailyMissionState(): Promise<DailyMissionState | null> {
  return loadData<DailyMissionState>(dailyMissionStateKey);
}

export async function saveDailyMissionState(dailyMissionState: DailyMissionState): Promise<void> {
  await saveData(dailyMissionStateKey, dailyMissionState);
}

export async function loadDailyCheckInState(): Promise<DailyCheckInState | null> {
  return loadData<DailyCheckInState>(dailyCheckInStateKey);
}

export async function saveDailyCheckInState(dailyCheckInState: DailyCheckInState): Promise<void> {
  await saveData(dailyCheckInStateKey, dailyCheckInState);
}

export async function loadCozyPlanProgressState() {
  return loadData<CozyPlanProgressState>(cozyPlanProgressStateKey);
}

export async function saveCozyPlanProgressState(cozyPlanProgressState: CozyPlanProgressState): Promise<void> {
  await saveData(cozyPlanProgressStateKey, cozyPlanProgressState);
}

export async function loadBedtimeWindDownState(): Promise<BedtimeWindDownState | null> {
  return loadData<BedtimeWindDownState>(bedtimeWindDownStateKey);
}

export async function saveBedtimeWindDownState(bedtimeWindDownState: BedtimeWindDownState): Promise<void> {
  await saveData(bedtimeWindDownStateKey, bedtimeWindDownState);
}

export function useWellnessState() {
  const [companionState, setCompanionState] = useState<CompanionState | null>(null);
  const [wellnessProgress, setWellnessProgress] = useState<WellnessProgress>(defaultWellnessProgress);
  const [dailyMissionState, setDailyMissionState] = useState<DailyMissionState>(createDailyMissionState());
  const [dailyCheckInState, setDailyCheckInState] = useState<DailyCheckInState>(defaultDailyCheckInState);
  const [cozyPlanProgressState, setCozyPlanProgressState] = useState(createCozyPlanProgressState());
  const [bedtimeWindDownState, setBedtimeWindDownState] = useState<BedtimeWindDownState>(defaultBedtimeWindDownState);
  const [isHydrated, setIsHydrated] = useState(false);
  const hasHydrated = useRef(false);

  useEffect(() => {
    let isMounted = true;

    async function hydrateWellnessState() {
      const [
        storedCompanionState,
        storedWellnessProgress,
        storedDailyMissionState,
        storedDailyCheckInState,
        storedCozyPlanProgressState,
        storedBedtimeWindDownState
      ] = await Promise.all([
        loadCompanionState(),
        loadWellnessProgress(),
        loadDailyMissionState(),
        loadDailyCheckInState(),
        loadCozyPlanProgressState(),
        loadBedtimeWindDownState()
      ]);

      if (!isMounted) {
        return;
      }

      setCompanionState(normalizeCompanionState(storedCompanionState));
      setWellnessProgress(storedWellnessProgress ?? defaultWellnessProgress);
      setDailyMissionState(normalizeDailyMissionState(storedDailyMissionState));
      setDailyCheckInState(storedDailyCheckInState ?? defaultDailyCheckInState);
      setCozyPlanProgressState(normalizeCozyPlanProgressState(storedCozyPlanProgressState));
      setBedtimeWindDownState(storedBedtimeWindDownState ?? defaultBedtimeWindDownState);
      hasHydrated.current = true;
      setIsHydrated(true);
    }

    hydrateWellnessState();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!hasHydrated.current || !companionState) {
      return;
    }

    saveCompanionState(companionState);
  }, [companionState]);

  useEffect(() => {
    if (!hasHydrated.current) {
      return;
    }

    saveWellnessProgress(wellnessProgress);
  }, [wellnessProgress]);

  useEffect(() => {
    if (!hasHydrated.current) {
      return;
    }

    saveDailyMissionState(dailyMissionState);
  }, [dailyMissionState]);

  useEffect(() => {
    if (!hasHydrated.current) {
      return;
    }

    saveDailyCheckInState(dailyCheckInState);
  }, [dailyCheckInState]);

  useEffect(() => {
    if (!hasHydrated.current) {
      return;
    }

    saveCozyPlanProgressState(cozyPlanProgressState);
  }, [cozyPlanProgressState]);

  useEffect(() => {
    if (!hasHydrated.current) {
      return;
    }

    saveBedtimeWindDownState(bedtimeWindDownState);
  }, [bedtimeWindDownState]);

  const chooseCompanion = useCallback((companion: Companion, nickname: string) => {
    setCompanionState(createInitialCompanionState(companion, nickname));
    setWellnessProgress(defaultWellnessProgress);
    setDailyMissionState(createDailyMissionState());
    setDailyCheckInState(defaultDailyCheckInState);
    setCozyPlanProgressState(createCozyPlanProgressState());
    setBedtimeWindDownState(defaultBedtimeWindDownState);
  }, []);

  const recordMealProgress = useCallback(
    (mealLog: MealLog, restaurant?: Restaurant) => {
      if (!companionState) {
        return;
      }

      const next = applyMealProgress({
        companionState,
        wellnessProgress,
        mealLog,
        restaurant
      });
      setCompanionState(next.companionState);
      setWellnessProgress(next.wellnessProgress);
    },
    [companionState, wellnessProgress]
  );

  const completeMission = useCallback(
    (mission: GentleMission) => {
      if (!companionState || dailyMissionState.completedMissionIds.includes(mission.id)) {
        return;
      }

      const next = applyMissionCompletion({
        companionState,
        wellnessProgress,
        mission
      });
      setCompanionState(next.companionState);
      setWellnessProgress(next.wellnessProgress);
      setDailyMissionState((current) => ({
        ...current,
        completedMissionIds: [...current.completedMissionIds, mission.id]
      }));
    },
    [companionState, dailyMissionState.completedMissionIds, wellnessProgress]
  );

  const completeDailyCheckIn = useCallback(
    (mood: CheckInMood) => {
      if (!companionState) {
        return;
      }

      const next = applyDailyCheckIn({
        companionState,
        wellnessProgress,
        dailyCheckInState,
        mood
      });

      setCompanionState(next.companionState);
      setWellnessProgress(next.wellnessProgress);
      setDailyCheckInState(next.dailyCheckInState);
    },
    [companionState, dailyCheckInState, wellnessProgress]
  );

  const completeCozyPlanSection = useCallback(
    (sectionId: CozyPlanSectionId) => {
      if (!companionState) {
        return;
      }

      const next = applyCozyPlanSectionCompletion({
        companionState,
        wellnessProgress,
        progressState: cozyPlanProgressState,
        sectionId
      });

      setCompanionState(next.companionState);
      setWellnessProgress(next.wellnessProgress);
      setCozyPlanProgressState(next.progressState);
    },
    [companionState, cozyPlanProgressState, wellnessProgress]
  );

  const completeBedtimeWindDown = useCallback(() => {
    if (!companionState) {
      return;
    }

    const next = applyBedtimeWindDown({
      companionState,
      bedtimeWindDownState,
      cozyPlanProgressState
    });

    setCompanionState(next.companionState);
    setBedtimeWindDownState(next.bedtimeWindDownState);
  }, [bedtimeWindDownState, companionState, cozyPlanProgressState]);

  return {
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
    isHydrated
  };
}
