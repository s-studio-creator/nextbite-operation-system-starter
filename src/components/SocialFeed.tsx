import { StyleSheet, Text, View } from "react-native";
import { FeedItem } from "../types";

const kindLabels: Record<FeedItem["kind"], string> = {
  meal: "健康選擇",
  streak: "連續紀錄",
  restaurant: "餐廳發現",
  mission: "小小儀式",
  room: "房間佈置",
  recovery: "溫柔重啟"
};

export function SocialFeed({ items }: { items: FeedItem[] }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>今日 wellness feed</Text>
      {items.map((item) => (
        <View key={item.id} style={styles.feedItem}>
          <View style={styles.feedDot}>
            <Text style={styles.feedDotText}>{kindLabels[item.kind].slice(0, 1)}</Text>
          </View>
          <View style={styles.feedCopy}>
            <Text style={styles.feedTitle}>{item.title}</Text>
            <Text style={styles.feedSubtitle}>{item.subtitle}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderColor: "#F3E8FF",
    borderRadius: 18,
    borderWidth: 1,
    gap: 13,
    padding: 16,
    shadowColor: "#C084FC",
    shadowOffset: { height: 8, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 18
  },
  cardTitle: {
    color: "#111827",
    fontSize: 18,
    fontWeight: "900"
  },
  feedItem: {
    alignItems: "center",
    flexDirection: "row",
    gap: 11
  },
  feedDot: {
    alignItems: "center",
    backgroundColor: "#FCE7F3",
    borderRadius: 999,
    height: 38,
    justifyContent: "center",
    width: 38
  },
  feedDotText: {
    color: "#BE185D",
    fontSize: 13,
    fontWeight: "900"
  },
  feedCopy: {
    flex: 1
  },
  feedTitle: {
    color: "#111827",
    fontSize: 15,
    fontWeight: "900"
  },
  feedSubtitle: {
    color: "#6B7280",
    fontSize: 13,
    lineHeight: 19
  }
});
