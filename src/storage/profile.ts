import { useCallback, useEffect, useRef, useState } from "react";
import { UserProfile } from "../types";
import { loadData, saveData } from "./storage";

const profileKey = "calorie-map:user-profile";

export const defaultProfile: UserProfile = {
  dailyCalories: 1800,
  proteinGoal: 100,
  carbsGoal: 180,
  fatGoal: 56,
  goalType: "cut",
  language: "zh-Hant",
  setupCompleted: false
};

export async function loadUserProfile(): Promise<UserProfile | null> {
  return loadData<UserProfile>(profileKey);
}

export async function saveUserProfile(profile: UserProfile): Promise<void> {
  await saveData(profileKey, profile);
}

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [isHydrated, setIsHydrated] = useState(false);
  const hasHydrated = useRef(false);

  useEffect(() => {
    let isMounted = true;

    async function hydrateProfile() {
      const storedProfile = await loadUserProfile();

      if (!isMounted) {
        return;
      }

      if (storedProfile) {
        setProfile(storedProfile);
      }

      hasHydrated.current = true;
      setIsHydrated(true);
    }

    hydrateProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!hasHydrated.current) {
      return;
    }

    saveUserProfile(profile);
  }, [profile]);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setProfile((current) => ({
      ...current,
      ...updates
    }));
  }, []);

  return {
    profile,
    updateProfile,
    isHydrated
  };
}
