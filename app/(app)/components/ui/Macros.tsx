import React from "react";
import { Text, View } from "react-native";
import MacroCard from "./MacroCard";

interface MacrosProps {
  protein: number;
  carbs: number;
  fats: number;
  consumedProtein?: number;
  consumedCarbs?: number;
  consumedFats?: number;
}

const Macros = ({
  protein,
  carbs,
  fats,
  consumedProtein = 0,
  consumedCarbs = 0,
  consumedFats = 0,
}: MacrosProps) => {
  return (
    <View className="mt-10">
      <Text className="text-3xl ml-4 font-extrabold text-[#0a7ea4]">
        Macros
      </Text>

      <View className="flex-row gap-4 mt-6">
        <MacroCard label="Protein" value={consumedProtein} goal={protein} color="#FF6B6B" />

        <MacroCard label="Carbs" value={consumedCarbs} goal={carbs} color="#4D96FF" />

        <MacroCard label="Fats" value={consumedFats} goal={fats} color="#FFD93D" />
      </View>
    </View>
  );
};

export default Macros;
