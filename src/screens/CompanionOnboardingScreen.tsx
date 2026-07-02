import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { CompanionAvatar } from "../components/CompanionAvatar";
import { Companion } from "../types";

export function CompanionOnboardingScreen({
  companions,
  onChooseCompanion
}: {
  companions: Companion[];
  onChooseCompanion: (companion: Companion, nickname: string) => void;
}) {
  const [selectedCompanionId, setSelectedCompanionId] = useState(companions[0]?.id ?? "");
  const selectedCompanion = companions.find((companion) => companion.id === selectedCompanionId) ?? companions[0];
  const [nickname, setNickname] = useState(selectedCompanion?.name ?? "");

  const selectCompanion = (companion: Companion) => {
    setSelectedCompanionId(companion.id);
    setNickname(companion.name);
  };

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <LinearGradient colors={["#FFF7ED", "#FCE7F3", "#EEF2FF"]} style={styles.hero}>
        <Text style={styles.kicker}>迎新儀式</Text>
        <Text style={styles.title}>選擇一位與您一起成長的角色</Text>
        <Text style={styles.copy}>每次記錄、選擇健康餐廳、保持生活節奏，都會讓角色慢慢成長。</Text>
      </LinearGradient>

      <View style={styles.previewCard}>
        <CompanionAvatar companion={selectedCompanion} size={148} />
        <Text style={styles.previewName}>{selectedCompanion.name}</Text>
        <Text style={styles.previewType}>{selectedCompanion.type}</Text>
        <Text style={styles.previewCopy}>{selectedCompanion.personality}</Text>
      </View>

      <View style={styles.grid}>
        {companions.map((companion) => {
          const isSelected = companion.id === selectedCompanionId;
          return (
            <Pressable key={companion.id} style={[styles.companionCard, isSelected && styles.companionCardActive]} onPress={() => selectCompanion(companion)}>
              <CompanionAvatar companion={companion} size={86} />
              <Text style={styles.companionName}>{companion.name}</Text>
              <Text style={styles.companionType}>{companion.type}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.renameCard}>
        <Text style={styles.fieldLabel}>為角色命名</Text>
        <TextInput value={nickname} onChangeText={setNickname} style={styles.input} placeholder="例如：Mimi" />
      </View>

      <Pressable style={styles.primaryButton} onPress={() => onChooseCompanion(selectedCompanion, nickname)}>
        <Text style={styles.primaryButtonText}>開始照顧 {nickname.trim() || selectedCompanion.name}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "#FFF7ED",
    gap: 16,
    padding: 18,
    paddingBottom: 40
  },
  hero: {
    borderRadius: 24,
    gap: 10,
    padding: 22
  },
  kicker: {
    color: "#BE185D",
    fontSize: 13,
    fontWeight: "900"
  },
  title: {
    color: "#111827",
    fontSize: 30,
    fontWeight: "900",
    lineHeight: 36
  },
  copy: {
    color: "#6B7280",
    fontSize: 15,
    lineHeight: 23
  },
  previewCard: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    gap: 7,
    padding: 20,
    shadowColor: "#F9A8D4",
    shadowOffset: { height: 10, width: 0 },
    shadowOpacity: 0.16,
    shadowRadius: 20
  },
  previewName: {
    color: "#111827",
    fontSize: 24,
    fontWeight: "900"
  },
  previewType: {
    color: "#0F766E",
    fontSize: 14,
    fontWeight: "900"
  },
  previewCopy: {
    color: "#6B7280",
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center"
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  companionCard: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#F3E8FF",
    borderRadius: 20,
    borderWidth: 1,
    flexBasis: "48%",
    flexGrow: 1,
    gap: 5,
    padding: 13
  },
  companionCardActive: {
    borderColor: "#BE185D",
    borderWidth: 2
  },
  companionName: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "900"
  },
  companionType: {
    color: "#6B7280",
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center"
  },
  renameCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    gap: 8,
    padding: 15
  },
  fieldLabel: {
    color: "#374151",
    fontSize: 14,
    fontWeight: "900"
  },
  input: {
    backgroundColor: "#F9FAFB",
    borderColor: "#E5E7EB",
    borderRadius: 12,
    borderWidth: 1,
    color: "#111827",
    fontSize: 16,
    minHeight: 48,
    paddingHorizontal: 12
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: "#111827",
    borderRadius: 16,
    justifyContent: "center",
    minHeight: 54
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900"
  }
});
