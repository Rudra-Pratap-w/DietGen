import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

const ProgressRing = ({ progress = 75, value = 1250 }) => {
  const size = 220;
  const strokeWidth = 18;

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const offset = circumference - (progress / 100) * circumference;

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        {/* background circle */}
        <Circle
          stroke="#76D2DB"
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />

        {/* progress circle */}
        <Circle
          stroke="#0a7ea4"
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-120 ${size / 2} ${size / 2})`}
        />
      </Svg>

      {/* center content */}
      <View style={styles.center}>
        <Text style={styles.value}>{value.toLocaleString()}</Text>
        <Text style={styles.label}>kcal left</Text>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>{progress}% of goal</Text>
        </View>
      </View>
    </View>
  );
};

export default ProgressRing;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  center: {
    position: "absolute",
    alignItems: "center",
  },
  value: {
    color: "#0a7ea4",
    fontSize: 32,
    fontWeight: "bold",
  },
  label: {
    color: "gray",
    fontSize: 14,
    marginTop: 4,
  },
  badge: {
    marginTop: 10,
    backgroundColor: "#355872",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    color: "#F3F4F4",
    fontSize: 12,
  },
});
