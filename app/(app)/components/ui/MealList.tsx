import { useNavigation } from "@react-navigation/native";
import React from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

interface Meal {
  type: "Breakfast" | "Lunch" | "Dinner" | "Snack";
  title: string;
  subtitle: string;
  calories: number;
}

interface MealListProps {
  meals: Meal[];
}

const Meals = ({ meals }: MealListProps) => {
  const navigation = useNavigation();

  const renderItem = ({ item, index }: { item: Meal; index: number }) => (
    <TouchableOpacity className="bg-[#1e5560] p-4 rounded-xl mb-3 flex-row justify-between items-center">
      <View className="flex-row items-center gap-3">
        <View className="bg-white/15 w-9 h-9 rounded-full items-center justify-center">
          <Text className="text-white font-bold text-sm">
            {item.type === "Breakfast"
              ? "🌅"
              : item.type === "Lunch"
                ? "☀️"
                : "🌙"}
          </Text>
        </View>
        <View>
          <Text className="text-white font-semibold">{item.title}</Text>
          <Text className="text-gray-300 text-sm">{item.subtitle}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="mt-10 px-4">
      <Text className="text-[#1e5560] text-lg font-bold ml-4 mb-4">
        Today's Meals
      </Text>

      {meals.length === 0 ? (
        <View className="bg-[#1e5560]/10 p-6 rounded-xl mb-3 items-center justify-center border border-[#1e5560]/20 border-dashed">
          <Text className="text-[#1e5560] font-semibold text-center mb-2">
            No meals logged yet
          </Text>
          <Text className="text-[#1e5560]/70 text-sm text-center">
            Tap "Log Snack" or go to Suggestions to add your meals for today.
          </Text>
        </View>
      ) : (
        <FlatList
          data={meals}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item.title}-${index}`}
          horizontal={true} // Swaps scrolling direction
          showsHorizontalScrollIndicator={false} // Hides the scroll bar for a cleaner UI
          contentContainerStyle={{ paddingRight: 20 }}
        />
      )}

      <TouchableOpacity
        onPress={() => navigation.navigate("suggestion" as never)}
        className="border border-dashed border-[#1e5560] rounded-xl py-4 items-center mt-3"
      >
        <Text className="text-[#1e5560] text-lg">+ Log Snack</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Meals;
