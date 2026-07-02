import { LinearGradient } from "expo-linear-gradient";
import { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { AmbientWorld } from "../components/AmbientWorld";
import { CompanionDialogueBubble } from "../components/CompanionDialogueBubble";
import { CompanionDialogueLine, EmotionalMemory, MemoryKind } from "../types";
import { getAmbientTimePhase } from "../utils/ambientWorld";

const filters: { id: MemoryKind | "all"; label: string }[] = [
  { id: "all", label: "全部" },
  { id: "mood", label: "心情" },
  { id: "cozy", label: "小時刻" },
  { id: "room", label: "房間" },
  { id: "growth", label: "成長" },
  { id: "night", label: "夜晚" },
  { id: "return", label: "回來" },
  { id: "milestone", label: "里程" },
];

export function MemoryTimelineScreen({
  memories,
  allMemories,
  activeFilter,
  companionName,
  dialogueLine,
  onFilterChange,
}: {
  memories: EmotionalMemory[];
  allMemories: EmotionalMemory[];
  activeFilter: MemoryKind | "all";
  companionName: string;
  dialogueLine?: CompanionDialogueLine;
  onFilterChange: (filter: MemoryKind | "all") => void;
}) {
  const resurfacedMemory = allMemories.find((memory) => memory.companionReaction);
  const phase = getAmbientTimePhase();

  const ambientTheme = useMemo(
    () => ({
      phase,
      gradient: ["#FFF7ED", "#FCE7F3", "#E0E7FF"] as [string, string, string],
      glowColor: "rgba(249, 168, 212, 0.26)",
      particleColor: "rgba(255,255,255,0.48)",
      particleCount: 5,
      animationDuration: 6200,
      dimOverlay: 0,
      warmth: 0.46,
    }),
    [phase],
  );

  return (
    <View style={styles.container}>
      <AmbientWorld theme={ambientTheme} />
      <ScrollView contentContainerStyle={styles.screen}>
        <LinearGradient colors={["#FFF7ED", "#FCE7F3", "#E0E7FF"]} style={styles.hero}>
          <View style={styles.heroParticleOne} />
          <View style={styles.heroParticleTwo} />
          <Text style={styles.kicker}>回憶盒</Text>
          <Text style={styles.title}>您和 {companionName} 的小回憶</Text>
          <Text style={styles.copy}>這裡不是紀錄表，而是一個會記得您細小溫柔時刻的地方。</Text>
        </LinearGradient>

        {resurfacedMemory && (
          <View style={styles.rememberCard}>
            <Text style={styles.rememberLabel}>{companionName} 記得</Text>
            <Text style={styles.rememberText}>“{resurfacedMemory.companionReaction}”</Text>
          </View>
        )}

        <CompanionDialogueBubble line={dialogueLine} />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {filters.map((filter) => (
            <Pressable
              key={filter.id}
              style={[styles.filterChip, activeFilter === filter.id && styles.filterChipActive]}
              onPress={() => onFilterChange(filter.id)}
            >
              <Text style={[styles.filterText, activeFilter === filter.id && styles.filterTextActive]}>
                {filter.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {memories.length > 0 ? (
          memories.map((memory) => <MemoryCard key={memory.id} memory={memory} />)
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>回憶盒現在仍然安靜</Text>
            <Text style={styles.copy}>完成每日儀式、柔和計劃或睡前儀式後，小回憶就會慢慢出現。</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function MemoryCard({ memory }: { memory: EmotionalMemory }) {
  return (
    <LinearGradient colors={memory.accentColors} style={styles.memoryCard}>
      <View style={styles.memoryDatePill}>
        <Text style={styles.memoryDate}>{memory.date}</Text>
      </View>
      <Text style={styles.memoryTitle}>{memory.title}</Text>
      <Text style={styles.memoryBody}>{memory.body}</Text>
      {memory.companionReaction && (
        <Text style={styles.memoryReaction}>“{memory.companionReaction}”</Text>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screen: {
    gap: 14,
    padding: 18,
    paddingBottom: 110,
  },
  hero: {
    borderRadius: 28,
    gap: 9,
    overflow: "hidden",
    padding: 20,
    shadowColor: "#F9A8D4",
    shadowOffset: { height: 12, width: 0 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
  },
  heroParticleOne: {
    backgroundColor: "rgba(255,255,255,0.45)",
    borderRadius: 999,
    height: 46,
    position: "absolute",
    right: 18,
    top: 18,
    width: 46,
  },
  heroParticleTwo: {
    backgroundColor: "rgba(255,255,255,0.35)",
    borderRadius: 999,
    bottom: 18,
    height: 28,
    left: 26,
    position: "absolute",
    width: 28,
  },
  kicker: {
    color: "#BE185D",
    fontSize: 13,
    fontWeight: "900",
  },
  title: {
    color: "#111827",
    fontSize: 28,
    fontWeight: "900",
    lineHeight: 34,
  },
  copy: {
    color: "#6B7280",
    fontSize: 15,
    lineHeight: 22,
  },
  rememberCard: {
    backgroundColor: "#FFFFFF",
    borderColor: "#F3E8FF",
    borderRadius: 22,
    borderWidth: 1,
    gap: 6,
    padding: 15,
  },
  rememberLabel: {
    color: "#BE185D",
    fontSize: 12,
    fontWeight: "900",
  },
  rememberText: {
    color: "#111827",
    fontSize: 17,
    fontWeight: "900",
    lineHeight: 24,
  },
  filterRow: {
    gap: 8,
  },
  filterChip: {
    backgroundColor: "#FFFFFF",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  filterChipActive: {
    backgroundColor: "#111827",
  },
  filterText: {
    color: "#6B7280",
    fontSize: 13,
    fontWeight: "900",
  },
  filterTextActive: {
    color: "#FFFFFF",
  },
  memoryCard: {
    borderColor: "rgba(255,255,255,0.8)",
    borderRadius: 24,
    borderWidth: 1,
    gap: 9,
    padding: 17,
    shadowColor: "#C084FC",
    shadowOffset: { height: 8, width: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 18,
  },
  memoryDatePill: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.72)",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  memoryDate: {
    color: "#6B7280",
    fontSize: 12,
    fontWeight: "900",
  },
  memoryTitle: {
    color: "#111827",
    fontSize: 19,
    fontWeight: "900",
  },
  memoryBody: {
    color: "#374151",
    fontSize: 15,
    lineHeight: 22,
  },
  memoryReaction: {
    color: "#BE185D",
    fontSize: 14,
    fontWeight: "900",
    lineHeight: 21,
  },
  emptyCard: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#F3E8FF",
    borderRadius: 22,
    borderWidth: 1,
    gap: 8,
    padding: 22,
  },
  emptyTitle: {
    color: "#111827",
    fontSize: 18,
    fontWeight: "900",
  },
});
