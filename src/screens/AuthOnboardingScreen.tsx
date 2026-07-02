import { LinearGradient } from "expo-linear-gradient";
import { Mail, Phone, UserRound } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { AuthMethod } from "../types";

export function AuthOnboardingScreen({ onConnect }: { onConnect: (method: AuthMethod) => void }) {
  return (
    <LinearGradient colors={["#FFF7ED", "#FCE7F3", "#E0E7FF"]} style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.kicker}>開始之前</Text>
        <Text style={styles.title}>連接帳戶，保存您的健康世界</Text>
        <Text style={styles.copy}>您可以使用 Apple、電郵、電話號碼，或先以訪客身份體驗。正式登入系統日後可接入後端服務。</Text>

        <Pressable style={styles.primaryButton} onPress={() => onConnect("apple")}>
          <UserRound size={19} color="#FFFFFF" />
          <Text style={styles.primaryButtonText}>使用 Apple 連接</Text>
        </Pressable>
        <Pressable style={styles.secondaryButton} onPress={() => onConnect("email")}>
          <Mail size={19} color="#111827" />
          <Text style={styles.secondaryButtonText}>使用電郵連接</Text>
        </Pressable>
        <Pressable style={styles.secondaryButton} onPress={() => onConnect("phone")}>
          <Phone size={19} color="#111827" />
          <Text style={styles.secondaryButtonText}>使用電話號碼連接</Text>
        </Pressable>
        <Pressable style={styles.textButton} onPress={() => onConnect("guest")}>
          <Text style={styles.textButtonText}>先以訪客身份體驗</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: "center", padding: 18 },
  card: {
    backgroundColor: "rgba(255,255,255,0.78)",
    borderRadius: 28,
    gap: 13,
    padding: 22,
    shadowColor: "#F9A8D4",
    shadowOffset: { height: 14, width: 0 },
    shadowOpacity: 0.16,
    shadowRadius: 26
  },
  kicker: { color: "#BE185D", fontSize: 13, fontWeight: "900" },
  title: { color: "#111827", fontSize: 30, fontWeight: "900", lineHeight: 36 },
  copy: { color: "#6B7280", fontSize: 15, lineHeight: 23 },
  primaryButton: {
    alignItems: "center",
    backgroundColor: "#111827",
    borderRadius: 16,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    minHeight: 54
  },
  primaryButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "900" },
  secondaryButton: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    minHeight: 52
  },
  secondaryButtonText: { color: "#111827", fontSize: 15, fontWeight: "900" },
  textButton: { alignItems: "center", paddingVertical: 8 },
  textButtonText: { color: "#BE185D", fontSize: 14, fontWeight: "900" }
});
