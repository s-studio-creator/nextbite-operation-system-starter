import { LinearGradient } from "expo-linear-gradient";
import { Image, ImageSourcePropType, StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Ellipse, Line, Path, Rect } from "react-native-svg";
import { BodyEvolutionSnapshot } from "../types";

const characterAssets: Partial<Record<BodyEvolutionSnapshot["archetype"], [ImageSourcePropType, ImageSourcePropType, ImageSourcePropType]>> = {
  barbie: [
    require("../assets/companions/barbie-stage-1.png"),
    require("../assets/companions/barbie-stage-2.png"),
    require("../assets/companions/barbie-stage-3.png")
  ],
  gymBro: [
    require("../assets/companions/gymbro-stage-1.png"),
    require("../assets/companions/gymbro-stage-2.png"),
    require("../assets/companions/gymbro-stage-3.png")
  ]
};

export function BodyEvolutionCard({ snapshot }: { snapshot: BodyEvolutionSnapshot }) {
  const proteinPercent = Math.round(Math.min(snapshot.proteinProgress, 1) * 100);
  const energyText = snapshot.calorieGap >= 0 ? `今日仍有 ${snapshot.calorieGap} kcal 的彈性` : `今天能量已很充足`;
  const assets = characterAssets[snapshot.archetype];

  return (
    <LinearGradient colors={["rgba(255,255,255,0.94)", "rgba(252,231,243,0.78)", "rgba(254,243,199,0.72)"]} style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.kicker}>身形進度</Text>
          <Text style={styles.title}>{snapshot.toneLabel}</Text>
        </View>
        <View style={styles.stagePill}>
          <Text style={styles.stageText}>Lv.{snapshot.stage}</Text>
        </View>
      </View>

      {assets && <StageStrip assets={assets} snapshot={snapshot} />}

      <View style={styles.comparisonRow}>
        <BodyFigure snapshot={snapshot} phase="before" />
        <View style={styles.arrowLine}>
          <View style={styles.arrowDot} />
          <View style={styles.arrowTrack} />
          <Text style={styles.arrowText}>成長中</Text>
        </View>
        <BodyFigure snapshot={snapshot} phase="after" />
      </View>

      <View style={styles.metricRow}>
        <SoftMetric label="蛋白質進度" value={`${proteinPercent}%`} />
        <SoftMetric label="今日熱量" value={energyText} />
      </View>

      <Text style={styles.encouragement}>{snapshot.encouragement}</Text>
    </LinearGradient>
  );
}

function StageStrip({
  assets,
  snapshot
}: {
  assets: [ImageSourcePropType, ImageSourcePropType, ImageSourcePropType];
  snapshot: BodyEvolutionSnapshot;
}) {
  const currentIndex = snapshot.visualScore > 0.72 || snapshot.stage >= 3 ? 2 : snapshot.visualScore > 0.42 || snapshot.stage >= 2 ? 1 : 0;
  const labels = ["Stage 1", "Stage 2", "Stage 3"];

  return (
    <View style={styles.stageStrip}>
      {assets.map((asset, index) => {
        const isActive = index === currentIndex;
        return (
          <View key={labels[index]} style={[styles.stageThumb, isActive && styles.stageThumbActive]}>
            <Image source={asset} style={styles.stageThumbImage} resizeMode="contain" />
            <Text style={[styles.stageThumbText, isActive && styles.stageThumbTextActive]}>{labels[index]}</Text>
          </View>
        );
      })}
    </View>
  );
}

