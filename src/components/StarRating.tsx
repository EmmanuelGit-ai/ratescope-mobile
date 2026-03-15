// StarRating — Five-star score display
// The HERO element of RateScope — large and prominent everywhere

import { View, Text, StyleSheet } from "react-native";
import { Star } from "lucide-react-native";
import {
  fontSize,
  fontWeight,
  spacing,
  getScoreColor,
  getScoreLabel,
} from "../constants/theme";

interface StarRatingProps {
  score: number;
  size?: "sm" | "md" | "lg" | "hero";
  showLabel?: boolean;
  showNumeric?: boolean;
}

const STAR_SIZES = {
  sm: 14,
  md: 18,
  lg: 22,
  hero: 28,
} as const;

const FONT_SIZES = {
  sm: fontSize.sm,
  md: fontSize.md,
  lg: fontSize.xl,
  hero: fontSize.hero,
} as const;

const LABEL_SIZES = {
  sm: fontSize.xs,
  md: fontSize.xs,
  lg: fontSize.sm,
  hero: fontSize.md,
} as const;

export function StarRating({
  score,
  size = "md",
  showLabel = false,
  showNumeric = true,
}: StarRatingProps) {
  const scoreColor = getScoreColor(score);
  const starSize = STAR_SIZES[size];
  const clampedScore = Math.max(0, Math.min(5, score));
  const fullStars = Math.floor(clampedScore);
  const hasHalf = clampedScore - fullStars >= 0.25 && clampedScore - fullStars < 0.75;
  const filledStars = hasHalf ? fullStars : Math.round(clampedScore);

  return (
    <View style={styles.container}>
      <View style={styles.starsRow}>
        {Array.from({ length: 5 }, (_, i) => {
          const filled = i < filledStars || (hasHalf && i === fullStars);
          const isHalf = hasHalf && i === fullStars;
          return (
            <View key={i} style={{ marginRight: 2 }}>
              {isHalf ? (
                <View style={{ width: starSize, height: starSize, position: "relative" }}>
                  <Star
                    size={starSize}
                    color={scoreColor}
                    strokeWidth={1.5}
                    style={{ position: "absolute" }}
                  />
                  <View style={{ overflow: "hidden", width: starSize / 2, height: starSize, position: "absolute" }}>
                    <Star
                      size={starSize}
                      color={scoreColor}
                      fill={scoreColor}
                      strokeWidth={1.5}
                    />
                  </View>
                </View>
              ) : (
                <Star
                  size={starSize}
                  color={scoreColor}
                  fill={filled ? scoreColor : "transparent"}
                  strokeWidth={1.5}
                />
              )}
            </View>
          );
        })}
      </View>
      {showNumeric && (
        <Text
          style={[
            styles.scoreText,
            { color: scoreColor, fontSize: FONT_SIZES[size] },
          ]}
        >
          {clampedScore.toFixed(1)}
        </Text>
      )}
      {showLabel && (
        <Text
          style={[
            styles.label,
            { color: scoreColor, fontSize: LABEL_SIZES[size] },
          ]}
        >
          {getScoreLabel(clampedScore)}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  starsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  scoreText: {
    fontWeight: fontWeight.bold,
    marginLeft: spacing.xs,
  },
  label: {
    fontWeight: fontWeight.medium,
    marginLeft: spacing.xs,
  },
});
