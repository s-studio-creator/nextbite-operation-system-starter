import { Check, Sparkles } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { GentleMission } from "../types";

export function GentleMissionList({
  missions,
  completedMissionIds,
  onCompleteMission
}: {
  missions: GentleMission[];
  completedMissionIds: string[];
  onCompleteMission: (mission: GentleMission) => void;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.kicker}>Today With Me</Text>
          <Text style={styles.cardTitle}>今日小小儀式</Text>
        </View>
        <Sparkles size={20} color="#BE185D" />
      </View>
      {missions.map((mission) => {
        const completed = completedMissionIds.includes(mission.id);
        return (
          <Pressable
            key={mission.id}
            style={[styles.missionRow, completed && styles.missionRowDone]}
            onPress={() => onCompleteMission(mission)}
            disabled={completed}
          >
            <View style={[styles.checkCircle, completed && styles.checkCircleDone]}>
              {completed && <Check size={15} color="#FFFFFF" />}
            </View>
            <View style={styles.copy}>
              <Text style={styles.missionTitle}>{mission.title}</Text>
              <Text style={styles.missionSubtitle}>{mission.subtitle}</Text>
            </View>
            <Text style={styles.points}>+{mission.glowPoints}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderColor: "#F3E8FF",
    borderRadius: 22,
    borderWidth: 1,
    gap: 12,
    padding: 16,
    shadowColor: "#F9A8D4",
    shadowOffset: { height: 8, width: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 18
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  kicker: {
    color: "#BE185D",
    fontSize: 12,
    fontWeight: "900"
  },
  cardTitle: {
    color: "#111827",
    fontSize: 18,
    fontWeight: "900"
  },
  missionRow: {
    alignItems: "center",
    backgroundColor: "#FFF7ED",
    borderRadius: 17,
    flexDirection: "row",
    gap: 10,
    padding: 12
  },
  missionRowDone: {
    backgroundColor: "#ECFDF5"
  },
  checkCircle: {
    alignItems: "center",
    backgroundColor: "#FCE7F3",
    borderRadius: 999,
    height: 30,
    justifyContent: "center",
    width: 30
  },
  checkCircleDone: {
    backgroundColor: "#0F766E"
  },
  copy: {
    flex: 1
  },
  missionTitle: {
    color: "#111827",
    fontSize: 15,
    fontWeight: "900"
  },
  missionSubtitle: {
    color: "#6B7280",
    fontSize: 13,
    lineHeight: 19
  },
  points: {
    color: "#BE185D",
    fontSize: 13,
    fontWeight: "900"
  }
});
