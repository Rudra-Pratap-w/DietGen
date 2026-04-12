import React from "react";
import { Text, View } from "react-native";
import MacroCard from "./MacroCard";

const Macros = () => {
  return (
    <View className="mt-10">
      <Text className="text-3xl ml-4 font-extrabold text-[#0a7ea4]">
        Macros
      </Text>

      <View className="flex-row gap-4 mt-6">
        <MacroCard label="Protein" value={120} goal={150} color="#FF6B6B" />

        <MacroCard label="Carbs" value={200} goal={250} color="#4D96FF" />

        <MacroCard label="Fats" value={50} goal={70} color="#FFD93D" />
      </View>
    </View>
  );
};

export default Macros;
