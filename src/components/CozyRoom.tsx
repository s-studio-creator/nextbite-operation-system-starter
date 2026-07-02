import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";
import { RoomItem } from "../types";

const roomIcons: Record<RoomItem["type"], string> = {
  plant: "葉",
  lamp: "燈",
  shelf: "架",
  theme: "景",
  furniture: "雲",
  glow: "光"
};

export function CozyRoom({ roomItems }: { roomItems: RoomItem[] }) {
  return (
    <LinearGradient colors={["#FEF3C7", "#FCE7F3"]} style={styles.roomCard}>
      <View>
        <Text style={styles.kicker}>角色房間</Text>
        <Text style={styles.cardTitle}>您的健康小房間</Text>
        <Text style={styles.copy}>完成小儀式後，這個角落會慢慢被佈置起來。</Text>
      </View>
      <View style={styles.roomShelf}>
        {roomItems.length > 0 ? (
          roomItems.slice(0, 4).map((item) => (
            <View key={item.id} style={styles.roomItem}>
              <Text style={styles.roomIcon}>{roomIcons[item.type]}</Text>
              <Text style={styles.roomItemName}>{item.name}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>完成今日小儀式，第一件房間小物就會出現。</Text>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  roomCard: {
    borderRadius: 24,
    gap: 14,
    padding: 16
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
  copy: {
    color: "#6B7280",
    fontSize: 13,
    lineHeight: 19,
    marginTop: 3
  },
  roomShelf: {
    backgroundColor: "rgba(255,255,255,0.62)",
    borderRadius: 18,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 9,
    minHeight: 92,
    padding: 11
  },
  roomItem: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    gap: 5,
    padding: 10,
    width: "47%"
  },
  roomIcon: {
    color: "#BE185D",
    fontSize: 18,
    fontWeight: "900"
  },
  roomItemName: {
    color: "#374151",
    fontSize: 12,
    fontWeight: "800",
    textAlign: "center"
  },
  emptyText: {
    alignSelf: "center",
    color: "#6B7280",
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center"
  }
});
