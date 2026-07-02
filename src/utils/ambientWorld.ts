import { CheckInMood, CompanionState, RoomItem, WellnessProgress } from "../types";

export type AmbientTimePhase = "morning" | "afternoon" | "night" | "lateNight";

export type AmbientWorldTheme = {
  phase: AmbientTimePhase;
  gradient: [string, string, string];
  glowColor: string;
  particleColor: string;
  particleCount: number;
  animationDuration: number;
  dimOverlay: number;
  warmth: number;
};

export function getAmbientTimePhase(hour = new Date().getHours()): AmbientTimePhase {
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 20) return "afternoon";
  if (hour >= 20 && hour < 24) return "night";
  return "lateNight";
}

function getBaseTheme(phase: AmbientTimePhase): AmbientWorldTheme {
  const themes: Record<AmbientTimePhase, AmbientWorldTheme> = {
    morning: {
      phase,
      gradient: ["#FFF7ED", "#FCE7F3", "#DBEAFE"],
      glowColor: "rgba(253, 186, 116, 0.28)",
      particleColor: "rgba(255,255,255,0.52)",
      particleCount: 5,
      animationDuration: 4200,
      dimOverlay: 0,
      warmth: 0.42
    },
    afternoon: {
      phase,
      gradient: ["#F8FAFC", "#FEF3C7", "#FCE7F3"],
      glowColor: "rgba(251, 191, 36, 0.20)",
      particleColor: "rgba(255,255,255,0.42)",
      particleCount: 4,
      animationDuration: 5200,
      dimOverlay: 0,
      warmth: 0.34
    },
    night: {
      phase,
      gradient: ["#1E1B4B", "#312E81", "#7C2D12"],
      glowColor: "rgba(253, 230, 138, 0.24)",
      particleColor: "rgba(253,230,138,0.55)",
      particleCount: 4,
      animationDuration: 6800,
      dimOverlay: 0.08,
      warmth: 0.22
    },
    lateNight: {
      phase,
      gradient: ["#020617", "#111827", "#312E81"],
      glowColor: "rgba(191, 219, 254, 0.18)",
      particleColor: "rgba(219,234,254,0.38)",
      particleCount: 3,
      animationDuration: 8200,
      dimOverlay: 0.16,
      warmth: 0.12
    }
  };

  return themes[phase];
}

export function createAmbientWorldTheme({
  mood,
  companionState,
  wellnessProgress,
  roomItems,
  hour
}: {
  mood?: CheckInMood;
  companionState: CompanionState;
  wellnessProgress: WellnessProgress;
  roomItems: RoomItem[];
  hour?: number;
}): AmbientWorldTheme {
  const phase = getAmbientTimePhase(hour);
  const base = getBaseTheme(phase);
  const streakWarmth = Math.min(wellnessProgress.streakDays * 0.025, 0.22);
  const roomGlow = Math.min(roomItems.length * 0.025, 0.18);
  const moodCalm = mood === "anxious" || mood === "tired" || mood === "lowEnergy";
  const moodBright = mood === "motivated" || mood === "hopeful" || companionState.mood === "excited";
  const sleepy = companionState.mood === "sleepy";

  return {
    ...base,
    glowColor: roomItems.some((item) => item.type === "lamp" || item.type === "glow") ? "rgba(253, 230, 138, 0.34)" : base.glowColor,
    particleCount: Math.max(2, base.particleCount + (moodBright ? 1 : 0) + (roomItems.some((item) => item.type === "plant") ? 1 : 0) - (sleepy ? 1 : 0)),
    animationDuration: moodCalm || sleepy ? base.animationDuration + 1800 : moodBright ? base.animationDuration - 900 : base.animationDuration,
    dimOverlay: sleepy ? base.dimOverlay + 0.08 : base.dimOverlay,
    warmth: Math.min(base.warmth + streakWarmth + roomGlow, 0.78)
  };
}