function BodyFigure({ snapshot, phase }: { snapshot: BodyEvolutionSnapshot; phase: "before" | "after" }) {
  const progress = phase === "before" ? 0 : snapshot.visualScore;
  const assets = characterAssets[snapshot.archetype];
  const visualStageIndex = phase === "before" ? 0 : progress > 0.72 || snapshot.stage >= 3 ? 2 : progress > 0.42 || snapshot.stage >= 2 ? 1 : 0;
  const isGym = snapshot.archetype === "gymBro";
  const isBarbie = snapshot.archetype === "barbie";
  const isPet = snapshot.archetype === "pet";
  const label = phase === "before" ? "最初" : snapshot.afterLabel;
  const bodyWidth = isGym ? 24 + progress * 18 : isBarbie ? 22 + progress * 8 : 30 + progress * 10;
  const shoulderWidth = isGym ? 42 + progress * 18 : isBarbie ? 34 + progress * 6 : 36 + progress * 8;
  const waistWidth = isBarbie ? 18 - progress * 4 : isGym ? 24 + progress * 4 : 28 + progress * 5;
  const glow = phase === "after" ? "#BE185D" : "#9CA3AF";

  return (
    <View style={styles.figureBox}>
      {assets ? (
        <Image source={assets[visualStageIndex]} style={[styles.characterImage, phase === "after" && styles.characterImageAfter]} resizeMode="contain" />
      ) : (
        <Svg width={112} height={142} viewBox="0 0 112 142">
          <Circle cx="56" cy="21" r={14 + progress * 2} fill={phase === "after" ? "#FCE7F3" : "#F3F4F6"} stroke={glow} strokeWidth="2" />
          {isPet || snapshot.archetype === "spirit" ? (
            <>
              <Ellipse cx="56" cy="74" rx={bodyWidth} ry={34 + progress * 8} fill={phase === "after" ? "#FDE68A" : "#E5E7EB"} stroke={glow} strokeWidth="2" />
              <Circle cx="43" cy="68" r="4" fill="#111827" />
              <Circle cx="69" cy="68" r="4" fill="#111827" />
              <Path d="M47 82 Q56 90 66 82" stroke="#111827" strokeWidth="3" fill="none" strokeLinecap="round" />
              {snapshot.archetype === "spirit" && <Path d="M56 48 C44 32 66 28 61 11 C78 27 73 43 56 48" fill="#BBF7D0" stroke="#0F766E" strokeWidth="2" />}
            </>
          ) : (
            <>
              <Path
                d={`M${56 - shoulderWidth / 2} 47 C${48 - progress * 2} 62 ${56 - waistWidth / 2} 74 ${56 - bodyWidth / 2} 102 L${56 + bodyWidth / 2} 102 C${56 + waistWidth / 2} 74 ${64 + progress * 2} 62 ${56 + shoulderWidth / 2} 47 Z`}
                fill={phase === "after" ? "#FCE7F3" : "#E5E7EB"}
                stroke={glow}
                strokeWidth="2.4"
              />
              <Line x1={56 - shoulderWidth / 2} y1="52" x2={22 - progress * 3} y2="83" stroke={glow} strokeWidth={isGym ? 7 : 5} strokeLinecap="round" />
              <Line x1={56 + shoulderWidth / 2} y1="52" x2={90 + progress * 3} y2="83" stroke={glow} strokeWidth={isGym ? 7 : 5} strokeLinecap="round" />
              <Line x1={48} y1="101" x2={42 - progress * 2} y2="132" stroke={glow} strokeWidth={isGym ? 8 : 6} strokeLinecap="round" />
              <Line x1={64} y1="101" x2={70 + progress * 2} y2="132" stroke={glow} strokeWidth={isGym ? 8 : 6} strokeLinecap="round" />
              {phase === "after" && <Rect x="46" y="57" width="20" height="5" rx="2.5" fill="rgba(255,255,255,0.65)" />}
            </>
          )}
        </Svg>
      )}
      <Text style={styles.figureLabel}>{label}</Text>
    </View>
  );
}

function SoftMetric({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metricBox}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderColor: "rgba(255,255,255,0.9)",
    borderRadius: 26,
    borderWidth: 1,
    gap: 14,
    overflow: "hidden",
    padding: 17,
    shadowColor: "#F9A8D4",
    shadowOffset: { height: 10, width: 0 },
    shadowOpacity: 0.13,
    shadowRadius: 22
  },
  header: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", gap: 12 },
  kicker: { color: "#BE185D", fontSize: 12, fontWeight: "900" },
  title: { color: "#111827", fontSize: 21, fontWeight: "900", marginTop: 2 },
  stagePill: { backgroundColor: "rgba(255,255,255,0.78)", borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8 },
  stageText: { color: "#BE185D", fontSize: 12, fontWeight: "900" },
  comparisonRow: { alignItems: "center", flexDirection: "row", justifyContent: "space-between" },
  stageStrip: {
    backgroundColor: "rgba(255,255,255,0.44)",
    borderRadius: 20,
    flexDirection: "row",
    gap: 8,
    padding: 8
  },
  stageThumb: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.66)",
    borderColor: "rgba(255,255,255,0.72)",
    borderRadius: 16,
    borderWidth: 1,
    flex: 1,
    gap: 3,
    paddingVertical: 6
  },
  stageThumbActive: {
    borderColor: "#F9A8D4",
    borderWidth: 2
  },
  stageThumbImage: { height: 54, width: "100%" },
  stageThumbText: { color: "#6B7280", fontSize: 11, fontWeight: "900" },
  stageThumbTextActive: { color: "#BE185D" },
  figureBox: { alignItems: "center", backgroundColor: "rgba(255,255,255,0.58)", borderRadius: 22, flex: 1, minHeight: 222, paddingVertical: 10 },
  characterImage: { height: 182, width: "100%" },
  characterImageAfter: { height: 194 },
  figureLabel: { color: "#374151", fontSize: 12, fontWeight: "900", marginTop: 3 },
  arrowLine: { alignItems: "center", gap: 5, paddingHorizontal: 8, width: 64 },
  arrowDot: { backgroundColor: "#F9A8D4", borderRadius: 999, height: 9, width: 9 },
  arrowTrack: { backgroundColor: "#FBCFE8", borderRadius: 999, height: 38, width: 4 },
  arrowText: { color: "#BE185D", fontSize: 11, fontWeight: "900", textAlign: "center" },
  metricRow: { flexDirection: "row", gap: 9 },
  metricBox: { backgroundColor: "rgba(255,255,255,0.7)", borderRadius: 16, flex: 1, padding: 12 },
  metricValue: { color: "#111827", fontSize: 15, fontWeight: "900" },
  metricLabel: { color: "#6B7280", fontSize: 12, fontWeight: "800", marginTop: 3 },
  encouragement: { color: "#6B7280", fontSize: 14, fontWeight: "800", lineHeight: 21 }
});
