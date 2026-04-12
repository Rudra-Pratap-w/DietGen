import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

const Meals = () => {
  const navigation = useNavigation();
  const [meals, setMeals] = useState<
    { id: number; title: string; subtitle: string; calories: number }[]
  >([]);

  // Temporary mock data
  useEffect(() => {
    const mockMeals = [
      {
        id: 1,
        title: "Breakfast",
        subtitle: "Oatmeal + Banana",
        calories: 350,
      },
      {
        id: 2,
        title: "Lunch",
        subtitle: "Chicken Rice Bowl",
        calories: 520,
      },
      {
        id: 3,
        title: "Dinner",
        subtitle: "Salmon + Veggies",
        calories: 480,
      },
    ];

    setMeals([...mockMeals]);
  }, []);

  const addMeal = () => {
    const newMeal = {
      id: Date.now(),
      title: "Snack",
      subtitle: "Protein Bar",
      calories: 200,
    };

    setMeals((prev) => [...prev, newMeal]);
  };

  const updateMeal = (id: any) => {
    setMeals((prev) =>
      prev.map((meal) =>
        meal.id === id ? { ...meal, subtitle: "Updated Meal" } : meal,
      ),
    );
  };

  const deleteMeal = (id: any) => {
    setMeals((prev) => prev.filter((meal) => meal.id !== id));
  };

  const renderItem = ({
    item,
  }: {
    item: { id: number; title: string; subtitle: string; calories: number };
  }) => (
    <TouchableOpacity
      className="bg-[#1e5560] p-4 rounded-xl mb-3 flex-row justify-between items-center"
      onPress={() => updateMeal(item.id)}
      onLongPress={() => deleteMeal(item.id)}
    >
      <View>
        <Text className="text-white font-semibold">{item.title}</Text>
        <Text className="text-gray-300 text-sm">{item.subtitle}</Text>
      </View>

      <Text className="text-white font-bold">{item.calories} kcal</Text>
    </TouchableOpacity>
  );

  return (
    <View className="mt-10 px-4">
      <Text className="text-[#1e5560] text-lg font-bold ml-4 mb-4">
        Today's Meals
      </Text>

      <FlatList
        data={meals}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />

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
