import { CheckInMood, Companion, CozyPlanSectionId, EmotionalMemory, MemoryKind, RoomItem } from "../types";
import { getTodayKey } from "./wellness";

const memoryColors: Record<MemoryKind, [string, string]> = {
  mood: ["#FCE7F3", "#DBEAFE"],
  cozy: ["#FFF7ED", "#FBCFE8"],
  room: ["#FEF3C7", "#FCE7F3"],
  growth: ["#BBF7D0", "#DDD6FE"],
  night: ["#312E81", "#7C2D12"],
  return: ["#E0E7FF", "#FDE68A"],
  milestone: ["#FDE68A", "#F9A8D4"]
};

const moodLabels: Record<CheckInMood, string> = {
  calm: "平靜",
  tired: "疲倦",
  motivated: "有動力",
  anxious: "有點不安",
  cozy: "想舒服一點",
  emotional: "有情緒",
  confident: "有信心",
  lowEnergy: "低能量",
  hopeful: "有一點期待"
};

const sectionTitles: Record<CozyPlanSectionId, string> = {
  tinyRitual: "你完成了一個小小儀式",
  foodSuggestion: "你選擇了滋養自己",
  rewardTarget: "房間變得更暖了一點"
};

export function createMemory(input: {
  kind: MemoryKind;
  title: string;
  body: string;
  companionReaction?: string;
  date?: string;
}): EmotionalMemory {
  const date = input.date ?? getTodayKey();

  return {
    id: `memory-${input.kind}-${Date.now()}`,
    kind: input.kind,
    title: input.title,
    body: input.body,
    date,
    createdAt: Date.now(),
    accentColors: memoryColors[input.kind],
    companionReaction: input.companionReaction
  };
}

export function createMoodMemory(mood: CheckInMood, companionName: string): EmotionalMemory {
  return createMemory({
    kind: "mood",
    title: `你今日選擇了「${moodLabels[mood]}」`,
    body: `${companionName} 安靜記住了你今日的心情，並為你留下一個溫柔開始。`,
    companionReaction: "這個早晨，我有陪著你。"
  });
}

export function createFirstCompanionMemory(companion: Companion, nickname: string): EmotionalMemory {
  return createMemory({
    kind: "milestone",
    title: `${nickname} 第一次來到你的小空間`,
    body: `這是你和 ${nickname} 一起開始的地方。不是一個目標，而是一個會慢慢長大的溫柔世界。`,
    companionReaction: "我記得我們第一次見面的日子。"
  });
}

export function createComebackMemory(companionName: string): EmotionalMemory {
  return createMemory({
    kind: "return",
    title: "你輕輕回來了",
    body: `${companionName} 沒有問你去了哪裡，只是把房間的燈重新打開。`,
    companionReaction: "您的小空間一直在等您。"
  });
}

export function createCozyPlanMemory(sectionId: CozyPlanSectionId, companionName: string): EmotionalMemory {
  return createMemory({
    kind: "cozy",
    title: sectionTitles[sectionId],
    body: `這不是任務，只是一個你和 ${companionName} 共同保留下來的小小照顧。`,
    companionReaction: "這是很溫柔的一小步。"
  });
}

export function createRoomMemory(roomItem: RoomItem, companionName: string): EmotionalMemory {
  return createMemory({
    kind: "room",
    title: `${roomItem.name} 被放進了小房間`,
    body: `${companionName} 的空間多了一點柔光，看起來更像你們一起生活過的地方。`,
    companionReaction: "我們的房間今天變得更溫暖。"
  });
}

export function createCozyDayBonusMemory(companionName: string): EmotionalMemory {
  return createMemory({
    kind: "room",
    title: "柔和日的光亮起來",
    body: `你和 ${companionName} 把今日三個小小照顧都收好了，房間像被月光輕輕蓋住。`,
    companionReaction: "我們的房間已經暖起來了一點。"
  });
}

export function createGrowthMemory(stage: number, companionName: string): EmotionalMemory {
  return createMemory({
    kind: "growth",
    title: `${companionName} 長大到 Lv.${stage}`,
    body: "不是因為完美，而是因為你一次次回來，慢慢照顧自己。",
    companionReaction: "我正在和您一起成長。"
  });
}

export function createBedtimeMemory(companionName: string): EmotionalMemory {
  return createMemory({
    kind: "night",
    title: "你們一起把今天輕輕收好",
    body: `${companionName} 在睡前記住了這個安靜晚上，明天的小空間還會等你。`,
    companionReaction: "明天也會為您保留一個安靜時刻。"
  });
}

export function createMilestoneMemory(streakDays: number, companionName: string): EmotionalMemory | null {
  if (![7, 30, 100].includes(streakDays)) {
    return null;
  }

  return createMemory({
    kind: "milestone",
    title: `您的柔光連續紀錄來到 ${streakDays} 天`,
    body: `${companionName} 沒有把它當成壓力，只把它當成你溫柔回來的證明。`,
    companionReaction: "還記得我們一起回來的那些日子嗎？"
  });
}
