import React from "react";
import { Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

const MacroCard = ({ label, value, goal, color }: any) => {
  const progress = (value / goal) * 100;

  const size = 80;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const offset = circumference - (progress / 100) * circumference;

  return (
    <View className="bg-white p-4 rounded-2xl items-center shadow-md">
      <Svg width={size} height={size}>
        <Circle
          stroke="#e6e6e6"
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />

        <Circle
          stroke={color}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>

      <View className="absolute items-center gap-2">
        <Text className="text-lg font-bold mt-12">{value}g</Text>
      </View>

      <Text className="mt-2 text-[#355872] font-semibold">{label}</Text>

      <Text className="text-xs text-gray-400">{Math.round(progress)}%</Text>
    </View>
  );
};

export default MacroCard;
