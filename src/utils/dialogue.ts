import {
  CheckInMood,
  CompanionDialogueLine,
  CompanionDialogueMoment,
  CompanionDialogueState,
  CompanionState,
  EmotionalMemory,
  WellnessProgress
} from "../types";
import { getTodayKey } from "./wellness";

export type DialogueContext = {
  moment: CompanionDialogueMoment;
  companionState: CompanionState;
  todayMood?: CheckInMood;
  memories: EmotionalMemory[];
  wellnessProgress: WellnessProgress;
  hour?: number;
};

type DialogueCandidate = {
  id: string;
  text: string;
  memoryId?: string;
};

const moodDialogue: Partial<Record<CheckInMood, DialogueCandidate[]>> = {
  tired: [
    { id: "mood-tired-1", text: "您最近好像有點疲倦，我很高興您今晚回來了。" },
    { id: "mood-tired-2", text: "今天可以很小很慢，也仍然很好。" }
  ],
  anxious: [
    { id: "mood-anxious-1", text: "今天我們一起保持溫柔就好。" },
    { id: "mood-anxious-2", text: "房間可以安靜地陪您一會兒。" }
  ],
  hopeful: [{ id: "mood-hopeful-1", text: "今天已經感覺柔和了一點。" }],
  cozy: [{ id: "mood-cozy-1", text: "這個小角落像是為今天準備好的。" }],
  motivated: [{ id: "mood-motivated-1", text: "我感覺到您今天有一點明亮的節奏。" }],
  lowEnergy: [{ id: "mood-low-energy-1", text: "低能量的日子，也值得有溫暖的位置停靠。" }]
};

function getTimeDialogue(hour: number): DialogueCandidate {
  if (hour >= 22 || hour <= 4) {
    return { id: "time-late-night", text: "房間現在更安靜了。我們不需要做很多事情。" };
  }

  if (hour < 11) {
    return { id: "time-morning", text: "我為今天保留了一個溫柔的開始。" };
  }

  if (hour >= 18) {
    return { id: "time-evening", text: "謝謝您回到這個小空間。" };
  }

  return { id: "time-midday", text: "一個很小的停頓，也可以改變今天的感覺。" };
}

function getRoomDialogue(companionState: CompanionState): DialogueCandidate | null {
  const latestRoomItem = companionState.unlockedRoomItems[0];

  if (!latestRoomItem) {
    return null;
  }

  if (latestRoomItem.type === "plant") {
    return { id: `room-${latestRoomItem.id}`, text: "最近植物讓房間感覺更平靜。" };
  }

  if (latestRoomItem.type === "lamp" || latestRoomItem.type === "glow") {
    return { id: `room-${latestRoomItem.id}`, text: "我們的房間最近變得更溫暖。" };
  }

  return { id: `room-${latestRoomItem.id}`, text: "這個角落現在更像是我們的小空間。" };
}

function getMemoryDialogue(memories: EmotionalMemory[]): DialogueCandidate | null {
  const memory = memories.find((item) => item.companionReaction);

  if (!memory) {
    return null;
  }

  return {
    id: `memory-${memory.id}`,
    text: `還記得「${memory.title}」嗎？`,
    memoryId: memory.id
  };
}

function getStreakDialogue(wellnessProgress: WellnessProgress): DialogueCandidate | null {
  if (wellnessProgress.streakDays >= 7) {
    return { id: `streak-${wellnessProgress.streakDays}`, text: "謝謝您又和我一起度過一個柔和的日子。" };
  }

  return null;
}

export function chooseCompanionDialogue(context: DialogueContext, state: CompanionDialogueState): CompanionDialogueLine | null {
  const hour = context.hour ?? new Date().getHours();
  const candidates: DialogueCandidate[] = [];

  if (context.moment === "memory") {
    const memoryDialogueLine = getMemoryDialogue(context.memories);
    if (memoryDialogueLine) candidates.push(memoryDialogueLine);
  }

  if (context.todayMood) {
    candidates.push(...(moodDialogue[context.todayMood] ?? []));
  }

  const roomDialogue = getRoomDialogue(context.companionState);
  if (roomDialogue) candidates.push(roomDialogue);

  const streakDialogue = getStreakDialogue(context.wellnessProgress);
  if (streakDialogue) candidates.push(streakDialogue);

  candidates.push(getTimeDialogue(hour));

  const nonRepeated = candidates.find((candidate) => !state.recentLineIds.includes(candidate.id)) ?? candidates[0];

  if (!nonRepeated) {
    return null;
  }

  return {
    id: nonRepeated.id,
    moment: context.moment,
    text: nonRepeated.text,
    createdAt: Date.now(),
    memoryId: nonRepeated.memoryId
  };
}

export function applyDialogueLine(state: CompanionDialogueState, line: CompanionDialogueLine): CompanionDialogueState {
  return {
    lastLine: line,
    recentLineIds: [line.id, ...state.recentLineIds.filter((id) => id !== line.id)].slice(0, 8),
    lastDailyOpenDate: line.moment === "dailyOpen" ? getTodayKey() : state.lastDailyOpenDate
  };
}
